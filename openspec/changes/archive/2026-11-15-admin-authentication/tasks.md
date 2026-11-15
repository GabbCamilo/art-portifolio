## 1. Banco de dados

- [x] 1.1 `database/schema.sql`: tabelas `admin_users` (id, username UNIQUE, password_hash, timestamps) e `admin_sessions` (token_hash PK, admin_id FK, created_at, expires_at)
- [x] 1.2 Aplicar schema no MySQL local (root) e validar com `DESCRIBE`
- [x] 1.3 `backend/scripts/bootstrap-admin.js`: upsert do administrador a partir de `ADMIN_USERNAME`/`ADMIN_PASSWORD`
- [x] 1.4 `backend/scripts/reseed.js`: limpar `admin_sessions` e garantir admin existente

## 2. Backend (autenticação)

- [x] 2.1 `backend/src/lib/passwords.js`: hash/verify com scrypt + timingSafeEqual
- [x] 2.2 `backend/src/lib/sessions.js`: criar/consultar/remover sessão (SHA-256 do token, TTL configurável)
- [x] 2.3 `backend/src/routes/auth.js`: login, logout, session
- [x] 2.4 `backend/src/middleware/auth.js`: Bearer contra sessão ativa no banco
- [x] 2.5 `backend/src/server.js`: montar rotas de auth
- [x] 2.6 `.env`/`.env.example`: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_TTL_HOURS`; remover `ADMIN_TOKEN`

## 3. Frontend

- [x] 3.1 `frontend/js/admin.js`: login real via fetch (armazena token, redireciona, mensagens de erro)
- [x] 3.2 Dashboard com gate de sessão (`GET /api/admin/session`) e logout funcional
- [x] 3.3 `frontend/admin/login.html`: texto de "estrutura visual" atualizado

## 4. Testes locais (sem deploy)

- [x] 4.1 `backend/scripts/smoke-test.js`: credenciais inválidas 401, login 200, session, logout invalida token, CRUD com token de sessão (22/22)
- [x] 4.2 Contrato frontend mantido (`frontend-contract-test.js`)
- [x] 4.3 `node --check` em todos os arquivos JS alterados

## 5. Documentação

- [x] 5.1 `docs/ETAPA-07-AUTH-SQLSERVER.md`: relatório de autenticação + estudo de SQL Server (MySQL → T-SQL)
- [x] 5.2 `README.md`: status Etapa 07 e lista de relatórios

## 6. OpenSpec

- [x] 6.1 `openspec validate admin-authentication --strict`
- [ ] 6.2 Commit local (sem deploy)
- [ ] 6.3 `openspec archive admin-authentication`

## Regras

- [x] NÃO fazer deploy sem autorização explícita.
- [x] Testar TUDO localmente antes de qualquer subida.
