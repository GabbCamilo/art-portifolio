const express = require('express');
const router = express.Router();
const pool = require('../db');
const { mapPublication } = require('../lib/mappers');
const { requireAuth } = require('../middleware/auth');
const { deleteFromCloudinaryByUrl } = require('../lib/cloudinary');

function validatePublication(body) {
    const errors = [];
    if (typeof body.featured !== 'boolean') {
        errors.push('featured: boolean obrigatório');
    }
    if (typeof body.file_name !== 'string' || body.file_name.trim() === '') {
        errors.push('file_name: string não vazia obrigatória');
    }
    if (typeof body.file_size !== 'string' || body.file_size.trim() === '') {
        errors.push('file_size: string não vazia obrigatória');
    }
    if (typeof body.width !== 'number' || !Number.isInteger(body.width) || body.width <= 0) {
        errors.push('width: inteiro positivo obrigatório');
    }
    if (typeof body.height !== 'number' || !Number.isInteger(body.height) || body.height <= 0) {
        errors.push('height: inteiro positivo obrigatório');
    }
    if (body.description !== undefined && typeof body.description !== 'string') {
        errors.push('description: string obrigatória');
    }
    if (body.complementary !== undefined && typeof body.complementary !== 'string') {
        errors.push('complementary: string obrigatória');
    }
    return errors;
}

router.get('/publications', async (req, res, next) => {
    try {
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 6);
        const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);
        const featured = req.query.featured;

        const where = [];
        const params = [];
        if (featured === 'true') {
            where.push('featured = true');
        } else if (featured === 'false') {
            where.push('featured = false');
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

        const { rows: countRows } = await pool.query(
            `SELECT COUNT(*)::int AS total FROM publications ${whereSql}`,
            params
        );
        const total = countRows[0].total;

        const paramCount = params.length;
        const { rows } = await pool.query(
            `SELECT * FROM publications ${whereSql} ORDER BY published_at DESC, id DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
            [...params, limit, offset]
        );

        const items = featured === 'true'
            ? rows.map((row) => mapPublication(row, true))
            : rows.map((row) => mapPublication(row));
        res.json({ items, total, limit, offset });
    } catch (err) {
        next(err);
    }
});

router.post('/admin/publications', requireAuth, async (req, res, next) => {
    try {
        const errors = validatePublication(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: 'Validação falhou', details: errors });
        }
        const { description, complementary, featured, file_name, file_size, width, height } = req.body;

        await pool.query(
            `INSERT INTO publications (description, complementary, published_at, featured, file_name, file_size, width, height)
             VALUES ('', '', CURRENT_DATE, $1, $2, $3, $4, $5)
             ON CONFLICT (file_name) DO UPDATE SET featured = EXCLUDED.featured, file_size = EXCLUDED.file_size, width = EXCLUDED.width, height = EXCLUDED.height`,
            [featured, file_name, file_size, width, height]
        );
        const { rows } = await pool.query('SELECT * FROM publications WHERE file_name = $1', [file_name]);
        res.status(201).json(mapPublication(rows[0]));
    } catch (err) {
        next(err);
    }
});

router.put('/admin/publications/:id', requireAuth, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: 'ID inválido: deve ser numérico' });
        }
        const { description, complementary } = req.body;

        if (description !== undefined && typeof description !== 'string') {
            return res.status(400).json({ error: 'Validação falhou', details: ['description: string obrigatória'] });
        }
        if (complementary !== undefined && typeof complementary !== 'string') {
            return res.status(400).json({ error: 'Validação falhou', details: ['complementary: string obrigatória'] });
        }

        const { rows: fileRows } = await pool.query('SELECT file_name FROM publications WHERE id = $1', [id]);
        if (fileRows.length === 0) {
            return res.status(404).json({ error: 'Publicação não encontrada' });
        }
        await pool.query(
            `UPDATE publications SET description = $1, complementary = $2 WHERE id = $3`,
            [description || '', complementary || '', id]
        );
        const { rows } = await pool.query('SELECT * FROM publications WHERE id = $1', [id]);
        res.json(mapPublication(rows[0], true));
    } catch (err) {
        next(err);
    }
});

router.delete('/admin/publications/:id', requireAuth, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: 'ID inválido: deve ser numérico' });
        }
        const { rows: fileRows } = await pool.query('SELECT file_name FROM publications WHERE id = $1', [id]);
        if (fileRows.length === 0) {
            return res.status(404).json({ error: 'Publicação não encontrada' });
        }
        await pool.query('DELETE FROM publications WHERE id = $1', [id]);
        await deleteFromCloudinaryByUrl(fileRows[0].file_name).catch((err) => {
            console.warn('[cloudinary] Falha ao remover imagem:', err.message);
        });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.get('/publications/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: 'ID inválido: deve ser numérico' });
        }
        const { rows } = await pool.query('SELECT * FROM publications WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Publicação não encontrada' });
        }
        res.json(mapPublication(rows[0]));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
