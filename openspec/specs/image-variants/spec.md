# image-variants Specification

## Purpose
Especificar o processamento local de imagens com Pillow: variantes de resolução, preservação de proporção e encode WebP.

## Requirements

### Requirement: Variantes por largura-alvo
O sistema SHALL gerar variantes `thumbnail` (400 px), `medium` (800 px) e `full` (1600 px) para cada imagem de entrada.

#### Scenario: Imagem maior que a variante
- **WHEN** uma imagem 3200x2400 é processada
- **THEN** `full` resulta em 1600x1200, `medium` em 800x600 e `thumbnail` em 400x300

#### Scenario: Imagem menor que a variante
- **WHEN** uma imagem 1000x1000 é processada
- **THEN** `full` mantém 1000x1000 (nunca amplia)

### Requirement: Proporção preservada
O sistema SHALL preservar a razão de aspecto original em todas as variantes, sem distorção.

#### Scenario: Razão de aspecto
- **WHEN** a entrada tem razão 16:9
- **THEN** toda variante mantém razão 16:9 com tolerância de arredondamento de 1 px

### Requirement: Encode WebP sem sobrescrever original
O sistema SHALL codificar variantes em WebP lossy qualidade 80 em `storage/processed/`, mantendo o original intacto em `storage/images/`.

#### Scenario: Escrita separada
- **WHEN** o processamento conclui
- **THEN** `storage/processed/` contém `{stem}-{variant}.webp`
- **THEN** `storage/images/` mantém o arquivo original inalterado

### Requirement: Formato de file_size pt-BR
O sistema SHALL reportar `file_size` em formato pt-BR (`X,X MB` ou `X,X KB`) compatível com o seed e o frontend.

#### Scenario: Tamanho formatado
- **WHEN** uma variante ocupa 1234567 bytes
- **THEN** `file_size` é `1,2 MB`
