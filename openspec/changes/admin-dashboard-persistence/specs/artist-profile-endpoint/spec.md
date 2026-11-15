# Spec Delta

## Purpose

Especificar o endpoint público de perfil do artista servido pela API Express, agora com tópicos customizados, e a atualização administrativa do perfil.

## MODIFIED Requirements

### Requirement: Endpoint de perfil do artista
O sistema SHALL expor `GET /api/artist` retornando o perfil único do artista armazenado em `artist_profile` mais a lista `topics` de `profile_topics` ordenada por `position`.

#### Scenario: Perfil retornado com sucesso
- **WHEN** o cliente faz `GET /api/artist`
- **THEN** a resposta é 200 com JSON contendo `name`, `location`, `medium`, `website`, `store`, `patreon`, `labels` e `topics`

#### Scenario: Labels e topics retornados
- **WHEN** o cliente faz `GET /api/artist`
- **THEN** a resposta é 200 com `labels` (objeto) e `topics` (lista ordenada por posição)

#### Scenario: Perfil sempre existe
- **WHEN** a tabela `artist_profile` contém a linha única id=1
- **THEN** a resposta inclui os campos dessa linha

## ADDED Requirements

### Requirement: Atualização do perfil do artista
O sistema SHALL expor `PUT /api/admin/artist` (sessão ativa) atualizando os campos do perfil único.

#### Scenario: Atualização válida
- **WHEN** o cliente faz `PUT /api/admin/artist` com `{ "name": "Novo nome" }`
- **THEN** a resposta é 200 com o perfil atualizado

#### Scenario: Labels inválidas
- **WHEN** o cliente envia `labels` que não é objeto
- **THEN** a resposta é 400
