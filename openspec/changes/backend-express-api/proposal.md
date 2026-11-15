# Proposal — backend-express-api

## Why

O frontend já renderiza dados simulados em `frontend/js/main.js`. A Etapa 04 substitui esses dados por uma API real Node.js + Express.js conectada ao MySQL `art_portfolio`, mantendo o contrato de dados já consumido pelo frontend (perfil do artista + publicações com metadados de imagem).

## What Changes

- `backend/package.json`: projeto Node com Express, driver MySQL (`mysql2`), CORS, dotenv.
- `backend/src/server.js`: servidor Express com healthcheck e rotas `/api/*`.
- `backend/src/db.js`: pool de conexões MySQL usando `.env`.
- `backend/src/routes/artist.js`: `GET /api/artist`.
- `backend/src/routes/publications.js`: `GET /api/publications` (filtros `featured`, paginação), `GET /api/publications/:id`.
- `backend/src/routes/admin.js`: CRUD de publicações (protegido por token simples, base para Etapa 07).
- `backend/.env.example`: variáveis de ambiente do backend.
- `docs/ETAPA-04-BACKEND.md`: relatório técnico.

## Capabilities

### New Capabilities

- `artist-profile-endpoint`: endpoint `GET /api/artist` retornando o perfil único do artista.
- `publications-api`: endpoints de leitura pública com filtro `featured`, ordenação cronológica decrescente e paginação.
- `publications-crud`: endpoints de criação, leitura, atualização e remoção de publicações protegidos por token de administração.

### Modified Capabilities

- (vazio — primeira especificação dessas capacidades)

## Impact

- Arquivos criados: `backend/package.json`, `backend/src/**`, `backend/.env.example`, `docs/ETAPA-04-BACKEND.md`.
- Arquivos modificados: `README.md` (status), `frontend/js/main.js` (somente na Etapa 05, quando o fetch substituir os dados simulados).
- Sem impacto em frontend visual, image-service/ ou storage/ nesta etapa.
- Dependências novas (backend apenas): express, mysql2, cors, dotenv. Nenhuma dependência frontend adicionada.