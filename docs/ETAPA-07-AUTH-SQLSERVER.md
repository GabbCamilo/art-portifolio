# Relatório Técnico — Etapa 07: Autenticação e Estudos de SQL Server

## 1. Objetivo da etapa

Substituir o token estático de ambiente (`ADMIN_TOKEN`, Etapa 04) por autenticação real de administrador, com credenciais hasheadas e sessões persistidas no MySQL, e documentar o estudo de SQL Server (mapeamento MySQL → T-SQL) previsto no plano do README.

## 2. Autenticação implementada

### 2.1 Modelo de dados (novas tabelas)

```sql
admin_users(id, username UNIQUE, password_hash, created_at, updated_at)
admin_sessions(token_hash CHAR(64) PK, admin_id FK, created_at, expires_at)
```

- `password_hash` armazena `scrypt:<salt hex>:<hash hex>` (Node `crypto.scryptSync`, 64 bytes; verificação com `timingSafeEqual`).
- `token_hash` é o SHA-256 do token entregue ao cliente (256 bits aleatórios): o banco nunca guarda o token em claro.
- `expires_at` DATETIME; TTL configurável por `ADMIN_SESSION_TTL_HOURS` (padrão 8 h).

### 2.2 Contrato da API

| Método | Rota | Comportamento |
|---|---|---|
| POST | `/api/admin/login` | body `{username, password}` → 200 `{token, expires_at, admin:{username}}`; 400 body inválido; 401 `Credenciais inválidas` (mensagem genérica) |
| POST | `/api/admin/logout` | Bearer ativo → 204; encerra a sessão no banco |
| GET | `/api/admin/session` | Bearer ativo → 200 `{username, expires_at}`; 401 caso contrário |
| POST/PUT/DELETE | `/api/admin/publications` | exigem sessão ativa (middleware `requireAuth` agora consulta o banco) |

O header `Authorization: Bearer <token>` permanece idêntico ao da Etapa 04: o CRUD admin não mudou de contrato.

### 2.3 Arquivos

- `backend/src/lib/passwords.js` — hash/verify scrypt.
- `backend/src/lib/sessions.js` — criação/consulta/remoção de sessões (SHA-256 do token, filtro `expires_at > NOW()`).
- `backend/src/routes/auth.js` — login/logout/session.
- `backend/src/middleware/auth.js` — Bearer validado contra sessão ativa no banco.
- `backend/scripts/bootstrap-admin.js` — upsert do admin a partir de `ADMIN_USERNAME`/`ADMIN_PASSWORD` (idempotente).
- `backend/scripts/reseed.js` — limpa `admin_sessions` e garante o admin no reseed.
- `frontend/js/admin.js` — login real via `fetch`, token em `localStorage`, gate de sessão no dashboard (`GET /api/admin/session`) e logout funcional.
- `backend/.env.example` — `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_TTL_HOURS`; `ADMIN_TOKEN` removido.

### 2.4 Decisões

1. scrypt nativo do Node (`crypto`) — nenhuma dependência nova.
2. Sessões no banco (não JWT) — logout real e expiração servidor-side.
3. Erro genérico de login — não revela se o username existe.
4. Token estático removido — segredo compartilhado dava acesso a quem tivesse o `.env`.

## 3. Testes executados (todos locais, sem deploy)

- `node scripts/smoke-test.js` (backend): **22/22 PASS** — login 400/401/200, token/expires_at/username, `GET /session` 200/401, CRUD com sessão, token inválido 401, logout 204 e token inutilizado após logout.
- `node --check` em todos os JS alterados: OK.
- `node backend/scripts/frontend-contract-test.js`: ALL OK (contrato do site público preservado).
- `node scripts/reseed.js`: encerramento limpo (exit 0) após ajuste de `process.exit(0)` em scripts seed.

## 4. Estudo de SQL Server (mapeamento MySQL → T-SQL)

Escopo: estudos e relatórios futuros (README, seção 2). MySQL segue como fonte da verdade; nada foi implementado em SQL Server.

### 4.1 Mapeamento de tipos e DDL

