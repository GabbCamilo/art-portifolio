# Spec Delta

## Purpose

Especificar tópicos customizados (título + texto) da seção Details: CRUD administrativo e exibição pública no hero.

## ADDED Requirements

### Requirement: Armazenamento de tópicos
O sistema SHALL armazenar tópicos em `profile_topics` com `title`, `body` e `position`.

#### Scenario: Estrutura
- **WHEN** a tabela é criada
- **THEN** existem colunas id (PK auto), title, body, position, created_at, updated_at

### Requirement: CRUD admin de tópicos
O sistema SHALL expor `POST/PUT/DELETE /api/admin/topics` protegidos por sessão ativa.

#### Scenario: Criar tópico
- **WHEN** `POST /api/admin/topics` com `{title, body}`
- **THEN** a resposta é 201 com o tópico criado (id, position)

#### Scenario: Atualizar e remover
- **WHEN** `PUT /api/admin/topics/:id` altera title/body
- **THEN** a resposta é 200 com o tópico atualizado
- **WHEN** `DELETE /api/admin/topics/:id` remove tópico existente
- **THEN** a resposta é 204

### Requirement: Tópicos públicos no perfil
O sistema SHALL incluir `topics` (ordenados por position) na resposta pública de `GET /api/artist`.

#### Scenario: Exibição no hero
- **WHEN** o site público carrega `GET /api/artist`
- **THEN** o hero renderiza cada tópico com título e texto
