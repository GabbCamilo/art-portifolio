# Spec Delta

## Purpose

Aplica a identidade visual editorial minimalista do Art Portfolio (paleta oficial, tipografia, responsividade e acessibilidade) à interface pública, de forma que a arte seja a protagonista e a navegação permaneça discreta.

## ADDED Requirements

### Requirement: Paleta oficial de cores
O sistema SHALL aplicar a paleta definida pelo projeto por meio de variáveis CSS: fundo `#F8EEEE`, superfície `#EAD6D5`, texto `#292323` e branco `#FFFFFF`.

#### Scenario: Página carrega com a paleta oficial
- **WHEN** qualquer página do frontend é carregada
- **THEN** o fundo é `#F8EEEE`, cartões e divisórias usam `#EAD6D5`, texto usa `#292323` e elementos de destaque podem usar `#FFFFFF`

### Requirement: Tipografia oficial
O sistema SHALL usar Space Grotesk para títulos e Inter para textos de corpo, com fallback para sans-serif genérico quando as fontes não estiverem disponíveis.

#### Scenario: Título renderiza com Space Grotesk
- **WHEN** a página tem acesso às fontes carregadas
- **THEN** títulos (h1-h3, logo) usam Space Grotesk e textos de corpo usam Inter

#### Scenario: Fontes indisponíveis
- **WHEN** a página carrega sem acesso às fontes externas
- **THEN** o layout permanece legível usando os stacks de fallback sans-serif

### Requirement: Escala fluida de títulos
O sistema SHALL dimensionar títulos com `clamp()` para que a tipografia se adapte entre mobile e desktop sem quebra de layout.

#### Scenario: Viewport pequena
- **WHEN** a viewport tem 360px de largura
- **THEN** o h1 do hero renderiza no limite inferior da escala fluida sem transbordar

#### Scenario: Viewport grande
- **WHEN** a viewport tem 1440px de largura
- **THEN** o h1 do hero renderiza no limite superior da escala fluida

### Requirement: Layout responsivo mobile-first
O sistema SHALL adaptar header, hero, destaque e grid de publicações nos breakpoints de 900px e 640px, partindo do layout mobile.

#### Scenario: Navegação em tela pequena
- **WHEN** a viewport tem até 640px
- **THEN** o header empilha marca e navegação, o menu flexiona seus itens e o grid de publicações usa colunas mínimas de 240px

#### Scenario: Navegação em tela média
- **WHEN** a viewport tem até 900px
- **THEN** o cartão de destaque reduz seu padding e o grid ajusta o gap e a largura mínima das colunas

### Requirement: Navegação discreta com estado ativo
O sistema SHALL indicar a seção atualmente visível com classe `active` no link correspondente do menu, mantendo links inativos com opacidade reduzida.

#### Scenario: Usuário rola até o feed
- **WHEN** a seção `#feed` cruza a região de visibilidade definida pelo observer
- **THEN** o link "Work" (href `#feed`) recebe a classe `active` e os demais links perdem a classe

### Requirement: Acessibilidade de foco e movimento
O sistema SHALL expor foco visível em `:focus-visible` e SHALL desativar animações, transições e scroll suave quando a preferência do sistema for `prefers-reduced-motion: reduce`.

#### Scenario: Navegação por teclado
- **WHEN** o usuário navega com Tab
- **THEN** links, cartões e controles focáveis apresentam indicador de foco visível

#### Scenario: Usuário com movimento reduzido
- **WHEN** o sistema opera com `prefers-reduced-motion: reduce`
- **THEN** o conteúdo é exibido sem animações de reveal, com `scroll-behavior: auto` e transições de duração próxima de zero

### Requirement: Espaço reservado para a arte
O sistema SHALL reservar área de imagem (`.post-image`) com `object-fit: cover` e fundo de fallback quando a imagem ainda não estiver disponível.

#### Scenario: Publicação sem imagem
- **WHEN** uma publicação não possui imagem associada
- **THEN** o cartão mantém sua estrutura e proporção sem quebrar o layout, usando a cor de fundo como placeholder
