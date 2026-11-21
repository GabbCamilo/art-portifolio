const express = require('express');
const { Readable } = require('stream');
const router = express.Router();

function isAllowedCloudinaryUrl(rawUrl) {
    if (typeof rawUrl !== 'string') return false;
    try {
        const parsed = new URL(rawUrl);
        return (
            parsed.protocol === 'https:' &&
            parsed.hostname === 'res.cloudinary.com' &&
            parsed.pathname.includes('/image/upload/')
        );
    } catch {
        return false;
    }
}

router.get('/media', async (req, res, next) => {
    try {
        const targetUrl = req.query.url;
        if (!isAllowedCloudinaryUrl(targetUrl)) {
            return res.status(400).json({ error: 'URL de mídia inválida' });
        }

        const upstream = await fetch(targetUrl);
        if (!upstream.ok) {
            return res.status(upstream.status).json({ error: 'Falha ao carregar imagem do storage' });
        }

        const contentType = upstream.headers.get('content-type') || 'image/jpeg';
        const contentLength = upstream.headers.get('content-length');
        res.setHeader('Content-Type', contentType);
        if (contentLength) res.setHeader('Content-Length', contentLength);
        res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

        if (!upstream.body) {
            return res.status(502).end();
        }
        Readable.fromWeb(upstream.body).pipe(res);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
