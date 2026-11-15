## 1. Banco de dados

- [ ] 1.1 `database/schema.sql`: `position` em `publications`; tabela `profile_topics`
- [ ] 1.2 Aplicar como root + backfill `position` 1..N por `published_at DESC`
- [ ] 1.3 `database/seed.sql`: positions explícitos nas 10 publicações

## 2. Backend

- [ ] 2.1 `routes/publications.js`: `ORDER BY position ASC, published_at DESC, id DESC`
- [ ] 2.2 `routes/admin.js`: exclusividade de `featured` no PUT; `POST /admin/publications/reorder`
- [ ] 2.3 `routes/artist.js`: `PUT /api/admin/artist`; GET público inclui `topics`
- [ ] 2.4 `routes/topics.js`: CRUD admin de tópicos
- [ ] 2.5 `lib/mappers.js`: `mapTopic`

## 3. Frontend

- [x] 3.1 `css/style.css`: `.wall-tooltip` hover-only
- [ ] 3.2 `css/admin.css`: grid/gap da galeria, modal, drag
- [ ] 3.3 `admin/dashboard.html`: botão entre hero e galeria; modal; container de tópicos
- [ ] 3.4 `js/admin.js`: dados reais, CRUD, drag&drop, tópicos editáveis, modal
- [ ] 3.5 `index.html` + `js/main.js`: hero renderiza `topics`
- [ ] 3.6 `js/main.js`: ao esgotar o feed, cursor reinicia no primeiro item (muro cíclico)
- [ ] 3.7 `css/style.css`: `.hero-media` estica até a altura da coluna de texto em desktop

## 4. Testes locais (sem deploy)

- [ ] 4.1 `smoke-test.js`: reorder, featured exclusivo, artist PUT, topics CRUD
- [ ] 4.2 `frontend-contract-test.js`: topics no contrato
- [ ] 4.3 `node --check` em todos os JS alterados
- [ ] 4.4 Checklist visual dos 8 pontos
- [ ] 4.5 Teste de lógica: reset do cursor ao esgotar e esticamento da secundária

## 5. Documentação e OpenSpec

- [ ] 5.1 `docs/ETAPA-08-DASHBOARD.md`
- [ ] 5.2 `README.md`: status Etapa 08
- [ ] 5.3 `openspec validate admin-dashboard-persistence --strict`
- [ ] 5.4 Commit local (sem deploy)
- [ ] 5.5 `openspec archive admin-dashboard-persistence`

## Regras

- [ ] NÃO fazer deploy sem autorização explícita.
- [ ] Testar TUDO localmente antes de qualquer subida.
