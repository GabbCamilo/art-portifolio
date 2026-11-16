# Proposal — admin-dashboard-persistence

## Why

O dashboard administrativo ainda usa dados simulados (`samplePosts`), não salva edições e o muro público mostra dados de fallback. A Etapa 08 integra o painel à API de verdade: perfil do artista editável (rótulos e valores dos Details), descrição e complemento da obra principal via API, galeria administrativa em grid com placeholders de SVG e legenda de muro só no hover/foco.

## What Changes

- `database/schema.sql`: coluna `labels` em `artist_profile`; colunas de imagem de perfil em `artist_profile`.
- `backend/src/routes/artist.js`: `PUT /api/admin/artist`; GET público inclui `labels`.
- `backend/src/lib/mappers.js`: `mapArtist` com `image`; `mapPublication` sem `title`.
- `frontend/js/admin.js`: dados via API, rótulos/valores editáveis, descrição/complemento da obra principal, galeria com placeholders de imagem e apenas botão Remover.
- `frontend/admin/dashboard.html`: zonas de upload por slot (destaque principal, perfil, feed), Details mantidos, botão Salvar/Atualizar, galeria sem títulos/descrições.
- `frontend/css/style.css`: `.wall-tooltip` só no hover/foco; `.details-row` coluna de rótulos mais larga.
- `frontend/css/admin.css`: grid/gap da galeria, placeholders SVG, estilos de slots e cards só-imagem.
- `backend/scripts/smoke-test.js`: cobertura das novas rotas (uploads por slot, featured exclusivo, artist com labels).
- `backend/scripts/frontend-contract-test.js`: contrato de `labels` e regressão de `admin.js` em `login.html`.

## Capabilities

### New Capabilities

- `artist-labels`: rótulos customizáveis em `artist_profile.labels`, editáveis no admin e refletidos no hero público.
- `admin-uploads`: envio real de arquivos de imagem por slot (destaque principal, perfil e feed) com validação de tipo/tamanho e armazenamento em `storage/images/`.

### Modified Capabilities

- `admin-interface`: deixa de ser simulado — edita dados reais do perfil e da obra principal, salva via API; galeria com imagens reais e apenas remoção; botão de publicar/atualizar o site.
- `artist-profile-endpoint`: GET público inclui `labels` e `image`; PUT admin atualiza o perfil.
- `publications-crud`: exclusividade de `featured` no PUT; remoção exclui o arquivo armazenado.

## Impact

- Arquivos modificados: `database/schema.sql`, `database/seed.sql`, `backend/src/routes/*.js`, `backend/src/lib/mappers.js`, `backend/scripts/smoke-test.js`, `backend/scripts/frontend-contract-test.js`, `frontend/js/admin.js`, `frontend/js/main.js`, `frontend/admin/dashboard.html`, `frontend/index.html`, `frontend/css/style.css`, `frontend/css/admin.css`.
- Removidos do escopo: tabela `profile_topics`/tópicos, coluna `position`/reordenação, títulos e descrições de imagem nos cartões, feed cíclico e secundária esticada do hero.
- Sem browser headless: validação visual continua como checklist manual.
