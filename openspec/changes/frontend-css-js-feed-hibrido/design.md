# Design

## Context

O `index.html` já existia com seções fixas (`#hero`, `#about`, `#featured`, `#feed`, footer) e conteúdo hardcoded, mas o `style.css` possuía apenas variáveis de cor e reset básico, e o `main.js` estava vazio. O escopo autorizado desta etapa era exclusivamente CSS e JavaScript — o HTML permaneceu inalterado. Veja `proposal.md` para a motivação completa.

Restrições observadas:
- Sem frameworks frontend (HTML5 + CSS3 + Vanilla JS, por decisão arquitetural do projeto).
- Sem alterar `index.html` nesta etapa.
- Sem backend ainda (Etapas 03-04 pendentes), portanto a fonte de dados é mock interno.

## Goals / Non-Goals

**Goals:**
- Aplicar a identidade visual editorial minimalista com tokens CSS reutilizáveis.
- Implementar o feed híbrido: destaque fixo + cronológico sem duplicação.
- Garantir responsividade mobile-first e acessibilidade de foco/movimento.
- Isolar a fonte de dados para troca futura por API sem reescrever a renderização.

**Non-Goals:**
- Criar ou alterar `index.html`, `artist.html`, `commissions.html`, `contact.html` (fora do escopo autorizado).
- Implementar autenticação, painel administrativo, persistência ou upload de imagens (Etapas 04, 06, 07).
- Processamento de imagens (Etapa 06).

## Decisions

1. **Tokens CSS em `:root` antes de regras** — cores, espaçamento (`--space-*`), raios, sombras, transições e breakpoints centralizados. Alternativa: valores literais espalhados — rejeitada por impedir manutenção da identidade visual e responsividade.
2. **`@import` do Google Fonts no topo do CSS** — mantém o HTML intocado (escopo da etapa) e ainda carrega Space Grotesk + Inter. Alternativa: `<link>` no `index.html` — melhor performance, mas exigiria editar HTML, fora da autorização. O CSS prevê stacks de fallback para uso offline.
3. **Tipografia fluida com `clamp()`** — escala contínua entre mobile e desktop sem media queries por fonte. Alternativa: breakpoints manuais por tamanho de fonte — mais verboso e menos preciso.
4. **Grid com `auto-fill/minmax()`** — publicações fluem em colunas responsivas sem regras por breakpoint. Alternativa: grid fixo com media queries — mais frágil em larguras intermediárias.
5. **Dados mock em array isolado com datas ISO** — `publications` com `id`, `title`, `description`, `date` (ISO), `featured`, `image`. ISO permite ordenação confiável via `new Date()`. Alternativa: ler o HTML estático (DOM scraping) — frágil e mistura dados com apresentação.
6. **Renderização por funções puras** — `createPostCardContent()` (HTML string) e `createPostCard()` (elemento) isolam a montagem do cartão; `initFeed()` orquestra destaque + cronológico. Alternativa: templates `<template>` no HTML — rejeitada porque não podíamos editar o HTML.
7. **`IntersectionObserver` para link ativo e scroll reveal** — nativo, sem dependências, performático. Alternativa: listener de `scroll` com cálculo manual — mais propenso a falhas e consumo de CPU.
8. **Criação dinâmica de `.post-grid`** — o JS cria o container se o HTML não o tiver, preservando compatibilidade com o markup atual.

## Risks / Trade-offs

- [Fontes externas] `@import` exige internet; em uso offline o layout cai para sans-serif genérico. → Mitigação: stacks de fallback em `:root`; migração futura para `<link>` no HTML ou fontes locais quando o HTML puder ser editado.
- [Date-only ISO e timezone] `new Date('2026-05-12')` é meia-noite UTC; em fusos negativos a data exibida pode ser o dia anterior. → Mitigação: documentado; na Etapa 05 o backend enviará datas completas com offset ou o front aplicará tratamento explícito de fuso.
- [HTML hardcoded substituído em tempo de execução] o JS sobrescreve o conteúdo estático de `#featured` e `#feed`. → Mitigação: o conteúdo estático serve como fallback sem-JS (progressive enhancement); quando JS roda, a fonte de verdade é o array.
- [Páginas ausentes] `commissions.html` e `contact.html` são referenciados no menu mas não existem. → Mitigação: pendência registrada; criar páginas ou remover referências na próxima revisão de HTML.
- [Sem imagens reais] `image: null` nos dados mock. → Mitigação: CSS já prevê `.post-image` com `object-fit: cover` e fundo de fallback.

## Migration Plan

1. Manter esta change como referência do comportamento vigente do frontend.
2. Etapa 05 (integração Full Stack): trocar o array mock por `fetch()` ao endpoint de publicações, mantendo `initFeed()` e os card builders inalterados.
3. Quando houver imagens processadas (Etapa 06): popular `image` nos dados e renderizar `<img class="post-image">` no cartão.
4. Rollback simples: remover o `<script src="js/main.js">` (ou o arquivo) devolve o site ao HTML estático original, já que o HTML nunca foi alterado.

## Open Questions

- Quem e como será a seleção manual do destaque pelo proprietário? (depende da autenticação e do painel admin — Etapa 07; por ora a flag `featured` é definida no array).
- Qual será o contrato exato da API de publicações (campos, paginação, formato de data)? (Etapa 04/05.)
- As imagens terão webp/AVIF gerados pelo image-service? (Etapa 06.)
