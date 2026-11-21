const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const { mapArtist, mapPublication } = require('../lib/mappers');
const path = require('path');
const { unlink } = require('fs/promises');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        cb(null, Boolean(file.mimetype && file.mimetype.startsWith('image/')));
    },
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('[uploads] Variáveis do Cloudinary não configuradas. Defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.');
}

async function uploadToCloudinary(buffer, mimetype, originalName) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'art-portfolio',
                resource_type: 'image',
                use_filename: true,
                unique_filename: false,
                format: 'webp',
                quality: 'auto:good',
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
}

router.post('/admin/uploads', requireAuth, upload.single('file'), async (req, res, next) => {
    try {
        const slot = req.query.slot;
        if (!['featured', 'profile', 'feed'].includes(slot)) {
            return res.status(400).json({ error: 'slot inválido: featured, profile ou feed' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'arquivo de imagem obrigatório' });
        }

        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            return res.status(503).json({ error: 'Storage de imagens não configurado. Defina CLOUDINARY_* no backend.' });
        }

        const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, req.file.originalname);

        const fileName = result.secure_url;
        const file_size = `${Math.round(result.bytes / 1024)} KB`;
        const width = result.width;
        const height = result.height;

        if (slot === 'profile') {
            await pool.query(
                `UPDATE artist_profile SET image_file_name = $1, image_file_size = $2, image_width = $3, image_height = $4 WHERE id = 1`,
                [fileName, file_size, width, height]
            );
            const { rows } = await pool.query('SELECT * FROM artist_profile WHERE id = 1');
            return res.json({ image: { file_name: fileName, file_size, width, height } });
        }

        const featured = slot === 'featured';
        const { rows: existing } = await pool.query('SELECT id FROM publications WHERE file_name = $1', [fileName]);
        if (existing.length > 0) {
            if (featured) {
                await pool.query('UPDATE publications SET featured = false WHERE featured = true');
            }
            await pool.query(
                `UPDATE publications SET featured = $1, file_size = $2, width = $3, height = $4, description = '', complementary = '' WHERE id = $5`,
                [featured, file_size, width, height, existing[0].id]
            );
        } else {
            await pool.query(
                `INSERT INTO publications (description, complementary, published_at, featured, file_name, file_size, width, height)
                 VALUES ('', '', CURRENT_DATE, $1, $2, $3, $4, $5)`,
                [featured, fileName, file_size, width, height]
            );
        }
        const { rows } = await pool.query('SELECT * FROM publications WHERE file_name = $1', [fileName]);
        res.json(mapPublication(rows[0]));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
