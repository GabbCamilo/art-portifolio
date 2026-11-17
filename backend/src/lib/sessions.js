const crypto = require('crypto');
const pool = require('../db');

const TTL_HOURS = Math.max(1, parseInt(process.env.ADMIN_SESSION_TTL_HOURS, 10) || 8);

function tokenHash(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

async function createSession(adminId) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TTL_HOURS * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
    await pool.query(
        'INSERT INTO admin_sessions (token_hash, admin_id, expires_at) VALUES ($1, $2, $3)',
        [tokenHash(token), adminId, expiresAt]
    );
    return { token, expiresAt };
}

async function getSessionByToken(token) {
    if (typeof token !== 'string' || token.length === 0) return null;
    const { rows } = await pool.query(
        `SELECT s.token_hash, s.expires_at, u.id AS admin_id, u.username
         FROM admin_sessions s
         JOIN admin_users u ON u.id = s.admin_id
         WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
        [tokenHash(token)]
    );
    return rows.length > 0 ? rows[0] : null;
}

async function deleteSession(token) {
    if (typeof token !== 'string' || token.length === 0) return;
    await pool.query('DELETE FROM admin_sessions WHERE token_hash = $1', [tokenHash(token)]);
}

module.exports = { createSession, getSessionByToken, deleteSession, TTL_HOURS };
