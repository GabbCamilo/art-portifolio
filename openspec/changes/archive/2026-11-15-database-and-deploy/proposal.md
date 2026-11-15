# Proposal — database-and-deploy

## Why

O Art Portfolio está na Etapa 03. O frontend já está implementado com dados simulados (`frontend/js/main.js`). A próxima etapa é:
- Criar o banco de dados MySQL (`art_portfolio`) com tabelas `artist_profile` e `publicações`, conforme definido em `database/schema.sql`.
- Popular dados iniciais em `database/seed.sql`.
- Criar um usuário de aplicação dedicado (`art_portfolio_app`) com permissões CRUD limitadas.
- Implantar o frontend estático no Vercel (já configurado) para garantir acesso público enquanto o backend continua em desenvolvimento.
- Configurar o ambiente (`.env.example` com variáveis) e validar a infraestrutura completa.

## What Changes

- `database/schema.sql`: criação de tabelas MySQL (`artist_profile`, `publicações`) com chaves primárias, índices e restrições de integridade.
- `database/seed.sql`: inserção de dados iniciais para `artist_profile` e `publicações` (same array simulado do frontend).
- `frontend/vercel.json`: configuração de deploy (já existe com `cleanUrls`).
- `.env.example`: variáveis de ambiente (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `ADMIN_PASSWORD`).
- `docs/RELATORIO-SERVIDORES-GRATUITOS.md`: relatório atualizado de infraestrutura e servidores gratuitos.

## Capabilities

### New Capabilities

- `database-modeling`: modelagem de schema MySQL (`artist_profile`, `publicações`) com integridade referencial, restrições de unicidade e índices.
- `deployment-frontend`: implantação do frontend estático no Vercel via CI/CD, preview deployments e CDN global.
- `app-user`: criação de conta de aplicação (`art_portfolio_app`) com permissões CRUD no banco de dados.

### Modified Capabilities

- (vazio — esta é a primeira entrega completa das capacidades acima)

## Impact

- Arquivos criados: `database/schema.sql`, `database/seed.sql`, `frontend/vercel.json`, `.env.example`, `docs/RELATORIO-SERVIDORES-GRATUITOS.md`.
- Arquivos modificados: `README.md` (status atualizado), `docs/ETAPA-02-FRONTEND.md` (referência à Etapa 03).
- Sem impacto em backend/, image-service/, storage/ (backend ainda não desenvolvido).
- Dependências novas: nenhuma; apenas MySQL 8 e Vercel (gratuito).