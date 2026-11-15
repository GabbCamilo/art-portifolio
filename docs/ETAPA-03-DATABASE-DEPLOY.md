# Relatório Técnico — Etapa 03: Banco de Dados e Deploy

## 1. Objetivo da etapa

Concluir a modelagem do banco de dados MySQL, popular dados iniciais, criar o usuário de aplicação com permissões CRUD e realizar o deploy do frontend estático no Vercel.

## 2. Banco de dados (MySQL 8.0.46)

### Execução

```powershell
# Schema (banco + tabelas + índices + restrições)
Get-Content database/schema.sql -Raw | mysql -u root -proot -h localhost

# Seed (perfil do artista + 10 publicações)
Get-Content database/seed.sql -Raw | mysql -u root -proot -h localhost
```

### Resultados validados

- Banco `art_portfolio` criado (charset `utf8mb4`, collation `utf8mb4_unicode_ci`).
- Tabelas criadas: `artist_profile` (1 linha, constraint `chk_artist_profile_single_row`) e `publications` (10 linhas, índice em `featured` e `published_at`, `file_name` UNIQUE).
- `SELECT COUNT(*) FROM publications WHERE featured = 1` = 1.
- Usuário `art_portfolio_app`@`localhost` existente com `GRANT SELECT, INSERT, UPDATE, DELETE ON art_portfolio.*` (validado via `SHOW GRANTS` e login real com a senha do `.env`).

### Dados

- `artist_profile`: Kenyureru, São Paulo/Brasil, Digital.
- `publications`: 10 registros simulados, idênticos ao array `publications` de `frontend/js/main.js`.

## 3. Deploy no Vercel

### Comandos

```powershell
npx vercel login --github
npx vercel deploy --prod --cwd=frontend
```

### Resultados

- Login realizado como `gabbrieleu-2630`.
- Deploy estático detectado a partir de `frontend/` com `vercel.json` (`cleanUrls: true`).
- Produção: https://frontend-nine-taupe-63.vercel.app
- Inspector: https://vercel.com/art-portifolio/frontend/8gJQjwLSxHgYz6ueFJR3koNtyiVh

### Validações HTTP

| Rota | Status | Observação |
|---|---|---|
| `/` | 200 | `index.html` servido (5455 bytes), título "Art Portfolio", contém Kenyureru, lightbox, wall e link admin |
| `/admin/login` | 200 | `admin/login.html` servido (1887 bytes), formulário com campo de senha |

### Observação

A Vercel informou que a conexão GitHub do repositório não está vinculada à conta (erro 400 ao tentar link automático). O deploy estático funcionou independentemente. Para CI/CD automático em push, conectar `vercel git connect --cwd=frontend` após vincular o GitHub na conta Vercel.

## 4. OpenSpec

- Change anterior `frontend-remodel-gallery-lightbox-admin` arquivada (`openspec archive --yes`), 34/35 tarefas (5.5 pendente por ausência de browser headless).
- Nova change `database-and-deploy` criada com `proposal.md`, `design.md`, `tasks.md` e specs `database-modeling`, `deployment-frontend`, `app-user`.
- `openspec validate database-and-deploy` = válido.

## 5. Pendências

1. Conectar repositório GitHub à Vercel para auto-deploy (`vercel git connect`).
2. Validação visual em navegador real (sem browser headless neste ambiente).
3. Trocar `ADMIN_PASSWORD=alterar-aqui` por valor real quando a autenticação backend for implementada (Etapa 07).
4. Etapa 04: backend Express.js consumindo `art_portfolio`.
5. Etapa 06: image-service (Python/FastAPI/Pillow) para miniaturas e srcset.

## 6. Pontos de continuidade

- Próxima atividade: Etapa 04 — Backend Express.js (API de publicações, autenticação, CRUD admin).
- Dependências: MySQL `art_portfolio` pronto; usuário `art_portfolio_app` com CRUD; `.env` configurado.