| MySQL 8 | SQL Server (T-SQL) | Observação |
|---|---|---|
| `TINYINT UNSIGNED` | `TINYINT` | 0–255 em ambos |
| `INT UNSIGNED AUTO_INCREMENT` | `INT IDENTITY(1,1)` | sem unsigned no T-SQL |
| `VARCHAR(n)` | `NVARCHAR(n)` | Unicode explícito |
| `TEXT` | `NVARCHAR(MAX)` | |
| `TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | `DATETIME2 NOT NULL CONSTRAINT DF_x DEFAULT GETDATE()` + **trigger** `AFTER UPDATE` | T-SQL não tem coluna de atualização automática |
| `DATETIME` | `DATETIME2` | precisão e range maiores |
| `CHAR(64)` | `CHAR(64)` | hash SHA-256 hex |
| `UNIQUE KEY uq_x (col)` | `CONSTRAINT uq_x UNIQUE (col)` | |
| `KEY idx_x (col)` | `CREATE INDEX idx_x ON ...` | índice não é constraint |
| `CHECK (id = 1)` | `CONSTRAINT ck_x CHECK (id = 1)` | T-SQL valida CHECK |
| `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4` | `ON [PRIMARY]` + collation `Latin1_General_100_CI_AI_SC_UTF8` | UTF-8 via collation SC |
| `TINYINT(1)` boolean | `BIT` | |

### 4.2 Mapeamento de consultas usadas no projeto

| MySQL | T-SQL |
|---|---|
| `` `col` `` | `[col]` |
| `LIMIT ? OFFSET ?` | `OFFSET ? ROWS FETCH NEXT ? ROWS ONLY` |
| `NOW()` | `SYSDATETIME()` |
| `?` placeholders | `@p0` parameters (mesmo conceito de query parametrizada) |
| `COUNT(*) AS total` | igual |
| `ORDER BY published_at DESC, id DESC` | igual |
| `ON DELETE CASCADE` | igual |
| `expires_at > NOW()` | `expires_at > SYSDATETIME()` |
| `INSERT ... ON DUPLICATE KEY UPDATE` | `MERGE` ou `IF EXISTS(...) UPDATE ELSE INSERT` |
| `SELECT ... WHERE x = ? LIMIT 1` | `SELECT TOP(1) ... WHERE x = @p0` |

### 4.3 DDL traduzido (apêndice de estudo)

```sql
CREATE TABLE artist_profile (
    id TINYINT NOT NULL PRIMARY KEY DEFAULT 1,
    name NVARCHAR(120) NOT NULL,
    location NVARCHAR(120) NOT NULL,
    medium NVARCHAR(120) NOT NULL,
    website NVARCHAR(255) NOT NULL,
    store NVARCHAR(255) NOT NULL,
    patreon NVARCHAR(255) NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_artist_created DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL CONSTRAINT DF_artist_updated DEFAULT GETDATE(),
    CONSTRAINT ck_artist_single_row CHECK (id = 1)
);
-- trigger TR_artist_updated: AFTER UPDATE SET updated_at = GETDATE()

CREATE TABLE publications (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    title NVARCHAR(160) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    complementary NVARCHAR(MAX) NOT NULL,
    published_at DATE NOT NULL,
    featured BIT NOT NULL CONSTRAINT DF_pub_featured DEFAULT 0,
    file_name NVARCHAR(255) NOT NULL,
    file_size NVARCHAR(32) NOT NULL,
    width SMALLINT NOT NULL,
    height SMALLINT NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_pub_created DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL CONSTRAINT DF_pub_updated DEFAULT GETDATE(),
    CONSTRAINT uq_publications_file_name UNIQUE (file_name)
);
CREATE INDEX idx_publications_featured ON publications (featured);
CREATE INDEX idx_publications_published_at ON publications (published_at);

CREATE TABLE admin_users (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    username NVARCHAR(60) NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_adminu_created DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL CONSTRAINT DF_adminu_updated DEFAULT GETDATE(),
    CONSTRAINT uq_admin_users_username UNIQUE (username)
);

CREATE TABLE admin_sessions (
    token_hash CHAR(64) NOT NULL PRIMARY KEY,
    admin_id INT NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_admins_created DEFAULT GETDATE(),
    expires_at DATETIME2 NOT NULL,
    CONSTRAINT FK_admin_sessions_admin FOREIGN KEY (admin_id) REFERENCES admin_users (id) ON DELETE CASCADE
);
CREATE INDEX idx_admin_sessions_admin ON admin_sessions (admin_id);
```

### 4.4 Notas de segurança

- O hash scrypt é calculado na camada de aplicação (Node `crypto`): independe do SGBD, logo a lógica de senha é idêntica no estudo.
- Queries parametrizadas em ambos os motores; o mapeamento preserva a política de nunca concatenar SQL.

## 5. Riscos e limitações

- Dashboard ainda usa dados simulados para CRUD/upload visual; a autenticação já é real. Integração completa em etapa futura.
- Sem SQL Server instalado: o estudo é documental (sem execução).
- Sessão expira por TTL fixo; renovação automática (sliding) não foi implementada.

## 6. Pendências

1. Deploy do backend com auth real — somente com autorização.
2. Integração CRUD/upload do dashboard com API real (Etapa 08).
3. Se SQL Server for adotado: aplicar o DDL do apêndice e validar collation UTF-8.

## 7. Pontos de continuidade

- OpenSpec: change `admin-authentication` documenta esta entrega; specs base em `openspec/specs/admin-authentication/`.
- Admin local: `node backend/scripts/bootstrap-admin.js` (credenciais em `backend/.env`).
- Subir backend: `cd backend && node src/server.js` (porta 3000); login em `/admin/login`.
- Próxima atividade: Etapa 08 — testes, integração admin/upload real e implantação.
