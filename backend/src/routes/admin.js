const express = require('express');
const router = express.Router();

// As rotas de CRUD de publicações foram movidas para backend/src/routes/publications.js
// (schema PostgreSQL: coluna `title` não existe nesta tabela).
// Este arquivo é mantido apenas para evitar duplicação de rotas conflitantes com uploads.js.

module.exports = router;
