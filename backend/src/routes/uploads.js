const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const { mapArtist, mapPublication } = require('../lib/mappers');
const path = require('path');
const { unlink } = require('fs/promises');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        cb(null, Boolean(file.mimetype && file.mimetype.startsWith('image/')));
    },
});

const IMAGE_SERVICE_URL = process.env.IMAGE_SERVICE_URL || 'http://localhost:8000';
const STORAGE_ROOT = path.join(__dirname, '../../storage');

async function deleteStoredFiles(fileName) {
    await unlink(path.join(STORAGE_ROOT, 'images', fileName)).catch(() => {});
    const stem = path.parse(fileName).name;
    for (const variant of ['thumbnail', 'medium', 'full']) {
        await unlink(path.join(STORAGE_ROOT, 'processed', `${stem}-${variant}.webp`)).catch(() => {});
    }
}

async function processWithImageService(buffer, mimetype, originalName) {
    const form = new FormData();
    form.append('file', new Blob([buffer], { type: mimetype }), originalName);
    const res = await fetch(`${IMAGE_SERVICE_URL}/process`, {
        method: 'POST',
        body: form,
    });
    if (!res.ok) {
        const text = await res.text().catch(() => res.status.toString());
        throw new Error(`Serviço de imagens respondeu ${res.status}: ${text}`);
    }
    return res.json();
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

        const result = await processWithImageService(req.file.buffer, req.file.mimetype, req.file.originalname);
        const { file_name, file_size, width, height } = result.original;

        if (slot === 'profile') {
            await pool.query(
                `UPDATE artist_profile SET image_file_name = $1, image_file_size = $2, image_width = $3, image_height = $4 WHERE id = 1`,
                [file_name, file_size, width, height]
            );
            const { rows } = await pool.query('SELECT * FROM artist_profile WHERE id = 1');
            return res.json({ image: { file_name, file_size, width, height } });
        }

        const featured = slot === 'featured';
        const { rows: existing } = await pool.query('SELECT id FROM publications WHERE file_name = $1', [file_name]);
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
                [featured, file_name, file_size, width, height]
            );
        }
        const { rows } = await pool.query('SELECT * FROM publications WHERE file_name = $1', [file_name]);
        res.json(mapPublication(rows[0]));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
