# Spec Delta

## Purpose

Especificar os endpoints administrativos de CRUD de publicações protegidos por sessão, com exclusividade de destaque e reordenamento persistido.

## MODIFIED Requirements

### Requirement: Autenticação por token
O sistema SHALL exigir header `Authorization: Bearer <token>` válido contra sessão ativa no banco em todas as rotas de escrita, retornando 401 sem token válido.

#### Scenario: Requisição sem token
- **WHEN** o cliente faz `POST /api/admin/publications` sem header Authorization
- **THEN** a resposta é 401

#### Scenario: Requisição com token válido
- **WHEN** o cliente faz `POST /api/admin/publications` com token de sessão ativa
- **THEN** a requisição é autorizada

### Requirement: Criar publicação
O sistema SHALL expor `POST /api/admin/publications` criando uma publicação com campos obrigatórios `title`, `description`, `complementary`, `published_at`, `featured`, `file_name`, `file_size`, `width`, `height`, atribuindo `position` = maior position existente + 1.

#### Scenario: Corpo válido
- **WHEN** o cliente envia corpo JSON válido com todos os campos obrigatórios
- **THEN** a resposta é 201 com a publicação criada (incluindo `position`)

#### Scenario: Corpo inválido
- **WHEN** o cliente envia corpo sem `title` ou com `width` negativo
- **THEN** a resposta é 400 com mensagem de erro clara

### Requirement: Atualizar publicação
O sistema SHALL expor `PUT /api/admin/publications/:id` atualizando os campos informados; ao marcar `featured: true`, SHALL desmarcar as demais publicações.

#### Scenario: ID existente
- **WHEN** o cliente faz `PUT /api/admin/publications/2` com `{ "title": "Novo título" }`
- **THEN** a resposta é 200 com a publicação atualizada

#### Scenario: ID inexistente
- **WHEN** o cliente faz `PUT /api/admin/publications/999`
- **THEN** a resposta é 404

#### Scenario: Destaque exclusivo
- **WHEN** o cliente faz `PUT` com `featured: true` em uma publicação
- **THEN** as demais publicações ficam com `featured: false`
