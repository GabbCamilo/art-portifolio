# ==============================================================================
# SETUP CLOUDINARY — ART PORTFOLIO
# Ambiente de subida de imagens (substitui image-service + disco local)
# ==============================================================================
# Este script orienta a configuração do Cloudinary para o backend do Art Portfolio.
# Execute no terminal do Windows (PowerShell).
# ==============================================================================

Write-Host "=== SETUP CLOUDINARY — ART PORTFOLIO ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se o .env existe no backend
$backendEnv = "backend\.env"
$backendEnvExample = "backend\.env.example"

if (-not (Test-Path $backendEnv)) {
    Write-Host "Criando backend/.env a partir do .env.example..." -ForegroundColor Yellow
    Copy-Item $backendEnvExample $backendEnv
    Write-Host "Arquivo criado. Edite backend/.env com suas credenciais do Cloudinary." -ForegroundColor Green
} else {
    Write-Host "backend/.env já existe." -ForegroundColor Green
}

Write-Host ""
Write-Host "=== PASSO 1: CRIAR CONTA NO CLOUDINARY ===" -ForegroundColor Cyan
Write-Host "1. Acesse https://cloudinary.com e crie uma conta gratuita."
Write-Host "2. Após logar, vá no Dashboard."
Write-Host "3. Anote os três valores abaixo (estão no topo do Dashboard):"
Write-Host "   - Cloud Name"
Write-Host "   - API Key"
Write-Host "   - API Secret"
Write-Host ""

# 2. Exemplo de como editar o .env
Write-Host "=== PASSO 2: EDITAR backend/.env ===" -ForegroundColor Cyan
Write-Host "Abra o arquivo backend/.env e preencha:"
Write-Host "   CLOUDINARY_CLOUD_NAME=seu-cloud-name"
Write-Host "   CLOUDINARY_API_KEY=sua-api-key"
Write-Host "   CLOUDINARY_API_SECRET=sua-api-secret"
Write-Host ""

# 3. Instruções para Render
Write-Host "=== PASSO 3: CONFIGURAR NO RENDER ===" -ForegroundColor Cyan
Write-Host "No painel do Render → Web Service art-portfolio → Environment → Edit:"
Write-Host "   Adicione as 3 variáveis acima com os valores reais do Cloudinary."
Write-Host "   Salve. O Render fará redeploy automático."
Write-Host ""

# 4. Instalar dependências
Write-Host "=== PASSO 4: INSTALAR DEPENDÊNCIAS (LOCAL) ===" -ForegroundColor Cyan
Write-Host "Se for testar localmente, rode:"
Write-Host "   cd backend"
Write-Host "   npm install"
Write-Host ""

# 5. Verificação rápida
Write-Host "=== PASSO 5: VERIFICAR VARIÁVEIS ===" -ForegroundColor Cyan
Write-Host "Após configurar, rode este comando para confirmar:"
Write-Host "   Get-Content backend\.env | Select-String CLOUDINARY"
Write-Host ""

Write-Host "=== FIM DO SETUP ===" -ForegroundColor Cyan
