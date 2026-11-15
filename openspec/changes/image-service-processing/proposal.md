# Proposal — image-service-processing

## Why

O frontend usa placeholders SVG simulados (Etapa 02) e o backend serve metadados (Etapa 04-05). A Etapa 06 implementa o serviço de processamento de imagens (Python + FastAPI + Pillow) responsável por gerar variantes de resolução (thumbnails/medias/originais) com proporções preservadas, alimentando `srcset`/`sizes` futuros e o orçamento de transferência documentado.

## What Changes

- `image-service/requirements.txt`: fastapi, uvicorn, pillow, python-multipart.
- `image-service/app/main.py`: app FastAPI com `GET /health` e `POST /process` (upload multipart → variantes).
- `image-service/app/processing.py`: lógica Pillow — resize preservando proporção, encode WebP (qualidade configurável), escrita em `storage/processed/`.
- `image-service/scripts/generate_samples.py`: gera imagens de exemplo a partir dos tons dos placeholders (dados simulados, sem obras reais).
- `image-service/scripts/smoke_test.py`: testes locais do serviço contra imagens geradas.
- `storage/images/` (originais) e `storage/processed/` (variantes) — conteúdo gerado não versionado.
- `docs/ETAPA-06-IMAGES.md`: relatório técnico.

## Capabilities

### New Capabilities

- `image-variants`: processamento de imagem em variantes de largura (400/800/1600 px) com proporção preservada e encode WebP, sem distorcer, sem sobrescrever originais.
- `image-api`: API FastAPI expondo healthcheck e endpoint de processamento com resposta em metadados compatíveis com o schema MySQL (`file_name`, `file_size`, `width`, `height`).

### Modified Capabilities

- (vazio — primeira especificação dessas capacidades)

## Impact

- Arquivos criados: `image-service/**` (app, scripts, requirements), `docs/ETAPA-06-IMAGES.md`.
- Arquivos modificados: `README.md` (status), `.gitignore` (storage contents).
- Sem impacto em frontend/ (placeholders mantidos até imagem real), backend/ (JS) ou database/.
- Dependências novas (Python apenas): fastapi, uvicorn, pillow, python-multipart.