# ==============================================================================
# VERIFICAR CLOUDINARY — ART PORTFOLIO
# Confere se as variáveis de ambiente estão configuradas no backend
# ==============================================================================
# Execute no terminal do Windows (PowerShell).
# ==============================================================================

$envFile = "backend\.env"

if (-not (Test-Path $envFile)) {
    Write-Host "ERRO: backend/.env não encontrado." -ForegroundColor Red
    Write-Host "Rode primeiro: scripts\setup-cloudinary.ps1" -ForegroundColor Yellow
    exit 1
}

$content = Get-Content $envFile -Raw

$hasCloudName = $content -match "CLOUDINARY_CLOUD_NAME\s*="
$hasApiKey = $content -match "CLOUDINARY_API_KEY\s*="
$hasApiSecret = $content -match "CLOUDINARY_API_SECRET\s*="

Write-Host "=== VERIFICAÇÃO DE VARIÁVEIS CLOUDINARY ===" -ForegroundColor Cyan
Write-Host ""

if ($hasCloudName) {
    Write-Host "✓ CLOUDINARY_CLOUD_NAME: configurado" -ForegroundColor Green
} else {
    Write-Host "✗ CLOUDINARY_CLOUD_NAME: NÃO configurado" -ForegroundColor Red
}

if ($hasApiKey) {
    Write-Host "✓ CLOUDINARY_API_KEY: configurado" -ForegroundColor Green
} else {
    Write-Host "✗ CLOUDINARY_API_KEY: NÃO configurado" -ForegroundColor Red
}

if ($hasApiSecret) {
    Write-Host "✓ CLOUDINARY_API_SECRET: configurado" -ForegroundColor Green
} else {
    Write-Host "✗ CLOUDINARY_API_SECRET: NÃO configurado" -ForegroundColor Red
}

Write-Host ""
if ($hasCloudName -and $hasApiKey -and $hasApiSecret) {
    Write-Host "Todas as variáveis estão configuradas!" -ForegroundColor Green
    Write-Host "Você pode fazer upload de imagens no painel admin."
} else {
    Write-Host "Algumas variáveis estão faltando. Edite backend/.env e tente novamente." -ForegroundColor Yellow
}
