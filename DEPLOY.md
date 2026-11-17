# Deploy do Backend (Node.js + PostgreSQL)

## Pré-requisito: PostgreSQL na nuvem

O backend precisa de um PostgreSQL acessível pela internet. O PostgreSQL que estiver no seu computador (localhost:5432) **não** funciona para deploy, pois não é acessível de fora.

### Opção A: Render (recomendado — tudo em um lugar)
O Render oferece **PostgreSQL gerenciado gratuito**, então tudo fica no mesmo serviço.

1. Crie conta em https://render.com
2. Crie um banco **PostgreSQL** (New + → Database → PostgreSQL), plano Free
3. Crie um **Web Service** (New + → Web Service) conectando o GitHub `GabbCamilo/art-portifolio`
4. Defina **Root Directory** = `backend`
5. Build Command: `npm install --production`
6. Start Command: `node src/server.js`
7. Plano: Free
8. Vincule o banco PostgreSQL ao Web Service (Render injeta a variável `DATABASE_URL` automaticamente) ou preencha `DATABASE_URL` manualmente nas env vars

### Opção B: PostgreSQL externo (ex.: Supabase, Neon, ElephantSQL) + Render (backend)
1. Crie um PostgreSQL gratuito no provedor de sua escolha
2. Anote: host, porta, usuário, senha, nome do banco (ou a string `DATABASE_URL`)
3. No Render, crie o Web Service apontando para `backend` e preencha `DATABASE_URL` (ou `DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USER`/`DB_PASSWORD`)

## Variáveis de ambiente para configurar

No serviço de deploy do backend (Render), defina estas variáveis:

| Variável | Onde pegar |
|---|---|
| `DATABASE_URL` | String de conexão do PostgreSQL (Render injeta automaticamente ao vincular o banco) |
| `DB_HOST` | Host do PostgreSQL (se não usar `DATABASE_URL`) |
| `DB_PORT` | Porta do PostgreSQL (geralmente `5432`) |
| `DB_NAME` | Nome do banco (ex: `art_portfolio`) |
| `DB_USER` | Usuário do PostgreSQL |
| `DB_PASSWORD` | Senha do PostgreSQL |
| `ADMIN_USERNAME` | admin (ou outro) |
| `ADMIN_PASSWORD` | Senha forte para o admin |
| `ADMIN_SESSION_TTL_HOURS` | 8 |
| `IMAGE_SERVICE_URL` | URL do serviço de imagens (ou deixe vazio) |
| `PORT` | 3000 |

## Depois que o backend estiver online

1. Anote a URL do backend (ex: `https://seu-backend.onrender.com`)
2. Atualize o frontend com essa URL:
   - No painel do Vercel do projeto frontend, vá em **Settings → Environment Variables**
   - Adicione `API_BASE` = `https://seu-backend.onrender.com/api`
   - Faça Re-deploy
3. O link público do frontend será: `https://frontend-nine-taupe-63.vercel.app`

## Arquivos já preparados no repositório

- `backend/Dockerfile` — para deploy em qualquer serviço com Docker
- `backend/render.yaml` — manifesto para deploy direto no Render
- `backend/.env.example` — modelo de variáveis de ambiente
- `database/schema.postgres.sql` — esquema pronto para criar as tabelas no PostgreSQL
- `frontend/vercel.json` + `frontend/build.js` — frontend já configurado no Vercel

## Comandos úteis

Se quiser rodar o backend localmente para testar antes do deploy:
```bash
cd backend
npm install
npm start
# Acesse: http://localhost:3000/api/health
```
(Requer um PostgreSQL local rodando na porta 5432 com o banco `art_portfolio` criado via `database/schema.postgres.sql`.)

## Diferenças do MySQL para o PostgreSQL (resumo)

- Driver: `mysql2` → `pg` (placeholders `?` viraram `$1`, `$2`, …)
- `ON DUPLICATE KEY UPDATE` → `ON CONFLICT (file_name) DO UPDATE SET ... EXCLUDED.coluna`
- `result.insertId` → `RETURNING id` e leitura via `rows[0].id`
- `result.affectedRows` → `result.rowCount`
- `featured` passa a ser `BOOLEAN` (`true`/`false`) em vez de `TINYINT(1)` (`1`/`0`)
- `labels` continua como JSON (`JSONB` no PostgreSQL), então `labels.description` funciona igual
- Conexão: suporte a `DATABASE_URL` (padrão do Render) com fallback para variáveis individuais `DB_*`
- `pool.query` retorna `{ rows }` em vez de `[rows]`
