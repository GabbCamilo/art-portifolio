# Spec Delta

## Purpose

Especificar o endpoint público de perfil do artista, com rótulos customizáveis e imagem de perfil, e a atualização administrativa do perfil.

## MODIFIED Requirements

### Requirement: Endpoint de perfil do artista
O sistema SHALL expor `GET /api/artist` retornando o perfil único do artista armazenado em `artist_profile` com rótulos (`labels`) e imagem de perfil (`image`).

#### Scenario: Perfil retornado com sucesso
- **WHEN** o cliente faz `GET /api/artist`
- **THEN** a resposta é 200 com JSON contendo `name`, `location`, `medium`, `website`, `store`, `patreon`, `labels` e `image`

#### Scenario: Imagem do perfil retornada
- **WHEN** o administrador enviou uma imagem de perfil
- **THEN** a resposta de `GET /api/artist` inclui `image` com `file_name`, `file_size`, `width` e `height`

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
