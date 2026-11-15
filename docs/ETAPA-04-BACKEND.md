# Relatório Técnico — Etapa 04: Backend Express.js

## 1. Objetivo da etapa

Implementar a API REST (Node.js + Express.js + MySQL) que alimenta o frontend, substituindo os dados simulados por uma fonte real, mantendo o contrato de dados já consumido pelo frontend.

## 2. Arquitetura implementada

```
backend/
├── package.json          # express, mysql2, cors, dotenv
├── .env                  # credenciais locais (NÃO versionado)
├── .env.example          # template versionado
├── scripts/
│   ├── reseed.js         # re-seed com UTF-8 correto (dev)
│   └── smoke-test.js     # 12 testes automatizados (dev)
└── src/
    ├── server.js         # app Express, middlewares, healthcheck
    ├── db.js             # pool mysql2 (utf8mb4, dateStrings)
    ├── lib/mappers.js    # mapeamento SQL -> contrato do frontend
    ├── middleware/
    │   ├── auth.js       # Bearer token ADMIN_TOKEN
    │   └── errorHandler.js # erros JSON centralizados
    └── routes/
        ├── artist.js       # GET /api/artist
        ├── publications.js # GET /api/publications, /:id
        └── admin.js        # POST/PUT/DELETE /api/admin/publications
```

## 3. Contrato da API

| Método | Rota | Auth | Resultado testado |
|---|---|---|---|
| GET | `/api/health` | não | 200 |
| GET | `/api/artist` | não | 200, perfil Kenyureru |
| GET | `/api/publications?limit=&offset=&featured=` | não | 200, `{items,total,limit,offset}` |
| GET | `/api/publications/:id` | não | 200 / 404 |
| POST | `/api/admin/publications` | token | 201 / 400 / 401 |
| PUT | `/api/admin/publications/:id` | token | 200 / 404 / 401 |
| DELETE | `/api/admin/publications/:id` | token | 204 / 404 / 401 |

Formato do item: `{ id: "pub-XX", db_id, title, description, complementary, date: "YYYY-MM-DD", featured: bool, image: { file_name, file_size, width, height, tone } }`.

## 4. Decisões técnicas

1. **Pool mysql2 com `charset: 'utf8mb4'` e `dateStrings: true`** — garante acentos UTF-8 na wire e datas `YYYY-MM-DD` sem shift de fuso.
2. **`tone = db_id % 5`** — mantém placeholders SVG coloridos do frontend até a Etapa 06 (imagens reais).
3. **`id` como `pub-XX`** — compatibilidade com o frontend atual; `db_id` exposto para admin.
4. **Paginação `limit/offset`** — espelha os lotes 6+4 do feed progressivo.
5. **Token simples `Bearer ADMIN_TOKEN`** — base documentada para auth real na Etapa 07; nunca exposto em responses/logs.
6. **Least privilege** — `art_portfolio_app` só tem CRUD; re-seed usou DELETE (sem ALTER), portanto AUTO_INCREMENT continua (ids 11-20 após re-seed; sem impacto funcional).

## 5. Problemas encontrados e soluções

| Problema | Causa | Solução |
|---|---|---|
| Mojibake (`S??o`) no seed original | Pipe `Get-Content \| mysql` corrompeu encoding na Etapa 03 | `scripts/reseed.js` com `SET NAMES utf8mb4` e leitura UTF-8 do seed.sql |
| `date` como ISO com timezone | mysql2 retorna Date | `dateStrings: true` no pool |
| `ALTER` negado ao app user | least privilege (correto) | Removido ALTER do reseed; gap de AUTO_INCREMENT aceito |
| `` no console | Console PS não é UTF-8 | Verificação via hexdump bytes (`53 C3 A3 6F` = "São") e code points |

## 6. Testes executados (todos locais, sem deploy)

- `node --check` em 8 arquivos JS: OK.
- `GET /api/health`: 200.
- `GET /api/artist`: 200, `São Paulo, Brasil` em UTF-8 válido.
- `GET /api/publications?limit=6`: 6 itens, `total=10`.
- `GET /api/publications?featured=true`: 1 item.
- `GET /api/publications?featured=false&limit=4&offset=4`: próximos 4, sem destaque.
- `GET /api/publications/2`: 200; `/999`: 404 com `{error}`.
- `scripts/smoke-test.js`: **12/12 PASS** (401 sem token, 201 criar, 400 validação, 200 update, 204 delete, 404 inexistente, feed sem destaque).

## 7. Pendências

1. Etapa 05: trocar array simulado em `frontend/js/main.js` por `fetch()` à API.
2. Etapa 06: imagens reais + image-service (tone/placeholder ficam provisórios).
3. Etapa 07: autenticação real substituindo o token simples.
4. Deploy do backend: somente com autorização explícita (Render Free, conforme relatório de servidores).

## 8. Pontos de continuidade

- OpenSpec: change `backend-express-api` documenta esta entrega.
- Servidor local: `cd backend && npm start` (porta 3000).
- Próxima atividade: Etapa 05 — integração full stack (`fetch()` no frontend).
