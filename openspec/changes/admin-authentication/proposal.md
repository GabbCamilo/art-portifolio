# Proposal — admin-authentication

## Why

A Etapa 04 protegeu o CRUD admin com um token estático de ambiente (`ADMIN_TOKEN`) e o login do frontend é apenas visual (Etapa 02). A Etapa 07 implementa autenticação real: credenciais de administrador persistidas com hash no MySQL, sessões com expiração no banco, endpoints de login/logout/sessão e frontend consumindo essa API. A etapa também documenta o estudo de SQL Server (mapeamento MySQL → T-SQL), conforme plano do README.

## What Changes

- `database/schema.sql`: novas tabelas `admin_users` (username único, password_hash) e `admin_sessions` (token_hash, admin_id, expires_at).
- `backend/src/lib/passwords.js`: hash/verify com `crypto.scryptSync` + `timingSafeEqual` (sem novas dependências).
- `backend/src/lib/sessions.js`: criação/consulta/remoção de sessões; token aleatório de 256 bits armazenado apenas como SHA-256.
- `backend/src/routes/auth.js`: `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/session`.
- `backend/src/middleware/auth.js`: valida Bearer token contra sessão ativa no banco (expiração aplicada).
- `backend/scripts/bootstrap-admin.js`: cria/atualiza o administrador a partir de `ADMIN_USERNAME`/`ADMIN_PASSWORD`.
- `backend/scripts/smoke-test.js`: autenticação por login real (credenciais inválidas 401, logout invalida, CRUD com token de sessão).
- `frontend/js/admin.js`: login real via fetch, gate de sessão no dashboard, logout funcional.
- `docs/ETAPA-07-AUTH-SQLSERVER.md`: relatório da etapa + estudo de SQL Server (DDL/queries mapeados para T-SQL).
- `backend/.env.example`: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_TTL_HOURS` (remove `ADMIN_TOKEN`).

## Capabilities

### New Capabilities

- `admin-authentication`: credenciais hasheadas, login/logout/sessão via API, sessões expiráveis no banco, proteção das rotas admin por sessão ativa.

### Modified Capabilities

- (vazio — `admin-interface` permanece como especificação visual histórica da Etapa 02)

## Impact

- Arquivos criados: `backend/src/lib/passwords.js`, `backend/src/lib/sessions.js`, `backend/src/routes/auth.js`, `backend/scripts/bootstrap-admin.js`, `docs/ETAPA-07-AUTH-SQLSERVER.md`.
- Arquivos modificados: `database/schema.sql`, `backend/src/middleware/auth.js`, `backend/src/server.js`, `backend/scripts/smoke-test.js`, `backend/scripts/reseed.js`, `backend/.env.example`, `frontend/js/admin.js`, `frontend/admin/login.html`, `frontend/admin/dashboard.html`, `README.md`.
- Sem impacto em `image-service/` (Python) e nas rotas públicas (`/api/artist`, `/api/publications`).
- Dependências novas: nenhuma (apenas `crypto` nativo do Node).
