# Spec Delta

## Purpose

Sincronizar o painel administrativo com a página pública: zonas de upload de imagem por slot (destaque principal, perfil e feed), edição dos Details do perfil e da obra principal, botão de publicar/atualizar e remoção de publicações com exclusão do arquivo armazenado.

## ADDED Requirements

### Requirement: Upload de imagens por slot
O sistema SHALL aceitar envio de arquivos de imagem em zonas de upload dedicadas ao destaque principal, ao perfil e ao feed, validando tipo de imagem e tamanho máximo, armazenando o arquivo e refletindo a escolha imediatamente nos slots correspondentes do painel.

#### Scenario: Upload de imagem de destaque
- **WHEN** o administrador seleciona uma imagem na zona "Destaque principal"
- **THEN** o arquivo é enviado via API, armazenado e exibido como publicação em destaque, desmarcando qualquer destaque anterior

#### Scenario: Upload de imagem de perfil
- **WHEN** o administrador seleciona uma imagem na zona "Perfil"
- **THEN** o arquivo é enviado, armazenado e exibido como imagem do perfil ao lado dos campos Details

#### Scenario: Upload de imagem no feed
- **WHEN** o administrador seleciona uma ou mais imagens na zona do feed
- **THEN** cada arquivo é enviado, armazenado e exibido como nova publicação no muro

#### Scenario: Arquivo não-imagem
- **WHEN** o usuário seleciona um arquivo que não é imagem
- **THEN** o upload é rejeitado com erro de formato inválido

### Requirement: Publicações com imagem e remoção
O sistema SHALL exibir publicações como cartões contendo a imagem e o botão de remover, sem títulos nem descrições, e SHALL permitir excluir a publicação e seu arquivo armazenado.

#### Scenario: Remover publicação
- **WHEN** o administrador clica em "Remover" em um cartão
- **THEN** a publicação é excluída via API, seu arquivo é removido do armazenamento e o cartão some da galeria

### Requirement: Publicar / Atualizar site
O sistema SHALL oferecer um botão no painel para salvar as edições dos Details e sincronizar a galeria com a página pública, e um botão na página pública para recarregar os dados do servidor.

#### Scenario: Salvar e atualizar
- **WHEN** o administrador edita os Details e clica em "Salvar / Atualizar site"
- **THEN** as edições são enviadas à API e a galeria é recarregada

#### Scenario: Atualizar página pública
- **WHEN** o visitante clica em "Atualizar" no muro
- **THEN** a página recarrega artista, destaque e feed da API
