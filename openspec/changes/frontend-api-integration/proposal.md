# Proposal — frontend-api-integration

## Why

O frontend ainda consome dados simulados hardcoded em `frontend/js/main.js` (Etapa 02). O backend da Etapa 04 já expõe a API REST com o mesmo contrato de dados. A Etapa 05 conecta o frontend à API via `fetch()`, preparando a aplicação para dados reais enquanto preserva a experiência standalone (fallback simulado quando a API está indisponível).

## What Changes

- `frontend/js/main.js`: substituição do array `publications` e objeto `artistProfile` por carregamento via `fetch()` à API (`/api/artist`, `/api/publications?featured=true`, `/api/publications?featured=false&limit=&offset=`).
- Estado centralizado em `state` (artist, featured, collection, total, renderedCount, useApi).
- Feed progressivo real: primeiro lote `limit=6`, lotes seguintes `limit=4&offset=N` via sentinela `IntersectionObserver` (lógica de UI preservada).
- Fallback: se a API falhar, dados simulados são usados com `console.warn` (site nunca quebra).
- Exportação de funções para testes Node (`module.exports`) sem afetar o navegador.

## Capabilities

### New Capabilities

- `api-data-loading`: carregamento de artista, destaque e feed paginado via fetch, com fallback simulado e contrato de dados preservado.

### Modified Capabilities

- (vazio — primeira especificação desta capacidade)

## Impact

- Arquivos modificados: `frontend/js/main.js` (camada de dados; lógica de UI/lightbox/acessibilidade preservada).
- Arquivos criados: `docs/ETAPA-05-FULLSTACK.md`.
- Sem impacto em HTML/CSS (contrato de dados inalterado), backend/ ou database/.
- Dependências novas: nenhuma (fetch nativo do browser e do Node 22).