# Spec Delta

## Purpose

Especificar a criação do usuário de aplicação do banco de dados com permissões CRUD.

## ADDED Requirements

### Requirement: Usuário de aplicação com permissões CRUD
O sistema SHALL criar um usuário de aplicação `art_portfolio_app` com permissões de leitura, inserção, atualização e exclusão no banco `art_portfolio`.

#### Scenario: Criação do usuário com permissões
- **WHEN** o script de criação do usuário é executado
- **THEN** o usuário `art_portfolio_app` existe no MySQL 8
- **THEN** o usuário possui SELECT, INSERT, UPDATE, DELETE no banco `art_portfolio`
- **THEN** o usuário NÃO possui permissões no banco `mysql` ou `information_schema`

#### Scenario: Conexão da aplicação com o usuário
- **WHEN** a aplicação backend tenta conectar com o usuário `art_portfolio_app`
- **THEN** a autenticação é aceita
- **THEN** as operações de CRUD são autorizadas

### Requirement: Senha não versionada
O sistema SHALL NÃO versionar o arquivo `.env` contendo a senha do usuário de aplicação.

#### Scenario: Verificação de credenciais no repositório
- **WHEN** o arquivo `.env` contém credenciais reais
- **THEN** o arquivo `.env` permanece excluído do versionamento (via `.gitignore`)
- **THEN** apenas o arquivo `.env.example` é versionado
