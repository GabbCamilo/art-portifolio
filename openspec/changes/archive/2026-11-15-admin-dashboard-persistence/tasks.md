## Tasks

## 1. Banco de dados

- [x] 1.1 `database/schema.sql`: coluna `labels` em `artist_profile`; colunas `image_file_name/file_size/width/height` em `artist_profile`; coluna `title` removida de `publications`
- [x] 1.2 `database/seed.sql`: público começa sem publicações; `artist_profile` com linha base
- [x] 1.3 Migration aplicada como root (DROP `title`, DROP `profile_topics`, colunas de imagem, TRUNCATE `publications`)

## 2. Backend

- [x] 2.1 `routes/artist.js`: `PUT /api/admin/artist` com `labels`; GET público inclui `labels` e `image`; sem `topics`
- [x] 2.2 `routes/uploads.js`: `POST /api/admin/uploads` por slot (`featured`/`profile`/`feed`) via `image-service`
- [x] 2.3 `routes/publications.js`: feed sem `title`/`description`; featured com `description`/`complementary`; `DELETE` remove arquivo armazenado
- [x] 2.4 `server.js`: estática `/storage`; `uploads.js` montado; `topics.js` removido
- [x] 2.5 `lib/mappers.js`: `mapArtist` com `image`; `mapPublication` slim; `mapTopic` removido
- [x] 2.6 `package.json`: `multer` adicionado e instalado

## 3. Frontend

- [x] 3.1 `js/admin.js`: zonas de upload por slot; cards só imagem + Remover; Details editáveis; botão Salvar/Atualizar; não lança ao carregar em `login.html`
- [x] 3.2 `js/main.js`: sem `SIMULATED_*`/fallback; imagens via `/storage/images/`; botão Atualizar; estados vazio/erro
- [x] 3.3 `index.html`: sem `#hero-topics`; botão `#btn-refresh`
- [x] 3.4 `css/admin.css` + `css/style.css`: slots, grid 12rem, cards só-imagem; sem `.hero-topic*`
- [x] 3.5 `js/admin.js` não lança ao carregar em `login.html` (regressão de DOM corrigida)
- [x] 3.6 `js/main.js` + `css/style.css`: imagem do hero com `cursor: zoom-in`; `featured-artwork` com `role="button"`/`tabindex="0"` para acessibilidade
- [x] 3.7 `dashboard.html` + `admin.css`: slot de upload do feed redimensionado para `12rem x 12rem` (mesmo tamanho de um card de pré-visualização) com badge "novo" sobreposto; `edit-veil` mantido
- [x] 3.8 `js/main.js` + `css/style.css` + `index.html`: clique (ou Enter/Espaço) na imagem do hero abre a mesma visualização ampliada (lightbox) das imagens unitárias do muro; área de borda/backdrop fecha a visualização; setas e indicadores ocultos no modo featured

## 4. Testes locais (sem deploy)

- [x] 4.1 `smoke-test.js`: login, artist com `labels`/`image`, uploads por slot, featured exclusivo, `DELETE` com remoção de arquivo
- [x] 4.2 `frontend-contract-test.js`: contrato de `labels`/`image`, regressão DOM de `admin.js`, estrutura HTML
- [x] 4.3 `node --check` em todos os JS alterados

## 5. Documentação e OpenSpec

- [x] 5.1 `design.md`: decisões da simplificação (rótulos, imagem de perfil, uploads, sem simulado)
- [x] 5.2 specs: deltas atualizados (`admin-interface`, `artist-profile-endpoint`, `publications-crud`); deltas de `profile-topics`, `publication-order`, `progressive-gallery`, `single-page-presentation` removidos
- [x] 5.3 `openspec validate --strict`: aprovado
- [x] 5.4 `docs/ETAPA-08-DASHBOARD.md`
- [x] 5.5 `README.md`: status
- [ ] 5.6 Commit local (pendente de autorização)

Regras

- [ ] NÃO fazer deploy sem autorização explícita.
- [x] Testar TUDO localmente antes de qualquer subida.
