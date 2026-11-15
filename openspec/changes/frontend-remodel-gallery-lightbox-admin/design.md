# Design

## Context

O `index.html` anterior continha conteúdo hardcoded e o `style.css` possuía apenas variáveis e reset básico; o `main.js` já implementava a lógica do feed híbrido da Etapa 02 anterior. A remodelagem substitui essa entrega por uma página única com apresentação editorial, galeria progressiva, lightbox e admin visual, mantendo os tokens de identidade visual oficiais e sem frameworks. Veja `proposal.md` para a motivação.

Restrições:
- Sem alterar `backend/`, `database/`, `image-service/` ou `storage/` nesta etapa.
- Sem cadastro público, autenticação real ou persistência de dados.
- `index.html` é a única página pública; comissões e contato são seções, não páginas separadas.

## Goals / Non-Goals

**Goals:**
- Apresentação editorial baseada na Referência 03 com obra principal e split secundário.
- Galeria progressiva baseada na Referência 02 com proporções preservadas.
- Lightbox baseado na Referência 01 com indicadores ±3 e foco gerenciado.
- Admin visual com zonas editáveis e upload simulado.
- Dados simulados substituíveis por `fetch()` sem alterar a renderização.

**Non-Goals:**
- Páginas `commissions.html` e `contact.html` separadas (removidas por decisão do usuário).
- Autenticação real, banco de dados, processamento de imagens ou armazenamento definitivo.
- Compartilhamento social no lightbox.

## Decisions

1. **Página única** — comissões e contato como seções no `index.html`; admin em pasta separada. Alternativa: páginas separadas — rejeitada por decisão do usuário.
2. **Tokens CSS centralizados e `@import` de fontes** — mantém o HTML intocado e a identidade visual coerente; fallback de sistema para uso offline.
3. **`aspect-ratio` por obra** em cada `.media-frame` — preserva proporções originais sem distorção. Alternativa: altura fixa — rejeitada porque distorceria obras.
4. **Sentinela + IntersectionObserver para lotes de 4 miniaturas** — carregamento progressivo real sem baixar tudo de uma vez.
5. **SVGs `data:` URI com nome do arquivo no texto** — placeholders visuais de proporções reais sem depender de obras externas.
6. **Foco preso e restaurado no lightbox** — acessibilidade de teclado e leitor de tela.

### Redesenho editorial (header/hero/muro)

7. **Header com faixa de destaque + fade** — a obra principal ocupa o header em container de 960 px; um gradiente de `#F8EEEE` na base dissolve a imagem no fundo. Alternativa rejeitada: destaque solto na seção de apresentação, que separava a obra do topo da página.
8. **Hero 50/50** — imagem secundária em proporção fixa (4/5 desktop, 1/1 mobile) e caixa textual sobre o fundo da página (sem superfície própria), empilhadas no mobile. Alternativa rejeitada: split com imagem em proporção natural, que quebraria a simetria editorial.
9. **Muro de fotos em fluxo vertical** — coluna única de imagens grandes com altura uniforme (`aspect-ratio: 2/1` desktop, `4/3` mobile) e `object-fit: cover`, sem distorção. Alternativa rejeitada: grade `auto-fill`/`minmax` de miniaturas pequenas, que fragmentava a leitura das obras.
10. **Barra de nome na base do muro** — o nome do arquivo aparece sempre em uma barra translúcida na base de cada imagem, texto centralizado, com o mesmo fundo do flash de hover (`--wall-flash-bg`), sem contorno de borda. A imagem de destaque do header permanece sem legenda. Alternativa rejeitada: pílula central no meio da imagem, que sobrepunha o nome da obra.
11. **Destaque fora do muro** — `initProgressiveFeed()` usa `getChronological()`; o destaque permanece no header/hero e não se repete na grade.

## Risks / Trade-offs

- [Fontes externas] `@import` exige internet; em uso offline cai para sans-serif genérico. → Mitigação: stacks de fallback em `:root`.
- [Datas simuladas date-only] `new Date('YYYY-MM-DD')` pode deslocar o dia em fusos negativos. → Mitigação: documentado; tratado com datas completas na Etapa 05.
- [Upload simulado] o admin apenas pré-visualiza e não armazena. → Mitigação: documentado como "estrutura visual apenas".
- [Sem imagens reais] proporções e legendas são simuladas. → Mitigação: placeholders com dimensões exatas e nomes de arquivo simulados.

## Migration Plan

1. Manter a change anterior (`frontend-css-js-feed-hibrido`) como referência do feed híbrido inicial.
2. Etapa 05: trocar o array simulado por `fetch()` ao endpoint de publicações; manter `initFeed` e os builders de cartão.
3. Etapa 06: popular campos `image` reais e variantes de resolução no lightbox e no feed.
4. Etapa 07: implementar autenticação real no `/admin/login.html` e persistência no dashboard.
5. Rollback: remover o `<script src="js/main.js">` restaura o HTML estático anterior, pois o HTML foi reescrito totalmente (não há versão anterior a recuperar além do backup em Git).

## Open Questions

- Contrato exato da API de publicações (paginação, formato de data, variantes de imagem)? (Etapa 04/05)
- Quem seleciona a publicação principal manualmente? (depende do painel admin com auth — Etapa 07)
- Formatos de imagem gerados pelo image-service (WebP/AVIF)? (Etapa 06)
