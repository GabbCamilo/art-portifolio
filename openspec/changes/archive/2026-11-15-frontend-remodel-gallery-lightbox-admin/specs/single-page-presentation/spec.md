# Spec Delta

## Purpose

Definir a apresentação editorial da página única do Art Portfolio: obra principal em destaque, composição secundária com imagem e detalhes do artista, legendas translúcidas e seções Comissões e Contato, com dados preparados para carregamento futuro pelo backend.

## ADDED Requirements

### Requirement: Obra principal destacada
O sistema SHALL exibir exatamente uma obra principal selecionada manualmente pelo proprietário, com imagem, título, descrição e metadados (tamanho do arquivo e nome do arquivo) em legenda translúcida.

#### Scenario: Obra principal renderizada com legenda
- **WHEN** a página carrega com dados da obra principal
- **THEN** a imagem ocupa o espaço com proporção preservada e a legenda mostra o nome do arquivo e o tamanho da imagem

### Requirement: Composição secundária dividida
O sistema SHALL dividir a área secundária em duas metades: aproximadamente metade com imagem e metade com informações textuais (Artista, Localização, Técnica/Mídia, Website), reorganizadas verticalmente em telas pequenas.

#### Scenario: Layout dividido em desktop e empilhado em mobile
- **WHEN** a viewport tem 1024 px de largura
- **THEN** a imagem secundária e os detalhes textuais ficam lado a lado em colunas iguais

#### Scenario: Reorganização vertical em mobile
- **WHEN** a viewport tem 360 px de largura
- **THEN** a imagem secundária vem primeiro e os detalhes textuais vem abaixo, empilhados verticalmente

### Requirement: Legenda translúcida sob cada imagem
O sistema SHALL apresentar, sob cada imagem, uma legenda translúcida com espaço para o tamanho da imagem e o nome do arquivo subido.

#### Scenario: Legenda preenchida com metadados simulados
- **WHEN** uma imagem possui arquivo `retratos-urbanos.jpg` com tamanho `2,4 MB`
- **THEN** a legenda exibe exatamente esses dois valores

### Requirement: Seções Comissões e Contato na página única
O sistema SHALL incluir as seções Comissões (preços simulados) e Contato (e-mail) na mesma página, sem navegação para páginas separadas.

#### Scenario: Seções acessíveis na página principal
- **WHEN** o usuário rola a página
- **THEN** as seções Comissões e Contato aparecem abaixo do feed e são focáveis via teclado
