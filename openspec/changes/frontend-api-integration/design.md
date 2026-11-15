# Design — frontend-api-integration

## Context

O backend (Etapa 04) serve `/api/artist`, `/api/publications` (paginado, filtro `featured`) e CRUD admin. O frontend (Etapa 02) renderiza a partir de constantes locais. Esta etapa conecta os dois sem alterar a interface, a identidade visual ou a lógica de lightbox/feed já validadas.

## Goals / Non-Goals

**Goals:**
- `state.artist`, `state.featured` e `state.collection` populados via `fetch()` à API local.
- Feed progressivo com paginação real (`limit`/`offset`) usando `total` da API para saber quando parar.
- Fallback para dados simulados se a API estiver indisponível (robustez local e em produção antes do deploy do backend).
- Testabilidade: funções de data-access exportáveis e testáveis no Node contra o backend real.

**Non-Goals:**
- Deploy do backend em produção (somente com autorização explícita).
- Alteração de HTML/CSS ou da lógica de lightbox/indicadores/foco.
- Autenticação no frontend (Etapa 07).
- Imagens reais / srcset (Etapa 06).

## Decisions

1. **`API_BASE` constante** — `http://localhost:3000/api` em desenvolvimento; trocar por variável de ambiente no deploy futuro. Alternativa rejeitada: URL relativa — backend e frontend estão em origens distintas nesta etapa.

2. **Estado centralizado** — `state = { artist, featured, collection, total, renderedCount, useApi, lightboxIndex, lastFocusedElement }`. Todas as funções de render leem de `state`, nunca de constantes globais.

3. **Fallback simulado** — `useSimulatedFallback()` é acionado no `catch` do `bootstrap()`, preservando as constantes `SIMULATED_ARTIST` e `SIMULATED_PUBLICATIONS` (dados da Etapa 02). O site nunca quebra; aviso via `console.warn`.

4. **Paginação real** — `loadFeedBatch(limit, offset)` consome `total` da API; `renderNextBatch()` calcula `remaining = total - renderedCount` e pede `min(BATCH_NEXT, remaining)`. Lote inicial 6, seguintes 4 (preserva orçamento de transferência da Etapa 02).

5. **Contrato inalterado** — a API já retorna o formato consumido pelo frontend (`id`, `title`, `description`, `complementary`, `date`, `featured`, `image{...}`); nenhum mapeamento extra no frontend.

6. **Hero** — imagem secundária = `state.collection[0]` (primeiro não-featured por data), equivalente ao antigo `getChronological()[0]`.

7. **Sem novos eventos de UI** — sentinela, `IntersectionObserver`, `rootMargin: 200px` e mensagens de status mantidos idênticos.

8. **Testes Node** — `module.exports` expõe `loadArtist`, `loadFeatured`, `loadFeedBatch`, `computeIndicatorWindow`, `state` e constantes simuladas quando executado fora do browser; `DOMContentLoaded` permanece guards-only.

## Fluxo de dados

```
init()
 └─ bootstrap()
     ├─ loadArtist()            -> GET /api/artist
     ├─ loadFeatured()          -> GET /api/publications?featured=true
     ├─ loadFeedBatch(6, 0)     -> GET /api/publications?featured=false&limit=6&offset=0
     ├─ state.useApi = true
     └─ catch -> useSimulatedFallback() + state.useApi = false
 ├─ renderFeatured()
 ├─ renderHero()
 ├─ renderInitialWall()          (6 itens + sentinela)
 └─ initLightbox()

sentinela intersecta -> renderNextBatch()
 ├─ useApi ? loadFeedBatch(min(4, remaining), collection.length)
 │         : collection.slice(renderedCount, +4)
 └─ render + atualizar status / "Fim das publicações."
```

## Risks / Trade-offs

- [Produção aponta para localhost] Antes do deploy do backend, o site em produção usará o fallback simulado (API indisponível). Mitigação: documentado; trocar `API_BASE` no deploy do backend (Etapa 08).
- [Dupla fonte de dados] Fallback mantém dados simulados em código. Mitigação: isolados em constantes `SIMULATED_*`; remoção planejada quando backend estiver em produção.
- [Timezone] Datas vêm como `YYYY-MM-DD` do backend (`dateStrings`), sem shift. Mantido.
- [Sem browser headless] Validação visual em navegador real permanece pendente; lógica validada por testes Node contra backend real.

## Migration Plan

1. Criar change OpenSpec e validar.
2. Reescrever `frontend/js/main.js` (camada de dados).
3. `node --check frontend/js/main.js`.
4. Testes Node reais contra backend local (artist, featured, batch, indicadores).
5. `docs/ETAPA-05-FULLSTACK.md` + README.
6. Commit local (sem deploy).
7. `openspec archive frontend-api-integration`.

## Open Questions

- `API_BASE` em produção: variável de build da Vercel ou config no deploy do backend? Decidir na Etapa 08.
- Remoção dos dados simulados: somente após backend em produção e validação visual.