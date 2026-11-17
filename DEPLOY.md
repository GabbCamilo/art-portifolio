# Deploy do Backend (Node.js + MySQL)

## Pré-requisito: MySQL na nuvem

O backend precisa de um MySQL acessível pela internet. O MySQL que está no seu computador (localhost:3306) **não** funciona para deploy, pois não é acessível de fora.

### Opção A: Render (recomendado — tudo em um lugar)
1. Crie conta em https://render.com
2. Crie um "PostgreSQL" → na verdade procure por "MySQL" ou use um add-on MySQL
   *(Se não houver MySQL direto, use Aiven para o MySQL e Render só para o backend)*

### Opção B: Aiven (MySQL grátis) + Render/Railway (backend)
1. Crie conta em https://aiven.io
2. Crie um serviço "MySQL" (plano gratuito)
3. Anote: host, porta, usuário, senha, nome do banco
3. Crie conta em https://render.com ou https://railway.app
4. Faça deploy do backend conectando o GitHub deste repositório

## Variáveis de ambiente para configurar

No serviço de deploy do backend, defina estas variáveis:

| Variável | Onde pegar |
|---|---|
| `DB_HOST` | Host do MySQL na nuvem (ex: `seu-mysql.aivencloud.com`) |
| `DB_PORT` | Porta do MySQL (geralmente `3306`) |
| `DB_NAME` | Nome do banco (ex: `art_portfolio`) |
| `DB_USER` | Usuário do MySQL |
| `DB_PASSWORD` | Senha do MySQL |
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
- `backend/render.yaml` — para deploy direto no Render
- `backend/.env.example` — modelo de variáveis de ambiente
- `frontend/vercel.json` + `frontend/build.js` — frontend já configurado no Vercel

## Comandos úteis

Se quiser rodar o backend localmente para testar antes do deploy:
```bash
cd backend
npm install
npm start
# Acesse: http://localhost:3000/api/health
```
