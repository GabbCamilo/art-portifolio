const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const { mapPublication } = require('../lib/mappers');

function validatePublication(body) {
    const errors = [];
    if (typeof body.title !== 'string' || body.title.trim() === '') {
        errors.push('title: string não vazia obrigatória');
    }
    if (typeof body.description !== 'string') {
        errors.push('description: string obrigatória');
    }
    if (body.complementary !== undefined && typeof body.complementary !== 'string') {
        errors.push('complementary: deve ser string');
    }
    if (typeof body.published_at !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.published_at)) {
        errors.push('published_at: obrigatório no formato YYYY-MM-DD');
    }
    if (typeof body.featured !== 'boolean') {
        errors.push('featured: boolean obrigatório');
    }
    if (typeof body.file_name !== 'string' || body.file_name.trim() === '') {
        errors.push('file_name: string não vazia obrigatória');
    }
    if (typeof body.file_size !== 'string' || body.file_size.trim() === '') {
        errors.push('file_size: string não vazia obrigatória');
    }
    if (!Number.isInteger(body.width) || body.width <= 0) {
        errors.push('width: inteiro positivo obrigatório');
    }
    if (!Number.isInteger(body.height) || body.height <= 0) {
        errors.push('height: inteiro positivo obrigatório');
    }
    return errors;
}

router.post('/admin/publications', requireAuth, async (req, res, next) => {
    try {
        const errors = validatePublication(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: 'Validação falhou', details: errors });
        }
        const { title, description, complementary, published_at, featured, file_name, file_size, width, height } = req.body;
        const { rows } = await pool.query(
            `INSERT INTO publications (title, description, complementary, published_at, featured, file_name, file_size, width, height)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id`,
            [title, description, complementary || '', published_at, featured, file_name, file_size, width, height]
        );
        const insertedId = rows[0].id;
        const { rows: dbRows } = await pool.query('SELECT * FROM publications WHERE id = $1', [insertedId]);
        res.status(201).json(mapPublication(dbRows[0]));
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
        const { rows: existing } = await pool.query('SELECT * FROM publications WHERE id = $1', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Publicação não encontrada' });
        }

        const errors = validatePublication(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: 'Validação falhou', details: errors });
        }

        const { title, description, complementary, published_at, featured, file_name, file_size, width, height } = req.body;
        await pool.query(
            `UPDATE publications SET title = $1, description = $2, complementary = $3, published_at = $4, featured = $5, file_name = $6, file_size = $7, width = $8, height = $9 WHERE id = $10`,
            [title, description, complementary || '', published_at, featured, file_name, file_size, width, height, id]
        );
        const { rows } = await pool.query('SELECT * FROM publications WHERE id = $1', [id]);
        res.json(mapPublication(rows[0]));
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
        const { rowCount } = await pool.query('DELETE FROM publications WHERE id = $1', [id]);
        if (rowCount === 0) {
            return res.status(404).json({ error: 'Publicação não encontrada' });
        }
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
