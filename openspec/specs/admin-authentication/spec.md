# admin-authentication Specification

## Purpose
Especificar a autenticação real de administrador do Art Portfolio: credenciais hasheadas no MySQL, sessões expiráveis no banco, endpoints de login/logout/sessão e proteção das rotas admin por sessão ativa.

## Requirements

### Requirement: Credenciais armazenadas com hash

O sistema SHALL armazenar senhas de administrador apenas como hash (scrypt com salt aleatório); a senha em texto claro nunca SHALL ser persistida nem retornada por qualquer endpoint.

#### Scenario: Bootstrap de administrador
- **WHEN** `backend/scripts/bootstrap-admin.js` executa com `ADMIN_USERNAME`/`ADMIN_PASSWORD` definidos
- **THEN** o usuário existe em `admin_users` com `password_hash` no formato `scrypt:<salt>:<hash>`
- **THEN** executar o bootstrap novamente com a mesma senha não duplica o usuário (username único)

### Requirement: Login com credenciais

O sistema SHALL autenticar via `POST /api/admin/login` com body `{username, password}` e emitir token de sessão.

#### Scenario: Credenciais válidas
- **WHEN** o body contém username e password corretos
- **THEN** a resposta é 200 com `{token, expires_at, admin:{username}}`
- **THEN** uma sessão é criada em `admin_sessions` (armazenada como SHA-256 do token)

#### Scenario: Credenciais inválidas
- **WHEN** o body contém username ou password incorretos (ou username inexistente)
- **THEN** a resposta é 401 com mensagem genérica `Credenciais inválidas` (sem revelar qual campo falhou)

#### Scenario: Body inválido
- **WHEN** o body não contém `username` e `password` como strings não vazias
- **THEN** a resposta é 400

### Requirement: Sessão expirável

O sistema SHALL aceitar tokens apenas enquanto a sessão estiver ativa no banco (`expires_at` no futuro).

#### Scenario: Token expirado
- **WHEN** uma requisição admin usa token com `expires_at` no passado
- **THEN** a resposta é 401

#### Scenario: Consulta de sessão
- **WHEN** uma requisição autenticada faz `GET /api/admin/session`
- **THEN** a resposta é 200 com `{username, expires_at}`

### Requirement: Logout invalida sessão

O sistema SHALL encerrar a sessão atual via `POST /api/admin/logout`.

#### Scenario: Logout e reutilização
- **WHEN** o cliente faz logout com token ativo e depois o reutiliza
- **THEN** o logout responde 204
- **THEN** a requisição subsequente com o mesmo token responde 401

### Requirement: Rotas admin protegidas por sessão

O sistema SHALL exigir sessão ativa (`Authorization: Bearer <token>`) em `POST/PUT/DELETE /api/admin/publications`.

#### Scenario: Sem token
- **WHEN** uma requisição de escrita admin é feita sem header Authorization
- **THEN** a resposta é 401

#### Scenario: Token inexistente
- **WHEN** o token não corresponde a sessão ativa no banco
- **THEN** a resposta é 401
