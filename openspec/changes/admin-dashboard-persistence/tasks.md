## Tasks

## 1. Banco de dados

- [x] 1.1 `database/schema.sql`: coluna `labels` em `artist_profile`; tabela `profile_topics`
- [x] 1.2 Migration aplicada como root (coluna `labels` + tabela `profile_topics`)
- [ ] 1.3 `database/seed.sql`: positions explícitos nas 10 publicações (ponto de ordenação, etapa seguinte)

## 2. Backend

- [x] 2.1 `routes/artist.js`: `PUT /api/admin/artist` com `labels`; GET público inclui `topics` e `labels`
- [x] 2.2 `routes/topics.js`: CRUD admin de tópicos

## 3. Frontend

- [x] 3.1 `js/admin.js`: `makeEditable` com suporte a `textarea` e `onSave`; rótulos e valores editáveis
- [x] 3.2 `js/admin.js`: `renderTopics`, `appendTopic`, `saveTopic`, botão Adicionar caixa de texto e remoção
- [x] 3.3 `js/admin.js`: `description`/`complementary` da obra principal via `PUT /api/admin/publications/:id`
- [x] 3.4 `css/admin.css`: inputs largura total, `textarea`, caixas de texto, botão remover
- [x] 3.5 `index.html`: `data-label-for` nos `dt` do hero; container `#hero-topics`
- [x] 3.6 `js/main.js`: `DEFAULT_LABELS`, `loadArtist` com `labels`/`topics`, `renderHero` aplica rótulos, `renderTopics`
- [x] 3.7 `css/style.css`: `.details-row` coluna de rótulos mais larga; `.hero-topics`/`.hero-topic`

## 4. Testes locais (sem deploy)

- [x] 4.1 `smoke-test.js`: featured exclusivo, artist PUT com `labels`, topics CRUD (reorder segue para ponto seguinte)
- [x] 4.2 `frontend-contract-test.js`: contrato de `labels` e `topics`
- [x] 4.3 `node --check` em todos os JS alterados

## 5. Documentação e OpenSpec

- [x] 5.1 `design.md`: rótulos editáveis, tópicos, descrição/complemento via API
- [x] 5.2 specs: `artist-profile-endpoint` (labels + topics), `admin-interface` (detalhes editáveis)
- [x] 5.3 `openspec validate --strict`: 16/16
- [ ] 5.4 `docs/ETAPA-08-DASHBOARD.md` (pendente)
- [ ] 5.5 `README.md`: status Etapa 08 (pendente)
- [ ] 5.6 Commit local (pendente de sua autorização)
- [ ] 5.7 `openspec archive admin-dashboard-persistence` (após o commit)

Regras

- [ ] NÃO fazer deploy sem autorização explícita.
- [x] Testar TUDO localmente antes de qualquer subida.
