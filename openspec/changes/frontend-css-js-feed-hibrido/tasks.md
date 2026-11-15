# Tasks

## 1. Foundation CSS

- [x] 1.1 Expandir tokens em `:root` (espaçamento, raios, sombras, transições, breakpoints) — verificar com `openspec show frontend-visual-design` e inspeção do `style.css`
- [x] 1.2 Adicionar `@import` do Google Fonts (Inter + Space Grotesk) no topo do CSS — verificar carregamento das fontes em navegador ou inspeção da linha 5 do `style.css`
- [x] 1.3 Implementar base, reset, utilitários (`.container`, `.sr-only`) e tipografia fluida com `clamp()` — verificar ausência de margens padrão e escala responsiva dos títulos

## 2. Layout e identidade visual

- [x] 2.1 Header sticky com navegação discreta e estado `active` — verificar classe `active` no link da seção visível
- [x] 2.2 Hero editorial centralizado com tipografia fluida — verificar layout em viewports 360px e 1440px
- [x] 2.3 Seção About com largura de leitura confortável — verificar `max-width: 48rem` centralizado
- [x] 2.4 Cartão de destaque `.featured-post` com superfície e sombra — verificar isolamento visual em relação ao feed
- [x] 2.5 Grid responsivo `.post-grid` + cartões `.post` + placeholder `.post-image` — verificar grade fluida com `auto-fill/minmax`
- [x] 2.6 Footer com links sociais discretos — verificar layout centralizado e borda superior
- [x] 2.7 Breakpoints 900px/640px, `prefers-reduced-motion` e `:focus-visible` — verificar com DevTools e com ferramenta de leitura

## 3. JavaScript — feed híbrido

- [x] 3.1 Array `publications` com datas ISO e flag `featured` — verificar ordenação decrescente via `new Date(b.date) - new Date(a.date)`
- [x] 3.2 `initFeed()` renderiza destaque em `#featured` e cronológico em `#feed` excluindo o destaque — verificar com teste de sanidade: 1 destaque + 4 cronológicos, sem repetição de id
- [x] 3.3 Criação dinâmica de `.post-grid` quando ausente no HTML — verificar presença do container após execução do JS
- [x] 3.4 `createPostCardContent()` / `createPostCard()` com formatação pt-BR e atributos acessíveis — verificar `toLocaleDateString('pt-BR')`, `tabindex`, `role`, `aria-label`
- [x] 3.5 `initActiveLink()` com `IntersectionObserver` — verificar toggling da classe `active` ao rolar a página
- [x] 3.6 `initScrollReveal()` respeitando `prefers-reduced-motion` — verificar revelação suave e ausência de animação com movimento reduzido

## 4. Verificação

- [x] 4.1 Validar sintaxe do JS com `node --check frontend/js/main.js` — resultado: exit code 0
- [x] 4.2 Teste de sanidade da lógica do feed via script Node temporário — resultado: featured-01 isolado; pub-02 a pub-05 em ordem decrescente; data formatada "11 de maio de 2026"; HTML do cartão gerado corretamente
- [ ] 4.3 Validação visual em navegador real (layout, hover, focus, reduced-motion) — pendente: sem browser headless neste ambiente
- [x] 4.4 Executar `openspec validate frontend-css-js-feed-hibrido` e `openspec status --change frontend-css-js-feed-hibrido` — resultado: "Change is valid" (validação normal e strict, exit 0); status 4/4 artifacts complete

## Workflow follow-up

- Arquivar a change após revisão (`openspec archive frontend-css-js-feed-hibrido`), atualizando as specs principais.
- Etapa 05: substituir array mock por `fetch()` ao endpoint de publicações, sem alterar os card builders.
- Etapa 06: popular `image` nos dados e renderizar `<img class="post-image">`.
- Criar `commissions.html` e `contact.html` ou remover referências do menu (requer edição de HTML, fora do escopo atual).
- Resolver tratamento de timezone para datas date-only quando o backend passar datas completas.
