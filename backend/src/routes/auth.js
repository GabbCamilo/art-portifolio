const express = require('express');
const router = express.Router();
const pool = require('../db');
const { hashPassword, verifyPassword } = require('../lib/passwords');
const { createSession, deleteSession } = require('../lib/sessions');
const { requireAuth } = require('../middleware/auth');

function validateLogin(body) {
    const errors = [];
    if (typeof body.username !== 'string' || body.username.trim() === '') {
        errors.push('username: string não vazia obrigatória');
    }
    if (typeof body.password !== 'string' || body.password.length === 0) {
        errors.push('password: string obrigatória');
    }
    return errors;
}

router.post('/admin/login', async (req, res, next) => {
    try {
        const errors = validateLogin(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: 'Validação falhou', details: errors });
        }
        const { username, password } = req.body;
        const { rows } = await pool.query(
            'SELECT id, username, password_hash FROM admin_users WHERE username = $1',
            [username]
        );
        if (rows.length === 0 || !verifyPassword(password, rows[0].password_hash)) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        const { token, expiresAt } = await createSession(rows[0].id);
        res.status(200).json({ token, expires_at: expiresAt, admin: { username: rows[0].username } });
    } catch (err) {
        next(err);
    }
});

router.post('/admin/logout', requireAuth, async (req, res, next) => {
    try {
        await deleteSession(req.sessionToken);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.get('/admin/session', requireAuth, async (req, res, next) => {
    try {
        res.json({ username: req.adminUsername, expires_at: req.sessionExpiresAt });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
