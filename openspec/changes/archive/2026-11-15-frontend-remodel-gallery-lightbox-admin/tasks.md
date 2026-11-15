# Tasks

## 1. HTML da página única

- [x] 1.1 Reestruturar `index.html` com apresentação editorial, galeria, comissões, contato e lightbox — verificar arquivo `index.html` com seções `#presentation`, `#work`, `#commissions`, `#contact` e `.lightbox`
- [x] 1.2 Adicionar legendas translúcidas com file size e file name sob cada imagem — verificar elementos `.media-caption` com `.caption-size` e `.caption-name`
- [x] 1.3 Adicionar link `/admin/login.html` no rodapé — verificar link de Administração no `site-footer`

## 2. CSS de identidade, galeria e lightbox

- [x] 2.1 Aplicar tokens oficiais e espaçamento responsivo — verificar `:root` com cores e `--space-*`
- [x] 2.2 Implementar apresentação editorial (obra principal + split secundário + details) — verificar `.presentation-split` e `.details`
- [x] 2.3 Implementar galeria com `aspect-ratio`, `object-fit: cover` e legendas — verificar `.post .media-frame` com `aspect-ratio` definido por JS
- [x] 2.4 Implementar lightbox com overlay, setas, fechar, teclado e indicadores ±3 — verificar `.lightbox`, `.lightbox-indicators` e `.indicator.current`
- [x] 2.5 Implementar `prefers-reduced-motion` e `:focus-visible` — verificar media query e estados de foco

## 3. JavaScript de dados, galeria progressiva e lightbox

- [x] 3.1 Dados simulados com metadados de imagem (nome, tamanho, largura, altura) — verificar array `publications` com 10 itens
- [x] 3.2 Renderização da apresentação principal — verificar `renderPresentation()` preenchendo artista, localização, mídia, website
- [x] 3.3 Carregamento progressivo com lote inicial de 6 e lotes de 4 — verificar `renderNextBatch()` e `initProgressiveFeed()`
- [x] 3.4 Lightbox aberto em índice correto da coleção — verificar `openLightbox(index)` e `state.lightboxIndex`
- [x] 3.5 Indicadores de posição com janela fixa de 5 unidades e pontas divididas em translúcido — verificar `computeIndicatorWindow` com `INDICATOR_COUNT` e `renderIndicators()`
- [x] 3.6 Fechamento por Escape e setas de teclado; navegação por zonas de clique (25% anterior / 75% seguinte) — verificar `onLightboxKeydown` e listener de clique em `initLightbox`
- [x] 3.7 Trava e restauração de foco — verificar `trapLightboxFocus` e `closeLightbox`

## 4. Área administrativa visual

- [x] 4.1 Criar `admin/login.html` com validação visual de campos — verificar formulário, mensagens e ausência de `localStorage`
- [x] 4.2 Criar `admin/dashboard.html` com zonas editáveis e galeria de cartões — verificar `[data-editable]` e `.admin-gallery`
- [x] 4.3 Criar `css/admin.css` com zonas editáveis translúcidas e dropzone — verificar `.edit-veil` e `.upload-message`
- [x] 4.4 Criar `js/admin.js` com upload simulado (formato/tamanho), reordenação e seleção principal — verificar `attachUpload`, controles de cartão e `is-main`

## 5. Verificação

- [x] 5.1 `node --check frontend/js/main.js` — resultado: exit code 0
- [x] 5.2 `node --check frontend/js/admin.js` — resultado: exit code 0
- [x] 5.3 Teste de lógica do feed (destaque não duplicado, ordem decrescente, janela de indicadores) — aprovado
- [x] 5.4 `openspec validate frontend-remodel-gallery-lightbox-admin` — aprovado (strict)
- [ ] 5.5 Validação visual em navegador real — pendente: sem browser headless neste ambiente

## 6. Redesenho editorial (header/hero/muro)

- [x] 6.1 Header com logo "Kenyureru" como link para `admin/login.html` — verificar `a.logo[href="admin/login.html"]` em `index.html`
- [x] 6.2 Faixa de destaque no header com imagem em container e *fade* esbranquiçado na base — verificar `.featured-band` + `.featured-fade` em `style.css`
- [x] 6.3 Hero 50/50 (imagem secundária 4/5 no desktop, 1/1 no mobile + caixa de texto sobre o fundo da página) com empilhamento no mobile — verificar `.hero-split` com `grid-template-columns: minmax(0,1fr) minmax(0,1fr)` no `@media (min-width: 900px)` e `.hero-media .media-frame` com `aspect-ratio`
- [x] 6.4 Muro de fotos em fluxo vertical de coluna única, imagens grandes com altura uniforme (`aspect-ratio: 2/1` desktop, `4/3` mobile) — verificar `.wall { grid-template-columns: 1fr }` e `.wall-item`
- [x] 6.5 Imagem de destaque do header sem tooltip/legenda — verificar ausência de `.media-caption` em `.featured-artwork` e ausência de `#featured-name` em `main.js`
- [x] 6.6 Barra de nome do arquivo na base das imagens do muro, texto centralizado, mesmo fundo do flash de hover (`--wall-flash-bg`), sem contorno de borda — verificar `.wall-tooltip` e `.wall-item::after` com `background: var(--wall-flash-bg)`
- [x] 6.7 Publicação em destaque excluída do muro — verificar `state.collection = getChronological()` em `initProgressiveFeed()`
- [x] 6.8 Lightbox com setas translúcidas laterais e indicadores fixos de 5 unidades (pontas divididas em translúcido) — verificar `.lightbox-arrow` e `renderIndicators()`

## 7. Indicadores fixos de 5 unidades e zonas de clique (ajuste do lightbox)

- [x] 7.1 Fileira fixa de 5 indicadores centralizada na obra atual, sem crescimento/encolhimento por posição — verificar INDICATOR_COUNT e computeIndicatorWindow
- [x] 7.2 Pontas da fileira com círculo dividido ao meio em translúcido enquanto houver obras além daquele lado; na ponta real da coleção o círculo respectivo fica destacado — verificar classes .half e .half-end em renderIndicators()
- [x] 7.3 Zonas de clique no estado de lightbox: 25% esquerdo = obra anterior, 75% restante = obra seguinte, dispensando as setas — verificar PREV_CLICK_ZONE_RATIO e listener em initLightbox

## Workflow follow-up

- Arquivar a change após revisão (`openspec archive frontend-remodel-gallery-lightbox-admin`).
- Etapa 05: substituir dados simulados por `fetch()` ao backend.
- Etapa 06: integrar imagens reais e variantes de resolução.
- Etapa 07: autenticação real e persistência do admin.
