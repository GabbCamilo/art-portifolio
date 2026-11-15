# Spec Delta

## Purpose
Manter o carregamento progressivo por lotes, mas tornar o muro cíclico: ao esgotar a coleção, o cursor volta ao primeiro item em vez de exibir mensagem de fim.

## MODIFIED Requirements

### Requirement: Carregamento progressivo por lotes
O sistema SHALL carregar miniaturas em lotes pequenos com IntersectionObserver, sem carregar todas as imagens originais simultaneamente; ao esgotar a coleção, SHALL reiniciar o cursor para o primeiro item, mantendo o muro em ciclo contínuo.

#### Scenario: Primeiro lote exibido imediatamente
- **WHEN** a página carrega com 10 publicações
- **THEN** as primeiras 6 miniaturas são renderizadas no primeiro lote e o restante só ao rolar

#### Scenario: Reinício cíclico ao esgotar
- **WHEN** o último lote é renderizado e o sentinela volta a intersectar
- **THEN** o cursor volta ao primeiro item e novos lotes são exibidos, sem mensagem de fim

## ADDED Requirements

### Requirement: Legenda do muro apenas no hover/foco
O sistema SHALL ocultar a legenda de nome de arquivo do muro por padrão e exibi-la apenas durante o hover ou o foco do item.

#### Scenario: Legenda oculta por padrão
- **WHEN** o item do muro não está em hover nem em foco
- **THEN** a legenda de nome de arquivo permanece invisível

#### Scenario: Legenda visível no hover/foco
- **WHEN** o cursor está sobre o item ou o item recebe foco pelo teclado
- **THEN** a legenda de nome de arquivo fica visível
