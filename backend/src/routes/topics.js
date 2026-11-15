const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const { mapTopic } = require('../lib/mappers');

function validateTopic(body) {
    const errors = [];
    if (typeof body.title !== 'string' || body.title.trim() === '') {
        errors.push('title: string não vazia obrigatória');
    }
    if (typeof body.body !== 'string') {
        errors.push('body: string obrigatória');
    }
    return errors;
}

router.post('/admin/topics', requireAuth, async (req, res, next) => {
    try {
        const errors = validateTopic(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: 'Validação falhou', details: errors });
        }
        const [result] = await pool.query(
            `INSERT INTO profile_topics (title, body, position)
             SELECT ?, ?, COALESCE(MAX(position), 0) + 1 FROM profile_topics`,
            [req.body.title.trim(), req.body.body.trim()]
        );
        const [rows] = await pool.query('SELECT * FROM profile_topics WHERE id = ?', [result.insertId]);
        res.status(201).json(mapTopic(rows[0]));
    } catch (err) {
        next(err);
    }
});

router.put('/admin/topics/:id', requireAuth, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: 'ID inválido: deve ser numérico' });
        }
        const [existing] = await pool.query('SELECT * FROM profile_topics WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Tópico não encontrado' });
        }
        const errors = validateTopic(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: 'Validação falhou', details: errors });
        }
        await pool.query(
            'UPDATE profile_topics SET title = ?, body = ? WHERE id = ?',
            [req.body.title.trim(), req.body.body.trim(), id]
        );
        const [rows] = await pool.query('SELECT * FROM profile_topics WHERE id = ?', [id]);
        res.json(mapTopic(rows[0]));
    } catch (err) {
        next(err);
    }
});

router.delete('/admin/topics/:id', requireAuth, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: 'ID inválido: deve ser numérico' });
        }
        const [result] = await pool.query('DELETE FROM profile_topics WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Tópico não encontrado' });
        }
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
