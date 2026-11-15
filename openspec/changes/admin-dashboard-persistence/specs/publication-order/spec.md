# Spec Delta

## Purpose

Especificar a ordenação persistida de publicações: coluna `position`, feed público ordenado por ela e reordenação por arraste no painel via API.

## ADDED Requirements

### Requirement: Coluna de posição
O sistema SHALL armazenar a ordem de cada publicação em `publications.position` (INT, padrão 0).

#### Scenario: Backfill
- **WHEN** a coluna é adicionada a tabelas com linhas existentes
- **THEN** cada linha recebe position 1..N segundo `published_at DESC, id DESC`

### Requirement: Feed ordenado por posição
O sistema SHALL retornar as publicações do feed público ordenadas por `position ASC`, mantendo `featured` fora da lista comum.

#### Scenario: Ordem do muro
- **WHEN** o cliente faz `GET /api/publications?featured=false`
- **THEN** os itens vêm em ordem crescente de `position`

### Requirement: Reordenar via API
O sistema SHALL aceitar `POST /api/admin/publications/reorder` com body `{ids:[db_id,...]}` para gravar a nova ordem.

#### Scenario: ids válidos
- **WHEN** o body contém array de inteiros com todos os ids existentes
- **THEN** cada publicação recebe position 1..N na ordem informada e a resposta é 204

#### Scenario: body inválido
- **WHEN** o body não é um array de inteiros
- **THEN** a resposta é 400
