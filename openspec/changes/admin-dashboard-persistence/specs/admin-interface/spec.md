# Spec Delta

## Purpose

Atualizar a capacidade da área administrativa: de estrutura visual simulada para painel com dados reais, persistência via API, tópicos editáveis e formulário modal de criação.

## MODIFIED Requirements

### Requirement: Upload simulado com validações
O sistema SHALL aceitar arrastar e soltar e seleção via explorador, com pré-visualização, indicação de formato inválido, indicação de tamanho excessivo e possibilidade de substituir a imagem, e SHALL permitir criar publicações via formulário modal no painel, com campos título, descrição, complemento, data, destaque e nome de arquivo (metadados; upload real de imagem via image-service fica para etapa seguinte).

#### Scenario: Upload com formato inválido
- **WHEN** o usuário solta um arquivo não-imagem na zona de upload
- **THEN** é exibida a mensagem de formato inválido

#### Scenario: Abertura do formulário
- **WHEN** o administrador clica em "Adicionar publicação"
- **THEN** um modal é aberto com os campos do formulário

#### Scenario: Criação persistida
- **WHEN** o formulário é submetido com dados válidos
- **THEN** o painel chama `POST /api/admin/publications` e o cartão aparece na galeria

#### Scenario: Imagem inválida no formulário
- **WHEN** o campo de arquivo recebe tipo não-imagem
- **THEN** é exibida mensagem de erro e nada é enviado

### Requirement: Controles de organização e seleção principal
O sistema SHALL permitir adicionar, remover, reordenar e selecionar uma publicação principal no painel, com reordenamento por arraste (drag & drop) persistido via API.

#### Scenario: Definir publicação principal
- **WHEN** o usuário clica em "Definir principal" em um cartão
- **THEN** aquele cartão é marcado como principal e os demais desmarcados

#### Scenario: Arrastar para reordenar
- **WHEN** o administrador arrasta um cartão e solta entre dois cartões
- **THEN** a nova ordem é enviada a `POST /api/admin/publications/reorder` e mantida após recarregar

#### Scenario: Definir principal
- **WHEN** o administrador clica em "Definir principal"
- **THEN** a publicação é marcada via API e as demais perdem o destaque

#### Scenario: Remover
- **WHEN** o administrador clica em "Remover"
- **THEN** a publicação é excluída via API e o cartão some da galeria

## ADDED Requirements

### Requirement: Detalhes editáveis do muro
O sistema SHALL permitir editar rótulos e valores dos campos fixos do Details e adicionar, editar e remover caixas de texto com título e descrição.

#### Scenario: Rótulo editável
- **WHEN** o administrador clica no rótulo de um campo fixo
- **THEN** o rótulo entra em modo de edição e aceita novo texto

#### Scenario: Caixa de texto adicionada
- **WHEN** o administrador clica em "Adicionar caixa de texto"
- **THEN** uma nova caixa vazia aparece para editar título e corpo

#### Scenario: Caixa de texto removida
- **WHEN** o administrador clica em remover uma caixa de texto
- **THEN** a caixa é excluída via API e desaparece da lista
