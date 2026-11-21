/* Cria ou atualiza o administrador a partir de ADMIN_USERNAME/ADMIN_PASSWORD.
   Uso: node scripts/bootstrap-admin.js */
require('dotenv').config();
const pool = require('../src/db');
const { hashPassword } = require('../src/lib/passwords');

async function ensureAdmin(username, password) {
    if (!username || !password) {
        throw new Error('Defina ADMIN_USERNAME e ADMIN_PASSWORD no .env');
    }
    const hash = hashPassword(password);
    await pool.query(
        `INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)
         ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
        [username, hash]
    );
    return username;
}

async function main() {
    const username = await ensureAdmin(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    console.log('[bootstrap] admin pronto:', username);
    await pool.end();
    process.exit(0);
}

if (require.main === module) {
    main().catch(err => { console.error('[bootstrap] ERRO:', err.message); process.exit(1); });
}

module.exports = { ensureAdmin };
