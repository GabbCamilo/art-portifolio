function errorHandler(err, req, res, next) {
    console.error('[error]', err);

    if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Conflito: registro duplicado (file_name já existe)' });
    }
    if (err && err.code === 'ER_BAD_NULL_ERROR') {
        return res.status(400).json({ error: 'Campo obrigatório ausente no banco de dados' });
    }

    const status = err.status || 500;
    const message = (process.env.NODE_ENV === 'production' && status === 500)
        ? 'Erro interno do servidor'
        : err.message;

    res.status(status).json({ error: message });
}

module.exports = errorHandler;
