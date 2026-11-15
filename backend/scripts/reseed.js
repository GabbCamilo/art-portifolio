/* Re-seed do banco com encoding UTF-8 correto.
   Uso: node scripts/reseed.js */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        charset: 'utf8mb4',
        multipleStatements: true,
    });

    const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');
    const sql = fs.readFileSync(seedPath, 'utf8');

    const conn = await pool.getConnection();
    try {
        await conn.query('SET NAMES utf8mb4');
        await conn.query('DELETE FROM publications');
        await conn.query('DELETE FROM artist_profile');

        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('USE'));

        for (const stmt of statements) {
            await conn.query(stmt);
        }

        const [artist] = await conn.query('SELECT name, location FROM artist_profile WHERE id = 1');
        const [pubs] = await conn.query('SELECT COUNT(*) AS total FROM publications');
        console.log('[reseed] artist:', artist[0].name, '|', artist[0].location);
        console.log('[reseed] publications:', pubs[0].total);
    } finally {
        conn.release();
        await pool.end();
    }
}

main().catch(err => {
    console.error('[reseed] ERRO:', err.message);
    process.exit(1);
});
