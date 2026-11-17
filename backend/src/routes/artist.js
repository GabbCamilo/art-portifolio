const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const { mapArtist } = require('../lib/mappers');

const LABEL_KEYS = ['artist', 'location', 'medium', 'website', 'store', 'patreon', 'description'];

function validateArtist(body) {
    const errors = [];
    for (const key of ['name', 'location', 'medium', 'website', 'store', 'patreon']) {
        if (typeof body[key] !== 'string') {
            errors.push(`${key}: string obrigatória`);
        }
    }
    if (body.labels !== undefined) {
        if (typeof body.labels !== 'object' || body.labels === null || Array.isArray(body.labels)) {
            errors.push('labels: objeto obrigatório');
        } else {
            for (const [key, value] of Object.entries(body.labels)) {
                if (!LABEL_KEYS.includes(key)) {
                    errors.push(`labels.${key}: campo não permitido`);
                }
                if (typeof value !== 'string') {
                    errors.push(`labels.${key}: string obrigatória`);
                }
            }
        }
    }
    return errors;
}

router.get('/artist', async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM artist_profile WHERE id = 1');
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Perfil do artista não encontrado' });
        }
        res.json(mapArtist(rows[0]));
    } catch (err) {
        next(err);
    }
});

router.put('/admin/artist', requireAuth, async (req, res, next) => {
    try {
        const errors = validateArtist(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: 'Validação falhou', details: errors });
        }
        const { name, location, medium, website, store, patreon, labels } = req.body;
        await pool.query(
            `UPDATE artist_profile SET name = $1, location = $2, medium = $3, website = $4, store = $5, patreon = $6, labels = $7 WHERE id = 1`,
            [name, location, medium, website, store, patreon, JSON.stringify(labels || {})]
        );
        const { rows: artistRows } = await pool.query('SELECT * FROM artist_profile WHERE id = 1');
        res.json(mapArtist(artistRows[0]));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
