const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const artistRoutes = require('./routes/artist');
const publicationsRoutes = require('./routes/publications');
const adminRoutes = require('./routes/admin');
const uploadsRoutes = require('./routes/uploads');
const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Arquivos de imagem agora são servidos pelo Cloudinary (URLs diretas).
// O serviço local /storage foi removido para evitar disco efêmero do Render.

app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'art-portfolio-api', health: '/api/health' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'art-portfolio-api', timestamp: new Date().toISOString() });
});

app.use('/api', authRoutes);
app.use('/api', artistRoutes);
app.use('/api', publicationsRoutes);
app.use('/api', adminRoutes);
app.use('/api', uploadsRoutes);
app.use('/api', mediaRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Art Portfolio API rodando em http://localhost:${PORT}`);
});
