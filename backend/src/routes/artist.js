const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/artist', async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            'SELECT name, location, medium, website, store, patreon FROM artist_profile WHERE id = 1'
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Perfil do artista não encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
