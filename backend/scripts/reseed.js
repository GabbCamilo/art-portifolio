/* Re-seed do banco PostgreSQL com encoding UTF-8 correto.
   Uso: node scripts/reseed.js */
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const pool = require('../src/db');
const { ensureAdmin } = require('./bootstrap-admin');

async function main() {
    const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');
    const sql = fs.readFileSync(seedPath, 'utf8');

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM publications');
        await client.query('DELETE FROM artist_profile');
        await client.query('DELETE FROM admin_sessions');

        const statements = sql
            .split(';')
            .map((s) => s.trim())
            .filter((s) => s.length > 0 && !s.startsWith('--'));

        for (const stmt of statements) {
            await client.query(stmt);
        }
        await client.query('COMMIT');

        await ensureAdmin(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

        const { rows: artist } = await client.query('SELECT name, location FROM artist_profile WHERE id = 1');
        const { rows: pubs } = await client.query('SELECT COUNT(*)::int AS total FROM publications');
        console.log('[reseed] artist:', artist[0].name, '|', artist[0].location);
        console.log('[reseed] publications:', pubs[0].total);
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
    } finally {
        client.release();
        await pool.end();
        process.exit(0);
    }
}

main().catch((err) => {
    console.error('[reseed] ERRO:', err.message);
    process.exit(1);
});
