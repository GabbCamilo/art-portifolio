# Spec Delta

## Purpose
Ajustar a composição secundária do hero para que, em desktop, a imagem acompanhe a altura da coluna de texto.

## MODIFIED Requirements

### Requirement: Composição secundária dividida
O sistema SHALL dividir a área secundária em duas metades: aproximadamente metade com imagem e metade com informações textuais (Artista, Localização, Técnica/Mídia, Website), reorganizadas verticalmente em telas pequenas; em desktop, a imagem SHALL esticar até a altura da coluna de texto.

#### Scenario: Layout dividido em desktop e empilhado em mobile
- **WHEN** a viewport tem 1024 px de largura
- **THEN** a imagem secundária e os detalhes textuais ficam lado a lado em colunas iguais

#### Scenario: Reorganização vertical em mobile
- **WHEN** a viewport tem 360 px de largura
- **THEN** a imagem secundária vem primeiro e os detalhes textuais vem abaixo, empilhados verticalmente

#### Scenario: Imagem secundária com altura do conteúdo
- **WHEN** a viewport tem 1024 px de largura e a coluna de texto é mais alta que a imagem
- **THEN** a imagem secundária estica verticalmente até a altura da coluna de texto, sem distorção
