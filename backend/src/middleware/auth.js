const { getSessionByToken } = require('../lib/sessions');

function extractToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7).trim();
    return token.length > 0 ? token : null;
}

async function requireAuth(req, res, next) {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({ error: 'Sessão de administração necessária (Authorization: Bearer <token>)' });
    }
    try {
        const session = await getSessionByToken(token);
        if (!session) {
            return res.status(401).json({ error: 'Sessão inválida ou expirada' });
        }
        req.sessionToken = token;
        req.adminId = session.admin_id;
        req.adminUsername = session.username;
        req.sessionExpiresAt = session.expires_at;
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = { requireAuth };
