# Design — admin-authentication

## Contexto

- Backend Express (Etapa 04) já protege `POST/PUT/DELETE /api/admin/publications` com middleware `requireAuth` baseado em token estático `ADMIN_TOKEN`.
- Frontend admin (Etapa 02) tem formulário de login visual e dados simulados em `frontend/js/admin.js`.
- MySQL 8 é o banco de produção; app user `art_portfolio_app` já tem SELECT/INSERT/UPDATE/DELETE.

## Decisões

1. **Hash de senha com `crypto.scryptSync`** (Node nativo). Nenhuma nova dependência. Formato de armazenamento: `scrypt:<salt hex>:<hash hex>`; verificação com `timingSafeEqual`.
2. **Sessões no banco, não JWT**: tabela `admin_sessions` permite logout real e expiração servidor-side. O token entregue ao cliente é aleatório (256 bits); só o SHA-256 é persistido.
3. **Expiração**: `ADMIN_SESSION_TTL_HOURS` (padrão 8h). `expires_at` DATETIME; consulta filtra `expires_at > NOW()`.
4. **Erros genéricos**: login inválido sempre `401 {"error":"Credenciais inválidas"}` (sem revelar se username existe).
5. **Bootstrap de admin**: `scripts/bootstrap-admin.js` cria/atualiza a partir de `ADMIN_USERNAME`/`ADMIN_PASSWORD`; chamado manualmente e pelo reseed (garante idempotência).
6. **Contrato de header mantido**: `Authorization: Bearer <token>` — o CRUD admin existente não muda de contrato.
7. **Token estático removido**: `ADMIN_TOKEN` sai do `.env.example`; a Etapa 04 ficava com segredo compartilhado, aqui só sessões do banco são válidas.
8. **SQL Server**: estudo documentado em `docs/ETAPA-07-AUTH-SQLSERVER.md` (mapeamento DDL/queries); MySQL segue como fonte da verdade. Sem implementação SQL Server nesta etapa.

## Riscos

- Perda de sessões ao limpar a tabela `admin_sessions` no reseed: aceitável (logout global implícito).
- scrypt síncrono trava o event loop em login (~dezenas de ms): irrelevante para tráfego admin.

## Contratos

- `POST /api/admin/login` — body `{username, password}` → 200 `{token, expires_at, admin:{username}}`; 400 body inválido; 401 credenciais inválidas.
- `POST /api/admin/logout` — Bearer ativo → 204; encerra a sessão.
- `GET /api/admin/session` — Bearer ativo → 200 `{username, expires_at}`; 401 caso contrário.
- Rotas `POST/PUT/DELETE /api/admin/publications`: 401 sem sessão ativa.
