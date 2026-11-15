# Spec Delta

## Purpose

Definir a estrutura visual da área administrativa (/admin): login simples, painel com zonas editáveis translúcidas, upload simulado e seleção da publicação principal, sem autenticação real nem persistência nesta etapa.

## ADDED Requirements

### Requirement: Estrutura visual de login
O sistema SHALL apresentar campos de usuário e senha, botão de acesso e mensagens de validação visual, sem armazenar credenciais.

#### Scenario: Validação de campos vazios
- **WHEN** o usuário submete o formulário com campos vazios
- **THEN** são exibidas mensagens de validação visual e nenhum dado é enviado

### Requirement: Zonas editáveis translúcidas
O sistema SHALL identificar visualmente elementos editáveis com áreas translúcidas para imagens, títulos, descrições e informações complementares.

#### Scenario: Campo editável ativado
- **WHEN** o usuário clica em um campo com `data-editable`
- **THEN** o campo entra em modo de edição com input visível

### Requirement: Upload simulado com validações
O sistema SHALL aceitar arrastar e soltar e seleção via explorador, com pré-visualização, indicação de formato inválido, indicação de tamanho excessivo e possibilidade de substituir a imagem.

#### Scenario: Upload com formato inválido
- **WHEN** o usuário solta um arquivo não-imagem na zona de upload
- **THEN** é exibida a mensagem de formato inválido

### Requirement: Controles de organização e seleção principal
O sistema SHALL permitir adicionar, remover, reordenar e selecionar uma publicação principal no painel.

#### Scenario: Definir publicação principal
- **WHEN** o usuário clica em "Definir principal" em um cartão
- **THEN** aquele cartão é marcado como principal e os demais desmarcados
