# lightbox-viewer Specification

## Purpose
Definir a visualização individual de uma obra (lightbox): overlay escuro, imagem centralizada, navegação anterior/próximo, fechamento, indicadores de posição e ausência de compartilhamento social.

## Requirements

### Requirement: Overlay e fechamento do lightbox
O sistema SHALL abrir uma camada sobreposta que escurece o restante da interface, com imagem centralizada e fechamento por botão, clique fora da imagem e tecla Escape.

#### Scenario: Abertura e fechamento do lightbox
- **WHEN** o usuário clica em uma publicação e depois pressiona Escape
- **THEN** o lightbox é aberto e depois fechado, restaurando o foco ao elemento original

### Requirement: Navegação entre obras do lightbox
O sistema SHALL permitir navegar entre as obras anteriores e seguintes com setas laterais e setas do teclado (seta esquerda/direita), preservando a posição na coleção.

#### Scenario: Navegação anterior e próxima
- **WHEN** o usuário está na obra 2 de 10 e pressiona a seta direita
- **THEN** o lightbox exibe a obra 3 de 10

### Requirement: Indicadores de posição em esfera
O sistema SHALL mostrar um carrossel simples de esferas inferior, destacando a esfera atual, exibindo a posição atual e até três posições anteriores e posteriores, escondendo indicadores com distância superior a três.

#### Scenario: Janela de indicadores ±3
- **WHEN** o usuário está na obra 5 de 10
- **THEN** são exibidas as esferas 2, 3, 4, 5 (atual), 6, 7 e 8

### Requirement: Acessibilidade e ausência de compartilhamento social
O sistema SHALL bloquear a rolagem de fundo durante o lightbox, controlar o foco e restaurá-lo ao fechar; não SHALL apresentar controles de compartilhamento social.

#### Scenario: Bloqueio de rolagem e sem redes sociais
- **WHEN** o lightbox está aberto
- **THEN** o fundo não rola e nenhum botão de compartilhamento social é exibido
