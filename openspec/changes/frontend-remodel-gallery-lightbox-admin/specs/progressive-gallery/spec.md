# Spec Delta

## Purpose

Definir o feed de trabalhos da página principal: galeria cronológica contínua com carregamento progressivo de imagens, proporções originais preservadas e publicação principal não duplicada.

## ADDED Requirements

### Requirement: Feed cronológico decrescente
O sistema SHALL listar as publicações ordenadas por data decrescente, com a publicação mais recente primeiro.

#### Scenario: Ordenação por data
- **WHEN** as publicações possuem datas de 2026-05-12, 2026-04-08 e 2026-03-22
- **THEN** o feed exibe nessa ordem: 2026-05-12, 2026-04-08, 2026-03-22

### Requirement: Destaque excluído do feed cronológico
O sistema SHALL nunca repetir a publicação em destaque na listagem cronológica abaixo do destaque.

#### Scenario: Destaque não aparece no feed
- **WHEN** a publicação `featured-01` está marcada como destaque
- **THEN** nenhum cartão do feed cronológico possui o id `featured-01`

### Requirement: Carregamento progressivo por lotes
O sistema SHALL carregar miniaturas em lotes pequenos com IntersectionObserver, sem carregar todas as imagens originais simultaneamente.

#### Scenario: Primeiro lote exibido imediatamente
- **WHEN** a página carrega com 10 publicações
- **THEN** as primeiras 6 miniaturas são renderizadas no primeiro lote e o restante só ao rolar

### Requirement: Proporções preservadas e dimensões explícitas
O sistema SHALL reservar espaço para cada imagem com `width`, `height` e `aspect-ratio` iguais aos da obra original, sem distorção.

#### Scenario: Espaço reservado antes da imagem carregar
- **WHEN** uma imagem de 1600 x 900 px é renderizada
- **THEN** o cartão reserva a proporção 16:9 antes da imagem estar visível

### Requirement: Placeholder durante o carregamento
O sistema SHALL mostrar uma superfície neutra no lugar da imagem enquanto esta não está carregada, evitando saltos de layout.

#### Scenario: Placeholder visível até a imagem carregar
- **WHEN** uma imagem está em estado de carregamento
- **THEN** o espaço da imagem exibe a cor de superfície secundária com o nome do arquivo em legenda
