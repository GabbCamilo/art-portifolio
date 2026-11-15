# Spec Delta

## Purpose

Especificar a modelagem do banco de dados MySQL para o Art Portfolio, cobrindo tabelas de perfil de artista, publicações e índices.

## ADDED Requirements

### Requirement: Schema inicial do banco
O sistema SHALL ter um schema MySQL com banco `art_portfolio`, tabelas `artist_profile` e `publicações`.

#### Scenario: Criação do banco e tabelas
- **WHEN** o script `database/schema.sql` é executado no MySQL 8
- **THEN** o banco `art_portfolio` é criado com charset `utf8mb4` e collation `utf8mb4_unicode_ci`
- **THEN** a tabela `artist_profile` é criada com coluna `name`, `location`, `medium`, `website`, `store`, `patreon`
- **THEN** a tabela `publicações` é criada com colunas `title`, `description`, `complementary`, `published_at`, `featured`, `file_name`, `file_size`, `width`, `height`

### Requirement: Restrição de unicidade
O sistema SHALL garantir unicidade da `file_name` nas publicações para evitar duplicação de arquivos.

#### Scenario: Conflito de nome de arquivo
- **WHEN** uma nova publicação tenta inserir um `file_name` já existente
- **THEN** a operação de inserção falha com violação de unicidade

### Requirement: Índice de data e destaque
O sistema SHALL ter índices em `featured` e `published_at` para otimizar consultas de publicação.

#### Scenario: Consulta por destaque
- **WHEN** a aplicação consulta publicações com `featured = 1`
- **THEN** o índice `idx_publications_featured` é utilizado

#### Scenario: Consulta por data
- **WHEN** a aplicação consulta publicações ordenadas por `published_at` decrescente
- **THEN** o índice `idx_publications_published_at` é utilizado

### Requirement: Restrição de perfil único
O sistema SHALL garantir que exista apenas uma linha em `artist_profile` (id = 1).

#### Scenario: Tentativa de inserir perfil com id diferente
- **WHEN** uma inserção em `artist_profile` usa id diferente de 1
- **THEN** a operação falha com violação da restrição `chk_artist_profile_single_row`
