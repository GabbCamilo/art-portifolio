const express = require('express');
const cors = require('cors');
require('dotenv').config();

const artistRoutes = require('./routes/artist');
const publicationsRoutes = require('./routes/publications');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'art-portfolio-api', timestamp: new Date().toISOString() });
});

app.use('/api', artistRoutes);
app.use('/api', publicationsRoutes);
app.use('/api', adminRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Art Portfolio API rodando em http://localhost:${PORT}`);
});
