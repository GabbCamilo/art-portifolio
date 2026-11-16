# publications-crud Specification

## Purpose
Especificar os endpoints administrativos de CRUD de publicações protegidos por token.

## Requirements

### Requirement: Autenticação por token
O sistema SHALL exigir header `Authorization: Bearer <token>` válido contra sessão ativa no banco em todas as rotas de escrita, retornando 401 sem token válido.

#### Scenario: Requisição sem token
- **WHEN** o cliente faz `POST /api/admin/publications` sem header Authorization
- **THEN** a resposta é 401

#### Scenario: Requisição com token válido
- **WHEN** o cliente faz `POST /api/admin/publications` com token de sessão ativa
- **THEN** a requisição é autorizada

### Requirement: Criar publicação
O sistema SHALL expor `POST /api/admin/publications` criando uma publicação com `featured`, `file_name`, `file_size`, `width` e `height` (e `description`/`complementary` opcionais).

#### Scenario: Corpo válido
- **WHEN** o cliente envia corpo JSON válido com os campos obrigatórios
- **THEN** a resposta é 201 com a publicação criada

#### Scenario: Corpo inválido
- **WHEN** o cliente envia corpo sem `featured` ou com `width` negativo
- **THEN** a resposta é 400 com mensagem de erro clara

### Requirement: Atualizar publicação
O sistema SHALL expor `PUT /api/admin/publications/:id` atualizando `description` e `complementary` informados; ao marcar `featured: true`, SHALL desmarcar as demais publicações.

#### Scenario: ID existente
- **WHEN** o cliente faz `PUT /api/admin/publications/2` com `{ "description": "Novo texto" }`
- **THEN** a resposta é 200 com a publicação atualizada

#### Scenario: ID inexistente
- **WHEN** o cliente faz `PUT /api/admin/publications/999`
- **THEN** a resposta é 404

#### Scenario: Destaque exclusivo
- **WHEN** o cliente faz `PUT` com `featured: true` em uma publicação
- **THEN** as demais publicações ficam com `featured: false`

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

### Requirement: Remoção com arquivo
O sistema SHALL excluir o arquivo armazenado e suas variantes quando uma publicação é removida.

#### Scenario: Remover apaga arquivo
- **WHEN** o cliente faz `DELETE /api/admin/publications/:id` de publicação com arquivo armazenado
- **THEN** a resposta é 204 e o arquivo não existe mais no armazenamento
