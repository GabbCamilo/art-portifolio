const express = require('express');
const router = express.Router();
const pool = require('../db');
const { mapPublication } = require('../lib/mappers');

router.get('/publications', async (req, res, next) => {
    try {
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 6);
        const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);
        const featured = req.query.featured;

        const where = [];
        const params = [];
        if (featured === 'true') {
            where.push('featured = 1');
        } else if (featured === 'false') {
            where.push('featured = 0');
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

        const [countRows] = await pool.query(
            `SELECT COUNT(*) AS total FROM publications ${whereSql}`,
            params
        );
        const total = countRows[0].total;

        const [rows] = await pool.query(
            `SELECT * FROM publications ${whereSql} ORDER BY published_at DESC, id DESC LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        res.json({ items: rows.map(mapPublication), total, limit, offset });
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
        const [rows] = await pool.query('SELECT * FROM publications WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Publicação não encontrada' });
        }
        res.json(mapPublication(rows[0]));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
