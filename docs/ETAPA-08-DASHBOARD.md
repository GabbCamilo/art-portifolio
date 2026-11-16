# ETAPA 08 — Dashboard sincronizado com a página pública

## Objetivo

Fazer o painel administrativo refletir de verdade na página pública: upload real de imagens, edição do perfil e dos Details, e um botão de publicar/atualizar que sincroniza o estado do admin com o que o visitante vê.

## O que mudou

### Banco de dados (`database/schema.sql`, `database/seed.sql`)

- `artist_profile`: novas colunas `image_file_name`, `image_file_size`, `image_width`, `image_height` (imagem do perfil).
- `publications`: coluna `title` removida; feed exibe apenas a imagem.
- `profile_topics`: tabela removida (caixas de texto fora de escopo).
- Seed: público começa vazio; `artist_profile` mantém a linha base.

### Backend (`backend/src/`)

- `routes/uploads.js` (novo): `POST /api/admin/uploads?slot=featured|profile|feed` — recebe multipart via `multer`, encaminha ao `image-service` (`POST /process`), armazena original em `storage/images/` e grava a publicação no slot escolhido. Upload no slot `featured` desloca o destaque anterior para o feed.
- `routes/publications.js`: feed público sem `title`/`description` (apenas imagem); `?featured=true` inclui `description`/`complementary`; `DELETE` remove linha e arquivo armazenado (original + variantes WebP).
- `routes/artist.js`: GET inclui `image`; PUT atualiza perfil (sem `topics`).
- `lib/mappers.js`: `mapArtist` com `image`; `mapPublication` enxuto; `mapTopic` removido.
- `server.js`: `express.static('/storage')`; rota `uploads` montada; `topics` removida.
- `package.json`: `multer` adicionado.
- `backend/.env`: `IMAGE_SERVICE_URL=http://localhost:8000`.

### Frontend

- Admin (`dashboard.html`, `js/admin.js`, `css/admin.css`): zonas de upload por slot (destaque principal, perfil, feed), Details editáveis (rótulos + valores + descrição/complemento da obra principal), cartões só com imagem + Remover, botão "Salvar / Atualizar site"; slot de upload do feed redimensionado para `12rem x 12rem` (mesmo tamanho de um card de pré-visualização) com badge "novo".
- Público (`index.html`, `js/main.js`, `css/style.css`): sem dados simulados (`SIMULATED_*` removido); imagens reais de `/storage/images/`; botão "Atualizar" no muro; estados vazio e de erro quando a API está fora; imagem do hero abre a mesma visualização ampliada (lightbox) das imagens unitárias do muro ao clicar, com a área de borda/backdrop fechando a visualização; imagem de perfil do hero também abre o lightbox ao clicar.

### Autenticação

- Usuário/senha do admin em `backend/.env` (`ADMIN_USERNAME`/`ADMIN_PASSWORD`), hash scrypt no banco, sessão com token de 8h. Login em `frontend/admin/login.html`.

## Como rodar localmente

1. MySQL (`MySQL80`) e banco `art_portfolio` subidos.
2. Backend: `cd backend && npm start` (porta 3000; requer `backend/.env`).
3. Image-service: `cd image-service && .venv\Scripts\uvicorn app.main:app --port 8000` (necessário para uploads).
4. Abrir `frontend/admin/login.html` → entrar com as credenciais do `.env` → `frontend/admin/dashboard.html`.
5. Página pública: `frontend/index.html` (reflete o banco; use "Atualizar" depois de mudanças no admin).

## Escopo deixado de fora desta etapa

- Tópicos customizados (`profile_topics`) e coluna `position`/reordenação de publicações.
- Feed cíclico e secundária esticada do hero (50/50 mantido sem alongamento).
- Formulário modal de criação (substituído pelas zonas de upload diretas nos slots).

## OpenSpec

- Change `admin-dashboard-persistence` arquivada (`openspec archive admin-dashboard-persistence`), aplicando os deltas aos specs base (`admin-interface`, `artist-profile-endpoint`, `publications-crud`).
- `openspec validate --all --strict`: 16/16.
