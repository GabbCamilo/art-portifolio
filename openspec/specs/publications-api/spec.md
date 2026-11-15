# publications-api Specification

## Purpose
Especificar os endpoints públicos de leitura de publicações da API Express.

## Requirements

### Requirement: Listagem paginada
O sistema SHALL expor `GET /api/publications` retornando `{ items, total, limit, offset }` com paginação via query params `limit` (padrão 6) e `offset` (padrão 0).

#### Scenario: Primeiro lote
- **WHEN** o cliente faz `GET /api/publications?limit=6`
- **THEN** a resposta contém 6 itens e `total` igual ao número total de publicações

### Requirement: Filtro de destaque
O sistema SHALL aceitar `?featured=true` para retornar somente a publicação principal e `?featured=false` para excluí-la.

#### Scenario: Somente destaque
- **WHEN** o cliente faz `GET /api/publications?featured=true`
- **THEN** a resposta contém exatamente 1 item com `featured: true`

#### Scenario: Feed exclui destaque
- **WHEN** o cliente faz `GET /api/publications?featured=false&limit=4&offset=4`
- **THEN** a resposta contém 4 itens, nenhum com `featured: true`

### Requirement: Ordenação cronológica decrescente
O sistema SHALL ordenar por `published_at DESC, id DESC`, recentes primeiro.

#### Scenario: Ordenação
- **WHEN** o cliente faz `GET /api/publications?featured=false`
- **THEN** os itens aparecem em ordem decrescente de data

### Requirement: Obra individual
O sistema SHALL expor `GET /api/publications/:id` retornando a publicação com o id informado.

#### Scenario: ID existente
- **WHEN** o cliente faz `GET /api/publications/2`
- **THEN** a resposta é 200 com o JSON da publicação

#### Scenario: ID inexistente
- **WHEN** o cliente faz `GET /api/publications/999`
- **THEN** a resposta é 404 com `{ "error": "..." }`

### Requirement: Contrato de dados do frontend
O sistema SHALL retornar cada publicação no formato `{ id, title, description, complementary, date, featured, image: { file_name, file_size, width, height, tone } }`, sendo `id` no formato `pub-XX` e `tone = id % 5`.

#### Scenario: Formato dos campos
- **WHEN** o cliente faz `GET /api/publications?limit=1`
- **THEN** cada item possui `id` string iniciando com `pub-`, `featured` boolean e `image` com `file_name`, `file_size`, `width`, `height`, `tone`
