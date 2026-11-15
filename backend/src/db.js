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
    })
    .catch(err => {
        console.error('[db] Falha de conexão com o MySQL:', err.message);
    });

module.exports = pool;
