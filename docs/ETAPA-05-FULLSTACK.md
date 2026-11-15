# Relatório Técnico — Etapa 05: Integração Full Stack

## 1. Objetivo da etapa

Conectar o frontend à API REST da Etapa 04 via `fetch()`, substituindo os dados simulados hardcoded por dados reais do MySQL, com fallback simulado quando a API estiver indisponível.

## 2. Arquivo modificado

`frontend/js/main.js` (único). HTML e CSS intocados — o contrato de dados é idêntico ao simulado.

## 3. Arquitetura de dados

```
state = {
  artist,        // GET /api/artist
  featured,      // GET /api/publications?featured=true → items[0]
  collection,    // GET /api/publications?featured=false&limit=&offset= (acumulado)
  total,         // total da API (feed sem destaque)
  renderedCount, // itens já renderizados no muro
  useApi,        // true = dados reais; false = fallback simulado
  lightboxIndex, lastFocusedElement
}
```

- `API_BASE = 'http://localhost:3000/api'` (constante; trocar no deploy do backend).
- `bootstrap()` tenta API; no `catch`, `useSimulatedFallback()` preenche o estado com `SIMULATED_ARTIST`/`SIMULATED_PUBLICATIONS` e `console.warn`.
- Feed progressivo real: lote 1 `limit=6&offset=0`; sentinela pede `limit=4&offset=N`; `total` define o fim ("Fim das publicações.").
- Lógica de UI preservada: lightbox, indicadores de 5 unidades, zonas de clique, foco preso/restaurado, `IntersectionObserver`, lazy loading, placeholders SVG.

## 4. Testes executados (todos locais)

| Teste | Resultado |
|---|---|
| `node --check frontend/js/main.js` | OK |
| `loadArtist()` | `Kenyureru | São Paulo, Brasil` (UTF-8 válido) |
| `loadFeatured()` | `pub-11 | Retratos Urbanos | featured = true` |
| `loadFeedBatch(6, 0)` | 6 itens, `total = 9`, primeiro `pub-12` (2026-04-08) — destaque excluído |
| `loadFeedBatch(4, 6)` | 3 itens restantes, `total = 9` |
| `computeIndicatorWindow(5, 10, 3)` | `{start: 3, end: 7}` — janela fixa de 5 centralizada |
| API fora do ar | `loadArtist()` rejeita ("fetch failed"); fallback preenche `Kenyureru`, 9 itens, `useApi = false` |

Smoke test da Etapa 04 continua 12/12 PASS.

## 5. Decisões técnicas

1. **Fallback simulado mantido** — site nunca quebra (produção no Vercel aponta para localhost até o deploy do backend).
2. **Paginação real** — `limit`/`offset`/`total` da API; orçamento de transferência da Etapa 02 preservado (lotes 6+4).
3. **`module.exports`** — expõe data-access e utilitários para testes Node; guard `typeof document` impede efeitos no servidor.
4. **Hero** — imagem secundária = `state.collection[0]` (primeiro não-featured), equivalente ao antigo `getChronological()[0]`.

## 6. Riscos

- [Produção] `API_BASE` aponta para `localhost:3000`; visitante real usará fallback simulado até o deploy do backend (Etapa 08, mediante autorização).
- [Validação visual] Sem browser headless neste ambiente; renderização validada por testes de contrato + revisão de código.

## 7. Pendências

1. Etapa 06: imagens reais + `srcset`/`sizes` + image-service (Python/FastAPI/Pillow).
2. Etapa 07: autenticação real (substituir token simples).
3. Etapa 08: deploy do backend + `API_BASE` de produção.

## 8. Pontos de continuidade

- OpenSpec: change `frontend-api-integration` arquivada; spec `api-data-loading` registrada.
- Próxima atividade: Etapa 06 — processamento de imagens (image-service).
