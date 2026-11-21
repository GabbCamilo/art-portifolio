const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const { mapPublication } = require('../lib/mappers');
const { isCloudinaryConfigured, uploadBufferToCloudinary } = require('../lib/cloudinary');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        cb(null, Boolean(file.mimetype && file.mimetype.startsWith('image/')));
    },
});

router.post('/admin/uploads', requireAuth, upload.single('file'), async (req, res, next) => {
    try {
        const slot = req.query.slot;
        if (!['featured', 'profile', 'feed'].includes(slot)) {
            return res.status(400).json({ error: 'slot inválido: featured, profile ou feed' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'arquivo de imagem obrigatório' });
        }

        if (!isCloudinaryConfigured()) {
            return res.status(503).json({
                error: 'Storage de imagens não configurado. Defina CLOUDINARY_URL ou CLOUDINARY_* no backend.',
            });
        }

        const result = await uploadBufferToCloudinary(req.file.buffer);

        const fileName = result.secure_url;
        const file_size = `${Math.round(result.bytes / 1024)} KB`;
        const width = result.width;
        const height = result.height;

        if (slot === 'profile') {
            await pool.query(
                `UPDATE artist_profile SET image_file_name = $1, image_file_size = $2, image_width = $3, image_height = $4 WHERE id = 1`,
                [fileName, file_size, width, height]
            );
            return res.json({ image: { file_name: fileName, file_size, width, height } });
        }

        const featured = slot === 'featured';
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            if (featured) {
                await client.query('UPDATE publications SET featured = false WHERE featured = true');
            }
            const { rows } = await client.query(
                `INSERT INTO publications (description, complementary, published_at, featured, file_name, file_size, width, height)
                 VALUES ('', '', CURRENT_DATE, $1, $2, $3, $4, $5)
                 ON CONFLICT (file_name) DO UPDATE SET
                    featured = EXCLUDED.featured,
                    file_size = EXCLUDED.file_size,
                    width = EXCLUDED.width,
                    height = EXCLUDED.height,
                    description = '',
                    complementary = ''
                 RETURNING *`,
                [featured, fileName, file_size, width, height]
            );
            await client.query('COMMIT');
            res.json(mapPublication(rows[0]));
        } catch (dbErr) {
            await client.query('ROLLBACK').catch(() => {});
            throw dbErr;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('[uploads] Erro:', err.message);
        next(err);
    }
});

module.exports = router;
