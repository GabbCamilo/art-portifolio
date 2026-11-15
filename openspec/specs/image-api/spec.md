# image-api Specification

## Purpose
Especificar o processamento de imagens do Art Portfolio: variantes de resolução com proporção preservada, encode WebP e API FastAPI.

## Requirements

### Requirement: Variantes de resolução
O sistema SHALL gerar, para cada imagem de entrada, três variantes com larguras-alvo 400 px (`thumbnail`), 800 px (`medium`) e 1600 px (`full`), preservando a proporção original e nunca ampliando a imagem.

#### Scenario: Imagem maior que 1600 px
- **WHEN** uma imagem 3200x2400 é processada
- **THEN** a variante `full` tem largura 1600 e altura 1200 (proporção 4:3 preservada)
- **THEN** a variante `medium` tem largura 800 e altura 600
- **THEN** a variante `thumbnail` tem largura 400 e altura 300

#### Scenario: Imagem menor que a variante
- **WHEN** uma imagem 1000x1000 é processada
- **THEN** a variante `full` mantém 1000x1000 (nunca amplia)

### Requirement: Proporção preservada
O sistema SHALL preservar a razão de aspecto original em todas as variantes (sem distorção).

#### Scenario: Razão de aspecto
- **WHEN** a entrada tem razão 16:9
- **THEN** toda variante mantém razão 16:9 (margem de arredondamento de 1 px)

### Requirement: Encode WebP
O sistema SHALL codificar variantes em WebP lossy com qualidade 80, sem sobrescrever o arquivo original.

#### Scenario: Escrita em diretório separado
- **WHEN** o original é salvo em `storage/images/`
- **THEN** as variantes são salvas em `storage/processed/{stem}-{variant}.webp`
- **THEN** o arquivo original permanece inalterado

### Requirement: Metadados compatíveis com o banco
O sistema SHALL retornar metadados no formato consumido por `publications`: `file_name`, `file_size` (formato pt-BR `X,X MB`), `width`, `height`.

#### Scenario: Resposta do processamento
- **WHEN** `POST /process` recebe uma imagem válida
- **THEN** a resposta contém `original` e `variants` com os campos acima

### Requirement: Validação de upload
O sistema SHALL aceitar apenas `image/*` até 10 MB, rejeitando com 400 (tipo inválido) ou 413 (tamanho excessivo).

#### Scenario: Tipo inválido
- **WHEN** o upload é `text/plain`
- **THEN** a resposta é 400 com mensagem clara

#### Scenario: Tamanho excessivo
- **WHEN** o upload excede 10 MB
- **THEN** a resposta é 413 com mensagem clara

### Requirement: Healthcheck
O sistema SHALL expor `GET /health` retornando 200 com status do serviço.

#### Scenario: Servidor ativo
- **WHEN** o cliente faz `GET /health`
- **THEN** a resposta é 200 com JSON contendo `status: "ok"`
