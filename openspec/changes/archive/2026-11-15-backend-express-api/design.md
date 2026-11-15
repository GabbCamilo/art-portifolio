# Design — backend-express-api

## Context

A Etapa 03 deixou o MySQL pronto (`art_portfolio` com `artist_profile` e `publications` populados, usuário `art_portfolio_app` com CRUD) e o frontend publicado no Vercel. Esta etapa implementa a API REST que alimentará o frontend, preparando o terreno para a Etapa 05 (integração full stack com `fetch()`).

## Goals / Non-Goals

**Goals:**
- API Express servindo `GET /api/artist` e `GET /api/publications` com filtros e paginação.
- Contrato de dados idêntico ao array simulado atual do frontend (campos `id`, `title`, `description`, `complementary`, `date`, `featured`, `image{file_name,file_size,width,height,tone}`).
- CRUD administrativo protegido por token (`ADMIN_TOKEN` no `.env`), base para autenticação real na Etapa 07.
- Testável localmente (localhost:3000) sem deploy.

**Non-Goals:**
- Autenticação real com sessions/JWT completo (Etapa 07).
- Upload de imagens e processamento (Etapa 06, image-service).
- Deploy em produção (somente após autorização explícita).
- Alterar o frontend (a troca de dados simulados por `fetch()` é Etapa 05).

## Decisions

1. **Express + mysql2 com pool** — pool de conexões reutiliza conexões; `mysql2` suporta promises nativamente. Alternativa rejeitada: Sequelize/ORM — desnecessário para duas tabelas e adiciona abstração sobre SQL aprendizado.

2. **Contrato de dados preservado** — a API mapeia colunas SQL para o formato JS já consumido: `id`, `title`, `description`, `complementary`, `date` (YYYY-MM-DD), `featured` (boolean), `image{file_name, file_size, width, height, tone}`. `tone` é derivado estável (`id % 5`) para manter os placeholders SVG coloridos do frontend até a Etapa 06.

3. **Paginação obrigatória** — `GET /api/publications` aceita `limit` (padrão 6) e `offset` (padrão 0), espelhando os lotes 6+4 do feed progressivo. Retorna `{ items, total, limit, offset }`.

4. **Filtro `featured`** — `?featured=true` retorna só a publicação principal; `?featured=false` retorna o feed cronológico (exclui o destaque), mantendo a regra "destaque não duplicado no muro".

5. **Ordenação decrescente** — `ORDER BY published_at DESC, id DESC` garante recentes primeiro, estável em empates.

6. **Admin token simples** — header `Authorization: Bearer <ADMIN_TOKEN>` nos endpoints de escrita. Não é segurança real; documentado como base para Etapa 07. Nunca expor token em responses ou logs.

7. **CORS configurado** — `cors()` com origem do frontend (localhost:5500 em dev, domínio Vercel em produção) para permitir fetch cross-origin na Etapa 05.

8. **dotenv** — credenciais em `.env` (gitignored); apenas `.env.example` versionado.

9. **Validação de entrada** — CRUD valida tipos (`title` string não vazia, `width`/`height` inteiros positivos, `featured` boolean) e retorna 400 com mensagem clara.

10. ** Tratamento de erros centralizado** — middleware de erro retorna JSON `{ error: string }` com status adequado (400/401/404/500); nunca vazar stack trace em produção.

## Arquitetura

```
backend/
├── package.json
├── .env.example
├── .env (gitignored)
└── src/
    ├── server.js      # app Express, middlewares, rotas, healthcheck
    ├── db.js          # pool mysql2 a partir de process.env
    ├── routes/
    │   ├── artist.js       # GET /api/artist
    │   ├── publications.js # GET /api/publications, GET /api/publications/:id
    │   └── admin.js        # POST/PUT/DELETE /api/admin/publications (token)
    └── middleware/
        ├── auth.js         # verifica Bearer token
        └── errorHandler.js # middleware de erro centralizado
```

## Contrato da API

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/health` | não | Healthcheck |
| GET | `/api/artist` | não | Perfil do artista |
| GET | `/api/publications` | não | Lista paginada; `?featured=true|false&limit=&offset=` |
| GET | `/api/publications/:id` | não | Obra individual |
| POST | `/api/admin/publications` | token | Criar publicação |
| PUT | `/api/admin/publications/:id` | token | Atualizar publicação |
| DELETE | `/api/admin/publications/:id` | token | Remover publicação |

### Exemplo de resposta `GET /api/publications?limit=6`

```json
{
  "items": [
    {
      "id": "pub-02",
      "title": "Natureza Abstrata",
      "description": "...",
      "complementary": "",
      "date": "2026-04-08",
      "featured": false,
      "image": { "file_name": "natureza-abstrata.jpg", "file_size": "1,8 MB", "width": 1600, "height": 900, "tone": 1 }
    }
  ],
  "total": 9,
  "limit": 6,
  "offset": 0
}
```

Nota: `id` retornado como string no formato `pub-XX` para compatibilidade com o frontend atual (que usa ids como `pub-02`); o `id` numérico do banco é exposto em `db_id` interno para admin.

## Risks / Trade-offs

- [Token simples] `ADMIN_TOKEN` em `.env` não é autenticação real. Mitigação: documentado; Etapa 07 implementa auth real.
- [ID formatado] Retornar `pub-XX` em vez do PK numérico adiciona mapeamento. Mitigação: `db_id` interno; justifica-se pela compatibilidade frontend.
- [tone derivado] `tone = id % 5` é provisório até imagens reais (Etapa 06). Mitigação: documentado.
- [Datas date-only] `published_at` é DATE; JSON serializa como `YYYY-MM-DD` sem shift de fuso (evita o problema documentado na Etapa 02).
- [Sem deploy] Backend roda apenas localmente nesta etapa; deploy só com autorização.

## Migration Plan

1. Criar `backend/package.json` e instalar dependências (`npm install`).
2. Implementar `db.js`, `server.js`, rotas e middlewares.
3. Testar localmente com `node src/server.js` + `curl`/PowerShell `Invoke-WebRequest`.
4. `openspec validate backend-express-api` (strict).
5. Commit local (sem push de produção).
6. Arquivar change após validação.

## Open Questions

- A Etapa 05 trocará `id` para numérico real ou manterá `pub-XX`? Decisão adiada para integração.
- Upload de imagens (Etapa 06) exigirá `multipart/form-data` — endpoint separado no image-service.