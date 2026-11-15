# Proposal — frontend-remodel-gallery-lightbox-admin

## Why

O frontend do Art Portfolio estava como página com HTML estático e conteúdo hardcoded, sem a identidade visual completa e sem a experiência de galeria progressiva, lightbox e apresentação editorial das referências. A remodelagem consolida tudo em uma única página pública (comissões e contato como seções), deixa o admin separado e prepara a renderização para consumo futuro da API sem reescrever a interface.

## What Changes

- `index.html`: reestruturado em áreas — apresentação principal (obra principal + split editorial + detalhes do artista), galeria feed de trabalhos, seções Comissões e Contato, markup do lightbox (overlay, imagem, setas, fechar, indicadores) e link para `/admin`.
- `style.css`: tokens oficiais preservados (#F8EEEE, #EAD6D5, #292323, #FFFFFF; Space Grotesk + Inter); tokens de espaçamento, raios, sombras e breakpoints; styles de apresentação, galeria, legendas translúcidas (caption com file size e file name), lightbox e indicadores em esfera; responsividade mobile-first e `prefers-reduced-motion`.
- `main.js`: dados simulados com metadados de imagem (nome, tamanho, largura, altura); renderização da apresentação; galeria progressiva com IntersectionObserver e lotes de 6 e 4 itens; lightbox com foco, scroll-lock, teclado (Escape/setas), clique para fechar e janela de indicadores ±3.
- Novos arquivos: `admin/login.html`, `admin/dashboard.html`, `css/admin.css`, `js/admin.js` — estrutura visual do admin apenas, com zonas editáveis translúcidas, upload simulado e sem armazenamento real.

## Capabilities

### New Capabilities

- `single-page-presentation`: apresentação editorial da página única, legendas translúcidas, seções Comissões e Contato.
- `progressive-gallery`: feed cronológico com carregamento progressivo por lotes, IntersectionObserver, lugar reserved para imagem e metadados simulados.
- `lightbox-viewer`: visualização individual com overlay, controles laterais, fechamento, navegação por teclado, indicadores de posição e ausência de compartilhamento social.
- `admin-interface`: estrutura visual do painel administrativo (login e dashboard), zonas editáveis translúcidas e upload simulado sem persistência.

### Modified Capabilities

- (vazio — primeira especificação completa dessas capacidades no repositório)

## Impact

- Arquivos criados: admin/, css/admin.css, js/admin.js.
- Arquivos modificados: frontend/index.html, frontend/css/style.css, frontend/js/main.js, README.md, docs/ETAPA-02-FRONTEND.md.
- Sem impacto em backend/, database/, image-service/, storage/ (backend ainda não desenvolvido).
- Dependências novas: nenhuma; fontes via Google Fonts com fallback de sistema; imagens simuladas em SVG inline via data: URI.
