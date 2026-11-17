const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: 'utf8mb4',
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.getConnection()
    .then(conn => {
        console.log('[db] Conectado ao MySQL:', process.env.DB_NAME);
        conn.release();
        return ensureDescriptionColumn();
    })
    .catch(err => {
        console.error('[db] Falha de conexão com o MySQL:', err.message);
    });

async function ensureDescriptionColumn() {
    try {
        const [cols] = await pool.query("SHOW COLUMNS FROM artist_profile LIKE 'description'");
        if (cols.length === 0) {
            await pool.query("ALTER TABLE artist_profile ADD COLUMN description TEXT NULL");
            console.log('[db] Coluna description adicionada à artist_profile');
        }
    } catch (e) {
        console.warn('[db] Não foi possível adicionar coluna description:', e.message);
    }
}

module.exports = pool;
module.exports.ensureDescriptionColumn = ensureDescriptionColumn;
