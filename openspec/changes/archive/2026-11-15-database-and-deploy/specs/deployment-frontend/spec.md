# Spec Delta

## Purpose

Especificar a estratégia de deploy do frontend estático do Art Portfolio no Vercel.

## ADDED Requirements

### Requirement: Deploy do frontend no Vercel
O sistema SHALL implantar o frontend estático no Vercel a partir do repositório GitHub `GabbCamilo/art-portifolio`.

#### Scenario: Configuração do projeto na Vercel
- **WHEN** o repositório é importado na Vercel
- **THEN** o Root Directory configurado é `frontend/`
- **THEN** o Framework Preset é definido como Other
- **THEN** o arquivo `frontend/vercel.json` com `cleanUrls` ativa URLs sem extensão `.html`

### Requirement: Integridade de deploy
O sistema SHALL garantir que o deploy esteja disponível para acesso público via CDN da Vercel.

#### Scenario: Deploy realizado com sucesso
- **WHEN** o usuário dispara um deploy na Vercel
- **THEN** o frontend estático é servido via CDN global
- **THEN** o endereço de produção responde com HTML válido

#### Scenario: URL de administração
- **WHEN** o usuário acessa o endereço de administração
- **THEN** o endereço `/admin/login` é servido corretamente
