# Tasks

## 1. Ambiente Python

- [x] 1.1 Criar venv: `py -3.13 -m venv image-service\.venv`
- [x] 1.2 Criar `image-service/requirements.txt` (fastapi, uvicorn, pillow, python-multipart, httpx)
- [x] 1.3 Instalar: `.venv\Scripts\pip install -r requirements.txt`
- [x] 1.4 Validar imports: `python -c "import fastapi, PIL, uvicorn"`

## 2. Processamento (Pillow)

- [x] 2.1 `app/processing.py`: `VARIANTS = {thumbnail: 400, medium: 800, full: 1600}`
- [x] 2.2 Redimensionar preservando proporção (`Image.thumbnail`, nunca ampliar)
- [x] 2.3 Encode WebP qualidade 80 em `storage/processed/{stem}-{variant}.webp`
- [x] 2.4 Metadados de saída: `file_name`, `file_size` (formato `X,X MB` pt-BR), `width`, `height`
- [x] 2.5 Nunca sobrescrever original (`storage/images/`)

## 3. API FastAPI

- [x] 3.1 `app/main.py`: `GET /health` → 200
- [x] 3.2 `POST /process` multipart: validar `image/*` e tamanho ≤ 10 MB (413 se exceder)
- [x] 3.3 Salvar original + gerar variantes + retornar JSON no contrato
- [x] 3.4 Erros 400/413 com mensagem clara; sem stack trace

## 4. Scripts de teste

- [x] 4.1 `scripts/generate_samples.py`: 10 imagens coloridas (tons dos placeholders) com dimensões do seed em `storage/images/`
- [x] 4.2 `scripts/smoke_test.py`: health + processar amostra + validar variantes/proporção/metadados

## 5. Testes locais (sem deploy)

- [x] 5.1 Servidor sobe em `http://127.0.0.1:8000`
- [x] 5.2 `GET /health` → 200
- [x] 5.3 `POST /process` com amostra → 200, variantes 400/800/1600, proporção preservada, WebP válido
- [x] 5.4 Upload não-imagem → 400; arquivo > 10 MB → 413
- [x] 5.5 Originais intactos em `storage/images/`; variantes em `storage/processed/` (17/17 PASS)

## 6. Documentação e OpenSpec

- [x] 6.1 Criar `docs/ETAPA-06-IMAGES.md`
- [x] 6.2 Atualizar `README.md` (status Etapa 06)
- [x] 6.3 `.gitignore`: storage/images/* e storage/processed/* (manter .gitkeep)
- [x] 6.4 `openspec validate image-service-processing`
- [x] 6.5 Commit local (sem deploy)
- [ ] 6.6 `openspec archive image-service-processing`

## Regras

- [x] NÃO fazer deploy sem autorização explícita.
- [x] Testar TUDO localmente antes de qualquer subida.