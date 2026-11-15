# Design — database-and-deploy

## Context

A Etapa 02 concluiu o frontend (página única, galeria progressiva, lightbox e área administrativa visual). Os dados ainda são simulados em `frontend/js/main.js`. Esta Etapa 03 cria o banco de dados MySQL, popula dados iniciais e implanta o frontend no Vercel, mantendo a identidade visual e sem alterar a estrutura do frontend já implementada.

## Goals / Non-Goals

**Goals:**
- Criar o banco `art_portfolio` com tabelas `artist_profile` e `publicações`.
- Popular dados iniciais idênticos aos dados simulados do frontend.
- Criar usuário de aplicação `art_portfolio_app` com permissões CRUD.
- Deploy do frontend no Vercel (Hobby $0) via repositório GitHub.
- Documentar a infraestrutura e validar o ambiente.

**Non-Goals:**
- Backend Express.js (Etapa 04).
- Autenticação real (Etapa 07).
- Processamento de imagens com Python/FastAPI (Etapa 06).
- Integração full stack com `fetch()` ao backend (Etapa 05).
- Armazenamento definitivo de imagens no backend (Etapa 06).

## Decisions

1. **Schema MySQL 8** — tabelas InnoDB, charset `utf8mb4`, collation `utf8mb4_unicode_ci`. `artist_profile` tem constraint `chk_artist_profile_single_row` para garantir uma única linha (id=1). `publicações` tem `featured` TINYINT(1) para marcação da publicação principal e índices em `featured` e `published_at` para performance.

2. **Seed com dados simulados** — `seed.sql` insere os mesmos 10 itens do array `publications` em `main.js`, mantendo consistência entre frontend e banco. Datas `date-only` no formato `YYYY-MM-DD` (documentado: tratamento de timezone na Etapa 05).

3. **Usuário de aplicação `art_portfolio_app`** — criado com `CREATE USER` e permissões CRUD (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) no banco `art_portfolio`. Não usa `root` (segurança). Senha não versionada (`.env` excluída pelo `.gitignore`).

4. **Deploy Vercel** — repositório GitHub `GabbCamilo/art-portifolio` importado na Vercel. Root Directory = `frontend/`, Framework Preset = Other. `vercel.json` ativa `cleanUrls` (URLs sem `.html`). Preview deployments a cada push. CDN global incluída.

5. **Sem alterações no frontend** — o deploy usa o frontend já implementado na Etapa 02. Nenhuma alteração de código é necessária.

## Arquitetura do Schema

```
art_portfolio
├── artist_profile (1 linha)
│   ├── id TINYINT UNSIGNED PRIMARY KEY DEFAULT 1 (CHECK id=1)
│   ├── name VARCHAR(120)
│   ├── location VARCHAR(120)
│   ├── medium VARCHAR(120)
│   ├── website VARCHAR(255)
│   ├── store VARCHAR(255)
│   ├── patreon VARCHAR(255)
│   ├── created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
│   └── updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
└── publicações
    ├── id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
    ├── title VARCHAR(160)
    ├── description TEXT
    ├── complementary TEXT
    ├── published_at DATE
    ├── featured TINYINT(1) DEFAULT 0 (INDEX)
    ├── file_name VARCHAR(255) UNIQUE
    ├── file_size VARCHAR(32)
    ├── width SMALLINT UNSIGNED
    ├── height SMALLINT UNSIGNED
    ├── created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ├── updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
    └── INDEX idx_publications_published_at (published_at)
```

## Fluxo de Deploy

1. GitHub repo `GabbCamilo/art-portifolio` conectado à Vercel.
2. Vercel detecta `frontend/vercel.json` e configura `cleanUrls`.
3. Cada push na `main` dispara rebuild automático.
4. Preview deployments geram URLs únicas para testes.
5. Produção serve `index.html` na raiz, `admin/login.html` em `/admin/login`.

## Risks / Trade-offs

- [Datas date-only] `published_at` é DATE (sem hora). Tratamento de timezone será feito na Etapa 05.
- [Senha em texto claro] `.env` contém senha do banco. Mitigação: `.env` excluída pelo `.gitignore`; apenas `.env.example` versionado.
- [Segurança MySQL] Usuário `art_portfolio_app` tem permissões CRUD totais. Mitigação: restringir a IPs específicos em produção (firewall MySQL).
- [Vercel Hobby] Limite de 100 GB transferência/mês. Mitigação: orçamento de transferência documentado na Etapa 02.
- [Sem backend] O deploy é estático; API ainda não existe. Mitigação: Etapa 04 (backend Express).

## Migration Plan

1. Executar `mysql -u root -p < database/schema.sql` (cria banco e tabelas).
2. Executar `mysql -u root -p < database/seed.sql` (popula dados).
3. Criar usuário `art_portfolio_app` com permissões CRUD.
4. Configurar `.env` local (não versionado).
5. Importar repositório na Vercel (root `frontend/`, Framework Preset = Other).
6. Deploy automático; validar URL de produção.
7. Atualizar `README.md` com status.
8. `openspec validate database-and-deploy` (strict).
9. `openspec archive database-and-deploy`.

## Open Questions

- Quando o backend for implementado (Etapa 04), o schema precisará de tabelas adicionais (users, sessions, tokens)? Provavelmente sim, mas fora do escopo desta Etapa 03.
- O image-service (Etapa 06) precisará de tabelas para metadados de imagens processadas? Avaliar na Etapa 06.