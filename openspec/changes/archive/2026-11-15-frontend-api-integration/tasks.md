# Tasks

## 1. OpenSpec

- [x] 1.1 Criar change `frontend-api-integration` (proposal, design, tasks, specs)
- [x] 1.2 `openspec validate frontend-api-integration`

## 2. Implementação frontend

- [x] 2.1 Reescrever `frontend/js/main.js`: constantes `SIMULATED_ARTIST`/`SIMULATED_PUBLICATIONS`, `state` centralizado, `API_BASE`
- [x] 2.2 Implementar `apiFetch`, `loadArtist`, `loadFeatured`, `loadFeedBatch` via `fetch()`
- [x] 2.3 Implementar `bootstrap()` com `useSimulatedFallback()` no catch
- [x] 2.4 Adaptar `renderFeatured`, `renderHero`, `renderInitialWall`, `renderNextBatch` ao `state`
- [x] 2.5 Preservar lightbox, indicadores, focus trap, sentinela e mensagens de status
- [x] 2.6 Adicionar `module.exports` para testes Node (guard de browser mantido)

## 3. Testes locais (sem deploy)

- [x] 3.1 `node --check frontend/js/main.js` — OK
- [x] 3.2 Teste real: `loadArtist()` retorna Kenyureru via backend local
- [x] 3.3 Teste real: `loadFeatured()` retorna 1 item featured (pub-11 Retratos Urbanos)
- [x] 3.4 Teste real: `loadFeedBatch(4, 4)` retorna lote paginado com `total` (batch1=6, batch2=3, total=9)
- [x] 3.5 Teste real: `computeIndicatorWindow(5,10,3)` = {start:3, end:7} (janela fixa de 5)
- [x] 3.6 Verificar fallback: API fora do ar → `loadArtist` rejeita; `useSimulatedFallback()` preenche state (Kenyureru, 9 itens, featured Retratos Urbanos, useApi=false)

## 4. Documentação

- [x] 4.1 Criar `docs/ETAPA-05-FULLSTACK.md`
- [x] 4.2 Atualizar `README.md` (status Etapa 05)

## 5. Finalização

- [x] 5.1 Commit local (sem deploy de produção)
- [ ] 5.2 `openspec archive frontend-api-integration`

## Regras

- NÃO fazer deploy sem autorização explícita.
- Testar TUDO localmente.