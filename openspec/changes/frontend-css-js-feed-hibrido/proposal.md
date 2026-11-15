# Proposal — frontend-css-js-feed-hibrido

## Why

O frontend do Art Portfolio existia apenas como HTML estático com conteúdo hardcoded, sem a identidade visual definida pelo projeto (paleta `#F8EEEE`/`#EAD6D5`/`#292323`/`#FFFFFF`, Space Grotesk + Inter) e sem a lógica do feed híbrido exigida (destaque manual + cronológico sem repetir o destaque). A Etapa 02 precisa fechar essa lacuna antes de qualquer integração com backend.

## What Changes

- CSS: stylesheet mínimo (32 linhas) substituído por stylesheet completo de identidade visual editorial — tokens expandidos (espaçamento, raios, sombras, transições, breakpoints), tipografia fluida com `clamp()`, header sticky, hero editorial, seção about, cartão de destaque, grid responsivo de publicações, footer, utilitários (`.container`, `.sr-only`), estados `:focus-visible` e `prefers-reduced-motion`.
- JavaScript: novo `main.js` com dados mock de publicações e renderização do feed híbrido — destaque único em `#featured` + listagem cronológica em `#feed` excluindo o destaque, ordenada por data ISO decrescente, datas formatadas em pt-BR, cartões acessíveis (`article` com `tabindex`, `role`, `aria-label`), link ativo no menu por seção e scroll reveal respeitando `prefers-reduced-motion`.
- `index.html` mantido inalterado (escopo da autorização desta etapa).

## Capabilities

### New Capabilities

- `frontend-visual-design`: identidade visual editorial minimalista, responsividade mobile-first e acessibilidade de foco/movimento aplicadas à interface pública.
- `feed-hibrido`: comportamento do feed de publicações — destaque fixo selecionável manualmente + listagem cronológica que nunca repete o destaque.

### Modified Capabilities

- (vazio — não há capabilities existentes no projeto; primeira especificação do repositório)

## Impact

- Arquivos modificados: `frontend/css/style.css` (reescrito), `frontend/js/main.js` (reescrito).
- Arquivos criados: `openspec/` (raiz do OpenSpec), `.agents/skills/` (skills do OpenSpec para OpenCode), esta change em `openspec/changes/frontend-css-js-feed-hibrido/`.
- Sem impacto em `backend/`, `database/`, `image-service/`, `storage/` (ainda não implementados — Etapas 03 a 06).
- Dependências novas: nenhuma. Fontes carregadas via Google Fonts (`@import`) com fallback para stacks de sistema; dados mock substituíveis por `fetch()` na Etapa 05 sem alterar a interface de renderização.
