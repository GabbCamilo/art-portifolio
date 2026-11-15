# Spec Delta

## Purpose

Define o comportamento do feed de publicações do Art Portfolio: uma publicação principal em destaque, selecionável manualmente, e uma listagem cronológica abaixo que nunca repete o destaque.

## ADDED Requirements

### Requirement: Destaque único e manual
O sistema SHALL renderizar exatamente uma publicação marcada como destaque (`featured: true`) na seção `#featured`, preservando seu wrapper `.featured-post`.

#### Scenario: Dados contêm um destaque
- **WHEN** o conjunto de publicações possui um item com `featured: true`
- **THEN** a seção `#featured` exibe somente esse item, com título, descrição e data formatada

### Requirement: Exclusão do destaque no cronológico
O sistema SHALL excluir a publicação destacada da listagem cronológica em `#feed`, garantindo que ela não apareça duplicada abaixo do destaque.

#### Scenario: Listagem cronológica
- **WHEN** o feed é renderizado
- **THEN** nenhum cartão em `#feed` possui o mesmo `id` da publicação destacada

### Requirement: Ordenação cronológica decrescente
O sistema SHALL ordenar as publicações restantes por data decrescente (mais recentes primeiro).

#### Scenario: Ordenação por data ISO
- **WHEN** as publicações possuem datas `2026-04-08`, `2026-03-22`, `2026-02-18` e `2026-02-05`
- **THEN** o feed exibe nessa ordem, da mais recente para a mais antiga

### Requirement: Formatação de data em português
O sistema SHALL exibir a data de cada publicação por extenso em português brasileiro no cartão.

#### Scenario: Data por extenso
- **WHEN** uma publicação possui data `2026-05-12`
- **THEN** o cartão exibe a data formatada com mês por extenso em pt-BR (ex.: "11 de maio de 2026" em fuso UTC-3)

### Requirement: Cartões acessíveis
O sistema SHALL renderizar cada publicação como `<article class="post">` com `tabindex="0"`, `role="button"` e `aria-label` contendo título e descrição.

#### Scenario: Navegação por teclado no feed
- **WHEN** o usuário pressiona Tab dentro do feed
- **THEN** cada cartão é focável e anuncia seu título e descrição para leitores de tela

### Requirement: Fonte de dados substituível
O sistema SHALL manter as publicações em um array isolado, permitindo substituição por resposta de API (`fetch()`) sem alterar as funções de renderização.

#### Scenario: Substituição por dados de API
- **WHEN** o array mock for trocado por dados JSON de mesmo formato vindos do backend
- **THEN** a renderização do destaque e do cronológico funciona sem alterar as funções de renderização

### Requirement: Container dinâmico do feed
O sistema SHALL criar o container `.post-grid` dentro de `#feed` quando ele não existir no HTML estático.

#### Scenario: HTML sem container de grid
- **WHEN** o elemento `#feed` não contém `.post-grid`
- **THEN** o JavaScript cria o container e o popula com os cartões cronológicos
