# api-data-loading Specification

## Purpose
Especificar o carregamento de dados do frontend a partir da API REST, com paginação real e fallback simulado.

## Requirements

### Requirement: Carregamento via fetch
O sistema SHALL carregar artista, publicação em destaque e feed de publicações via `fetch()` a partir da API configurada em `API_BASE`.

#### Scenario: API disponível
- **WHEN** o frontend inicializa e a API responde
- **THEN** `state.artist` é preenchido por `GET /api/artist`
- **THEN** `state.featured` é preenchido por `GET /api/publications?featured=true`
- **THEN** `state.collection` recebe o primeiro lote de `GET /api/publications?featured=false&limit=6&offset=0`

### Requirement: Paginação real do feed
O sistema SHALL usar `limit` e `offset` nos lotes progressivos e `total` da resposta para determinar o fim do feed.

#### Scenario: Lotes seguintes
- **WHEN** o sentinela de rolagem é ativado
- **THEN** o frontend requisita `limit=4&offset=N` onde N é o total já carregado
- **THEN** quando `renderedCount >= total`, exibe "Fim das publicações."

### Requirement: Fallback simulado
O sistema SHALL usar dados simulados embutidos se a API estiver indisponível, sem quebrar a experiência.

#### Scenario: API fora do ar
- **WHEN** qualquer requisição fetch falha durante o bootstrap
- **THEN** o frontend preenche o estado com dados simulados
- **THEN** o aviso é registrado via `console.warn`
- **THEN** a página continua funcionando normalmente

### Requirement: Contrato preservado
O sistema SHALL consumir o contrato da API sem alterações de UI: `{ id, title, description, complementary, date, featured, image: { file_name, file_size, width, height, tone } }`.

#### Scenario: Formato do item
- **WHEN** a API retorna uma publicação
- **THEN** `renderFeatured`, `renderHero` e `createWallItem` operam sem mapeamento adicional

### Requirement: Destaque excluído do feed
O sistema SHALL manter a regra de que a publicação em destaque não aparece no muro cronológico.

#### Scenario Filtro da API
- **WHEN** o feed é carregado com `featured=false`
- **THEN** nenhum item do muro possui `featured: true`
