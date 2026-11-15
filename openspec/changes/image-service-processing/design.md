# Design — image-service-processing

## Context

O projeto exige processamento de imagens em Python + FastAPI + Pillow (arquitetura definida no README). O frontend já reserva espaço por obra (`width`/`height`/`aspect-ratio`) e o orçamento de transferência da Etapa 02 separa miniaturas (60 KB) de originais (2,4 MB). Esta etapa entrega o serviço que produzirá essas variantes, testável localmente com imagens de exemplo geradas programaticamente.

## Goals / Non-Goals

**Goals:**
- Serviço FastAPI com `GET /health` e `POST /process` (multipart upload).
- Processamento Pillow: redimensionamento preservando proporção, variantes 400/800/1600 px, encode WebP qualidade 80.
- Metadados de saída compatíveis com `publications` (`file_name`, `file_size`, `width`, `height`).
- Geração de imagens de exemplo (`generate_samples.py`) para testes sem obras reais.
- Smoke test local validando variantes, proporções e tamanhos.

**Non-Goals:**
- Upload definitivo via frontend/admin (Etapa 07/08).
- Integração com backend Express (chamadas HTTP entre serviços) — contrato definido, integração futura.
- AVIF (avaliar após WebP estabilizado); Cloudflare R2/Backblaze (storage real).
- Deploy em produção (somente com autorização explícita).

## Decisions

1. **Variantes por largura-alvo** — `thumbnail` (400 px), `medium` (800 px), `full` (1600 px); `Image.thumbnail()` preserva proporção e nunca amplia. Alternativa rejeitada: crop fixo (`object-fit: cover` no CSS já resolve leitura; distorcer no servidor é inaceitável).

2. **WebP com fallback** — encode `.webp` lossy q=80 (menor peso, suporte moderno); mantém original intacto. `file_size` formatado em KB/MB igual ao padrão do seed (`2,4 MB`).

3. **Escrita em `storage/processed/`** — nunca sobrescreve `storage/images/` (originais). Nome: `{stem}-{variant}.webp`.

4. **Contrato de resposta** — `POST /process` retorna `{ original: {...}, variants: [{ name, file_name, file_size, width, height }] }` consumível pelo backend para popular `publications` (Etapa 05+).

5. **Exemplos gerados** — `generate_samples.py` cria 10 imagens coloridas (tons dos placeholders SVG da Etapa 02) com dimensões do seed, garantindo testes sem obras reais.

6. **Ambiente virtual** — `image-service/.venv` (Python 3.13 via `py -3.13 -m venv`), conforme pendência da Etapa 01; requirements.txt versionado.

7. **Validações** — só `image/*` aceito; tamanho máximo 10 MB (configurável); erros 400/413 com mensagem clara; stack trace não vazia.

## Arquitetura

```
image-service/
├── requirements.txt
├── .venv/                  (não versionado)
├── app/
│   ├── main.py             # FastAPI: /health, /process
│   └── processing.py       # Pillow: variants, WebP, metadados
└── scripts/
    ├── generate_samples.py # imagens de exemplo em storage/images/
    └── smoke_test.py       # testes locais (httpx contra servidor)
```

## Fluxo

```
upload (multipart) -> /process
  ├─ validar tipo/tamanho
  ├─ salvar original em storage/images/
  ├─ para cada variante (400/800/1600):
  │    ├─ Image.thumbnail((w, w))  # proporção preservada
  │    └─ save WebP q=80 em storage/processed/{stem}-{variant}.webp
  └─ retornar metadados JSON (file_name, file_size, width, height)
```

## Risks / Trade-offs

- [Sem obras reais] Exemplos são coloridos gerados; proporções/tamanhos reais virão do upload real. Mitigação: contrato de metadados já compatível com o banco.
- [WebP suporte] Navegadores antigos não renderizam WebP. Mitigação: `srcset` futuro pode servir JPEG; documentado.
- [Pillow + Python 3.13] Wheels oficiais disponíveis; se falhar, usar 3.11 (documentado na Etapa 01).
- [Serviço separado] Backend Express precisará chamar este serviço (Etapa 08). Mitigação: contrato JSON estável definido aqui.

## Migration Plan

1. Criar change OpenSpec e validar.
2. `py -3.13 -m venv image-service/.venv`; instalar requirements.
3. Implementar `processing.py`, `main.py`, scripts.
4. Gerar amostras; rodar smoke test local.
5. `openspec validate image-service-processing`; commit local.
6. Arquivar change.

## Open Questions

- O backend Express consumirá `/process` ou o image-service grava direto em `storage/` e o backend lê metadados? Decidir na Etapa 08.
- AVIF entra no mix de variantes? Avaliar after WebP em produção.