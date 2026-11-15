# Relatório — Servidores Gratuitos para Subida do Art Portfolio

Data do levantamento: 2026-11-15.

## 1. Objetivo

Levantar opções gratuitas de hospedagem para o stack do Art Portfolio **além do MySQL** (que será implementado na Etapa 03), cobrindo: frontend estático, backend Node.js/Express, serviço Python/FastAPI, banco de dados e armazenamento de imagens.

## 2. Stack a subir

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5 + CSS3 + JS Vanilla (estático) |
| Backend | Node.js + Express.js |
| Banco | MySQL 8 |
| Processamento de imagens | Python + FastAPI + Pillow |

## 3. Levantamento por categoria

Legenda: ✅ = verificado na página oficial hoje; ⚠️ = conhecimento prévio, confirmar antes de usar.

### 3.1 Frontend estático

| Serviço | Tier gratuito | Limites relevantes | Adequação |
|---|---|---|---|
| GitHub Pages | $0 | ~1 GB por repo, 100 GB/mês de banda, build 10 min (⚠️) | Ideal: repo já está no GitHub, zero configuração extra |
| Netlify | $0 | 300 créditos/mês; deploy 15 créditos, banda 20 créditos/GB, compute 10 créditos/GB-hora (✅) | Bom para deploy contínuo via Git |
| Vercel | Hobby $0 | 100 GB transferência, 1M requisições CDN, funções 1M invocações (✅) | Bom; funções não são necessárias aqui |
| Cloudflare Pages | $0 | Banda ilimitada (fair use), 500 builds/dia (⚠️) | Excelente se confirmado |

### 3.2 Backend Node/Express + FastAPI (processos longos)

| Serviço | Tier gratuito | Limites relevantes | Adequação |
|---|---|---|---|
| Render | Free compute | 512 MB RAM/serviço, 5 GB banda, 25 serviços, 500 min de build/mês; **serviço "dorme" após inatividade** (cold start) (✅) | Melhor PaaS gratuito para Express + FastAPI (2 serviços separados) |
| Oracle Cloud Always Free (VPS) | ARM Ampere A1: até 4 OCPU / 24 GB RAM + 200 GB storage (⚠️ conferir no console) | Conta por pessoa; 1 conta/pessoa | Roda MySQL + Node + FastAPI + nginx num só lugar; exige admin Linux |
| Deno Deploy | Free | 1M req/mês, 20 GiB egress, 10 h CPU; **anunciado sunset para abril/2027** (✅) | Não recomendado para projeto novo |

### 3.3 MySQL gratuito

| Opção | Observação |
|---|---|
| Oracle Cloud Always Free VPS + MySQL self-managed | Única opção realmente gratuita e sem limite de banco; mantém o MySQL exigido pelo projeto (⚠️) |
| db4free.net / RemoteMySQL.com | MySQL grátis para teste; dados podem ser apagados, **não usar em produção** (⚠️) |
| PlanetScale | **Sem tier gratuito** (a partir de ~US$ 30/mês no SKU mais barato) — descartado (✅) |
| Render Postgres Free | É PostgreSQL, não MySQL — não atende ao requisito do projeto (✅) |

### 3.4 Armazenamento de imagens (relevante à Etapa 06)

| Serviço | Tier gratuito |
|---|---|
| Cloudflare R2 | 10 GB storage + egress grátis (⚠️) |
| Backblaze B2 | 10 GB free (⚠️) |
| Vercel Blob | 1 GB/mês incluído no Hobby (✅) |

## 4. Arquiteturas sugeridas

- **Opção A (recomendada — tudo-em-um):** Oracle Cloud Always Free VPS com MySQL, Node/Express, FastAPI e nginx servindo o frontend. Custo US$ 0, maior aprendizado de infra, exige configuração de segurança (firewall, chaves, backups).
- **Opção B (PaaS, menor esforço):** GitHub Pages/Vercel (frontend) + Render Free (Express e FastAPI) + MySQL em VPS Oracle ou db4free.net (só desenvolvimento). Cuidado: cold start do Render e banda limitada.
- **Opção C (mínima para estudos locais):** manter tudo local (Etapa 01) e subir só o frontend no GitHub Pages enquanto backend/image-service continuam em desenvolvimento.

## 5. Decisão adotada (2026-11-15)

- **Frontend:** Vercel (Hobby $0) — repo já está no GitHub, import direto, deploys automáticos por push, `frontend/vercel.json` já preparado com `cleanUrls`, preview deployments e CDN global. Root do projeto Vercel = `frontend/`, Framework Preset = Other.
- **Backend (Etapas 04-05):** Render Free (Express + FastAPI) — cold start aceitável em desenvolvimento.
- **MySQL:** VPS Oracle Cloud Always Free (self-managed) quando houver serviços para subir; enquanto isso, instância local.
- **Imagens (Etapa 06):** Cloudflare R2 ou Backblaze B2 (10 GB free).

Checklist de deploy do frontend (manual, exige conta Vercel):
1. Importar `GabbCamilo/art-portifolio` na Vercel.
2. Root Directory = `frontend`; Framework Preset = Other.
3. Deploy — `vercel.json` ativa URLs sem `.html`.
4. Domínio customizado opcional (Etapa 08).

## 6. Riscos e cuidados

1. Tiers gratuitos não têm SLA; dados podem ser perdidos — manter backups (dump SQL periódico).
2. Cold start do Render prejudica primeiros acessos após inatividade.
3. Não versionar `.env` com credenciais (já coberto pelo `.gitignore`).
4. Limits de egress/banda afetam imagens originais — justifica o orçamento de transferência documentado na Etapa 02.
5. **Segurança:** o token GitHub usado na subida deste repositório foi exposto em texto claro; deve ser revogado em GitHub → Settings → Developer settings → Personal access tokens.

## 7. Pendências

- Etapa 03 concluída em 2026-11-15 (banco, usuário de aplicação e seed); próxima: Etapa 04 (backend Express).
- Deploy real no Vercel depende de login na conta do usuário (preparativo concluído).
