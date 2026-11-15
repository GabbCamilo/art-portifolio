# Spec Delta

## Purpose

Especificar o endpoint público de perfil do artista servido pela API Express.

## ADDED Requirements

### Requirement: Endpoint de perfil do artista
O sistema SHALL expor `GET /api/artist` retornando o perfil único do artista armazenado em `artist_profile`.

#### Scenario: Perfil retornado com sucesso
- **WHEN** o cliente faz `GET /api/artist`
- **THEN** a resposta é 200 com JSON contendo `name`, `location`, `medium`, `website`, `store`, `patreon`

#### Scenario: Perfil sempre existe
- **WHEN** a tabela `artist_profile` contém a linha única id=1
- **THEN** a resposta inclui os campos dessa linha

### Requirement: Sem autenticação
O sistema SHALL permitir acesso público a `GET /api/artist` sem token.

#### Scenario: Acesso sem Authorization header
- **WHEN** a requisição não contém header `Authorization`
- **THEN** a resposta é 200 (não 401)