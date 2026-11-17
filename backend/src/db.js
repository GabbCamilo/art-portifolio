const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const pool = connectionString
    ? new Pool({
          connectionString,
          ssl: { rejectUnauthorized: false },
      })
    : new Pool({
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10) || 5432,
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
      });

const displayName = connectionString
    ? connectionString.replace(/^.*@/, '')
    : `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

pool.on('connect', () => {
    console.log('[db] Conectado ao PostgreSQL:', displayName);
});
pool.on('error', (err) => {
    console.error('[db] Erro inesperado no pool do PostgreSQL:', err.message);
});

module.exports = pool;
