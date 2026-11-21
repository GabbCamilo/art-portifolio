#!/usr/bin/env bash
# ==============================================================================
# SETUP CLOUDINARY — ART PORTFOLIO
# Ambiente de subida de imagens (substitui image-service + disco local)
# ==============================================================================
# Execute: chmod +x scripts/setup-cloudinary.sh && ./scripts/setup-cloudinary.sh
# ==============================================================================

set -e

echo "=== SETUP CLOUDINARY — ART PORTFOLIO ==="
echo ""

BACKEND_ENV="backend/.env"
BACKEND_ENV_EXAMPLE="backend/.env.example"

# 1. Criar .env se não existir
if [ ! -f "$BACKEND_ENV" ]; then
    echo "Criando backend/.env a partir do .env.example..."
    cp "$BACKEND_ENV_EXAMPLE" "$BACKEND_ENV"
    echo "Arquivo criado. Edite backend/.env com suas credenciais do Cloudinary."
else
    echo "backend/.env já existe."
fi

echo ""
echo "=== PASSO 1: CRIAR CONTA NO CLOUDINARY ==="
echo "1. Acesse https://cloudinary.com e crie uma conta gratuita."
echo "2. Após logar, vá no Dashboard."
echo "3. Anote os três valores abaixo (estão no topo do Dashboard):"
echo "   - Cloud Name"
echo "   - API Key"
echo "   - API Secret"
echo ""

echo "=== PASSO 2: EDITAR backend/.env ==="
echo "Abra o arquivo backend/.env e preencha:"
echo "   CLOUDINARY_CLOUD_NAME=seu-cloud-name"
echo "   CLOUDINARY_API_KEY=sua-api-key"
echo "   CLOUDINARY_API_SECRET=sua-api-secret"
echo ""

echo "=== PASSO 3: CONFIGURAR NO RENDER ==="
echo "No painel do Render → Web Service art-portfolio → Environment → Edit:"
echo "   Adicione as 3 variáveis acima com os valores reais do Cloudinary."
echo "   Salve. O Render fará redeploy automático."
echo ""

echo "=== PASSO 4: INSTALAR DEPENDÊNCIAS (LOCAL) ==="
echo "Se for testar localmente, rode:"
echo "   cd backend"
echo "   npm install"
echo ""

echo "=== PASSO 5: VERIFICAR VARIÁVEIS ==="
echo "Após configurar, rode este comando para confirmar:"
echo "   grep CLOUDINARY backend/.env"
echo ""

echo "=== FIM DO SETUP ==="
