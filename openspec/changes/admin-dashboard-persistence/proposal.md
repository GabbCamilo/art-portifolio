# Proposal — admin-dashboard-persistence

## Why

O dashboard administrativo ainda usa dados simulados (`samplePosts`), não salva edições, não exibe títulos editáveis e depende de botões Subir/Descer; o muro público mostra o tooltip de nome de arquivo o tempo todo. A Etapa 08 integra o painel à API de verdade: CRUD de publicações com ordenação por arraste persistida, perfil do artista editável, tópicos customizados na seção Details e formulário modal de nova publicação, refletindo tudo na página principal.

## What Changes

- `database/schema.sql`: coluna `position` em `publications`; tabela `profile_topics` (title, body, position).
- `backend/src/routes/publications.js`: feed ordenado por `position`.
- `backend/src/routes/admin.js`: `featured=true` limpa as demais; `POST /admin/publications/reorder`.
- `backend/src/routes/artist.js`: `PUT /api/admin/artist`; GET público inclui `topics`.
- `backend/src/routes/topics.js`: CRUD admin de tópicos.
- `backend/src/lib/mappers.js`: `mapTopic`.
- `frontend/js/admin.js`: dados via API, drag&drop, CRUD real, tópicos editáveis, modal de criação.
- `frontend/admin/dashboard.html`: botão Adicionar entre hero e galeria; modal; container de tópicos.
- `frontend/css/admin.css`: grid/gap da galeria, estilos de modal e drag.
- `frontend/css/style.css`: `.wall-tooltip` só no hover/foco; imagem secundária do hero estica até a altura da coluna de texto.
- `frontend/js/main.js` + `frontend/index.html`: hero renderiza tópicos; ao esgotar o muro, o cursor reinicia no primeiro item (feed cíclico).
- `backend/scripts/smoke-test.js`: cobertura das novas rotas.
- `docs/ETAPA-08-DASHBOARD.md`: relatório.

## Capabilities

### New Capabilities

- `profile-topics`: tópicos customizados (título + texto) da seção Details, CRUD admin e exibição pública no hero.
- `publication-order`: ordenação persistida via coluna `position`, endpoint de reordenar e drag&drop no painel.

### Modified Capabilities

- `admin-interface`: deixa de ser simulado — edita dados reais, salva via API, formulário modal.
- `publications-crud`: exclusividade de `featured` no PUT e rota `reorder`.
- `artist-profile-endpoint`: GET público inclui `topics`; PUT admin atualiza o perfil.

## Impact

- Arquivos criados: `backend/src/routes/topics.js`, `docs/ETAPA-08-DASHBOARD.md`, specs novos.
- Arquivos modificados: `database/schema.sql`, `database/seed.sql`, `backend/src/routes/*.js`, `backend/src/lib/mappers.js`, `backend/scripts/smoke-test.js`, `frontend/js/admin.js`, `frontend/js/main.js`, `frontend/admin/dashboard.html`, `frontend/index.html`, `frontend/css/style.css`, `frontend/css/admin.css`, `README.md`.
- Sem impacto em `image-service/` (Python); upload real de arquivo permanece para etapa seguinte.
- Dependências novas: nenhuma.
