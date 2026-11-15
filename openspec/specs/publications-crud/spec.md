# publications-crud Specification

## Purpose
Especificar os endpoints administrativos de CRUD de publicações protegidos por token.

## Requirements

### Requirement: Autenticação por token
O sistema SHALL exigir header `Authorization: Bearer <ADMIN_TOKEN>` em todas as rotas de escrita, retornando 401 sem token válido.

#### Scenario: Requisição sem token
- **WHEN** o cliente faz `POST /api/admin/publications` sem header Authorization
- **THEN** a resposta é 401

#### Scenario: Requisição com token válido
- **WHEN** o cliente faz `POST /api/admin/publications` com `Authorization: Bearer <token correto>`
- **THEN** a requisição é autorizada

### Requirement: Criar publicação
O sistema SHALL expor `POST /api/admin/publications` criando uma publicação com campos obrigatórios `title`, `description`, `complementary`, `published_at`, `featured`, `file_name`, `file_size`, `width`, `height`.

#### Scenario: Corpo válido
- **WHEN** o cliente envia corpo JSON válido com todos os campos obrigatórios
- **THEN** a resposta é 201 com a publicação criada

#### Scenario: Corpo inválido
- **WHEN** o cliente envia corpo sem `title` ou com `width` negativo
- **THEN** a resposta é 400 com mensagem de erro clara

### Requirement: Atualizar publicação
O sistema SHALL expor `PUT /api/admin/publications/:id` atualizando os campos informados de uma publicação existente.

#### Scenario: ID existente
- **WHEN** o cliente faz `PUT /api/admin/publications/2` com `{ "title": "Novo título" }`
- **THEN** a resposta é 200 com a publicação atualizada

#### Scenario: ID inexistente
- **WHEN** o cliente faz `PUT /api/admin/publications/999`
- **THEN** a resposta é 404

### Requirement: Remover publicação
O sistema SHALL expor `DELETE /api/admin/publications/:id` removendo uma publicação existente.

#### Scenario: ID existente
- **WHEN** o cliente faz `DELETE /api/admin/publications/2`
- **THEN** a resposta é 204 (sem conteúdo)

#### Scenario: ID inexistente
- **WHEN** o cliente faz `DELETE /api/admin/publications/999`
- **THEN** a resposta é 404

### Requirement: Não versionar credenciais
O sistema SHALL NÃO versionar `.env` com `ADMIN_TOKEN` ou senhas de banco.

#### Scenario: Verificação no repositório
- **WHEN** o commit é criado
- **THEN** `backend/.env` está excluído pelo `.gitignore`; apenas `backend/.env.example` é versionado
