# Tasks

## 1. Estrutura do backend

- [x] 1.1 Criar `backend/package.json` com express, mysql2, cors, dotenv
- [x] 1.2 Executar `npm install` no diretório `backend/` (82 pacotes, 0 vulnerabilidades)
- [x] 1.3 Criar `backend/.env.example` com DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, ADMIN_TOKEN, PORT
- [x] 1.4 Criar `backend/.env` local copiando `.env.example` e preenchendo credenciais reais (senha do `.env` raiz + ADMIN_TOKEN gerado via crypto)
- [x] 1.5 Validar `.env` gitignored (backend/.env não versionado)

## 2. Conexão com MySQL

- [x] 2.1 Implementar `backend/src/db.js` com pool mysql2 (promise) lendo `.env` (charset utf8mb4, dateStrings true)
- [x] 2.2 Validar conexão com `art_portfolio_app` via teste local (`[db] Conectado ao MySQL: art_portfolio`)
- [x] 2.3 Validar que `art_portfolio_app` NÃO acessa bancos de sistema (GRANT só em art_portfolio.*)

## 3. Servidor e rotas públicas

- [x] 3.1 Implementar `backend/src/server.js` com Express, JSON parser, CORS, healthcheck `GET /api/health`
- [x] 3.2 Implementar `GET /api/artist` (rotas/artist.js)
- [x] 3.3 Implementar `GET /api/publications` com `featured`, `limit`, `offset` e ordenação decrescente
- [x] 3.4 Implementar `GET /api/publications/:id`
- [x] 3.5 Mapear colunas SQL para contrato do frontend (`id` como `pub-XX`, `date`, `featured` boolean, `image{...}` com `tone`)

## 4. Rotas administrativas (token)

- [x] 4.1 Implementar middleware `auth.js` validando `Authorization: Bearer <ADMIN_TOKEN>`
- [x] 4.2 Implementar `POST /api/admin/publications` (criar)
- [x] 4.3 Implementar `PUT /api/admin/publications/:id` (atualizar)
- [x] 4.4 Implementar `DELETE /api/admin/publications/:id` (remover)
- [x] 4.5 Validar entrada (tipos obrigatórios) retornando 400 com mensagem clara

## 5. Middleware de erro

- [x] 5.1 Implementar `errorHandler.js` retornando `{ error }` com status adequado (400/404/409/401/500)
- [x] 5.2 Garantir que stack trace não vaze em production (NODE_ENV=production oculta mensagem)

## 6. Testes locais (sem deploy)

- [x] 6.1 `node --check` em todos os arquivos JS do backend (8 arquivos OK)
- [x] 6.2 `GET /api/health` retorna 200
- [x] 6.3 `GET /api/artist` retorna perfil Kenyureru (UTF-8 correto: code points 53 e3 6f)
- [x] 6.4 `GET /api/publications?limit=6` retorna 6 itens, `total=10`, formato `pub-XX`
- [x] 6.5 `GET /api/publications?featured=true` retorna 1 item
- [x] 6.6 `GET /api/publications?featured=false&limit=4&offset=4` retorna próximos 4 do feed
- [x] 6.7 `GET /api/publications/:id` retorna obra correta; 404 para inexistente
- [x] 6.8 POST/PUT/DELETE com token válido funcionam; sem token retornam 401
- [x] 6.9 POST com corpo inválido retorna 400
- [x] 6.10 Smoke test automatizado `scripts/smoke-test.js`: 12/12 PASS

## 7. Documentação e OpenSpec

- [x] 7.1 Criar `docs/ETAPA-04-BACKEND.md`
- [x] 7.2 Atualizar `README.md` (status Etapa 04)
- [x] 7.3 `openspec validate backend-express-api`
- [x] 7.4 Commit local (sem push/produção)
- [ ] 7.5 `openspec archive backend-express-api`

## Regras respeitadas

- [x] NÃO fazer deploy em produção sem autorização explícita.
- [x] NÃO versionar `.env` com credenciais.
- [x] Testar TUDO localmente antes de qualquer subida.