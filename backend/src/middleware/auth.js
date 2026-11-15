function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de administração necessário (Authorization: Bearer <token>)' });
    }
    const token = authHeader.slice(7).trim();
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Token inválido' });
    }
    next();
}

module.exports = { requireAuth };
