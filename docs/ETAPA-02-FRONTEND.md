# Relatório Técnico — Etapa 02: Frontend (Remodelagem)

## 1. Objetivo da etapa

Remodelar a interface do Art Portfolio como página única (exceto admin), seguindo as três referências visuais: faixa de destaque no header (obra em destaque com *fade* na base), hero editorial 50/50 (imagem + caixa de texto), muro de fotos em grade fluida (`auto-fill`, altura uniforme) com tooltip translúcido do nome do arquivo, lightbox individual com carrossel e setas laterais translúcidas, carregamento progressivo e área administrativa visual.

## 2. Referências interpretadas

- **Referência 01 (Lightbox)**: fundo escuro fullscreen, imagem centralizada, setas laterais translúcidas que se destacam ao passar o cursor, fechamento por botão, clique fora e tecla Escape; navegação por setas do teclado; indicadores em esfera com janela ±3; sem compartilhamento social.
- **Referência 02 (Muro/galeria)**: imagens protagonistas, proporções originais preservadas (corte via `object-fit: cover` com altura uniforme), espaçamento equilibrado, sem distorção, navegação contínua por rolamento vertical.
- **Referência 03 (Apresentação)**: obra secundária aproximadamente metade da área + caixa de texto do artista (Artista, Localização, Técnica/Mídia, Website, Loja, Patreon) na outra metade, empilhada verticalmente no mobile.

## 3. Arquivos analisados

- `README.md`, `docs/ETAPA-01-INFRAESTRUTURA.md`
- `frontend/index.html`, `frontend/css/style.css`, `frontend/js/main.js`
- `frontend/admin/login.html`, `frontend/admin/dashboard.html`, `frontend/css/admin.css`, `frontend/js/admin.js`
- Estrutura de diretórios e `.gitignore`

## 4. Arquivos criados ou modificados

| Arquivo | Ação |
|---|---|
| `frontend/index.html` | Reestruturado: header com logo (link admin) + faixa da obra em destaque e *fade*; hero 50/50; muro de fotos em grade fluida; link `/admin/login.html` no rodapé; lightbox mantido |
| `frontend/css/style.css` | Reescrito: tokens oficiais + header com *fade*, hero split 50/50, muro `auto-fill`/`minmax`, tooltip translúcido central (nome do arquivo), legendas de metadados, lightbox e setas laterais, responsividade, `prefers-reduced-motion` |
| `frontend/js/main.js` | Reescrito: renderização do destaque (header), hero com imagem secundária + caixas do artista, muro progressivo (exclui o destaque), lotes 6+4 via IntersectionObserver, lightbox com coleção do muro, teclado (Escape/setas), foco preso/restaurado, indicadores ±3 |
| `frontend/admin/login.html` | Criado (estrutura visual de login) |
| `frontend/admin/dashboard.html` | Criado (painel editável visual) |
| `frontend/css/admin.css` | Criado (identidade + zonas editáveis translúcidas + dropzone) |
| `frontend/js/admin.js` | Criado (validações visuais, zonas editáveis, upload simulado, CRUD visual) |
| `README.md` | Estrutura e status atualizados |
| `docs/ETAPA-02-FRONTEND.md` | Criado (este documento) |

`frontend/artist.html` (vazio) mantido sem alteração, conforme regra de não remover estruturas existentes.

## 5. Decisões técnicas

1. **Página única pública**: comissões e contato não são páginas separadas nesta remodelagem; apenas `index.html` e o bloco de administração no rodapé.
2. **Header com obra em destaque**: imagem contida no container de 960 px com mescla esbranquiçada (`linear-gradient`) na base, desfazendo-se no fundo `#F8EEEE`.
3. **Hero 50/50**: grade de duas colunas em desktop (imagem secundária à esquerda com proporção fixa 4/5, caixa textual à direita sobre o fundo da página), empilhamento vertical no mobile (imagem 1/1).
4. **Muro de fotos em fluxo vertical**: coluna única de imagens grandes, altura uniforme (`aspect-ratio: 2/1` no desktop, `4/3` no mobile) com `object-fit: cover`, sem distorção; barra de nome do arquivo na base da imagem, texto centralizado, sempre visível, com o mesmo fundo translúcido do flash de hover (`rgba(41,35,35,0.55)`), sem contorno de borda. A imagem de destaque do header não possui legenda/tooltip.
5. **Destaque excluído do muro**: `state.collection` do muro é `getChronological()` (somente não-featured); a publicação em destaque permanece no header.
6. **Carregamento progressivo**: lote inicial de 6 miniaturas; sentinela `#feed-sentinel` observada por `IntersectionObserver` (`rootMargin: 200px`) carrega lotes de 4; `loading="lazy"` + `decoding="async"`; dimensões explícitas; placeholders SVG `data:` URI com nome do arquivo.
7. **Orçamento de transferência (dados simulados)**: miniatura média 60 KB; original média 2,4 MB.
   - Muro (primeiro lote) = 6 × 60 KB = **360 KB**.
   - Muro (lote progressivo) = 4 × 60 KB = **240 KB**.
   - Original (sob demanda no lightbox) = 1 × 2,4 MB = **2,4 MB**.
   - Regra: `Orçamento do lote = quantidade × peso médio`, separando miniaturas de originais.
8. **Lightbox**: `role="dialog"`, `aria-modal`, bloqueio de rolagem (`body.lightbox-open`), armadilha de foco, restauração de foco ao fechar, Escape fecha, `←`/`→` navegam, clique fora da imagem fecha, indicadores em esfera com janela ±3 (`computeIndicatorWindow`), setas laterais translúcidas com ampliação suave no hover.
9. **Admin visual apenas**: login com validação de campos e mensagens (sem segurança real, sem senha em `localStorage`); dashboard com zonas editáveis translúcidas, controles de adicionar/remover/reordenar/definir principal e upload simulado (drag&drop + seletor, pré-visualização via FileReader, validação de formato `image/*` e tamanho ≤ 5 MB, substituição permitida).
10. **Placeholders de imagem**: SVGs gerados em `data:` URI com dimensões reais e nome do arquivo no texto.
11. **Nenhuma dependência nova**: Vanilla JS + APIs nativas (IntersectionObserver, FileReader, File API).

## 6. Testes executados e resultados reais

| Teste | Resultado |
|---|---|
| `node --check frontend/js/main.js` | Aprovado (exit 0) |
| `node --check frontend/js/admin.js` | Aprovado (exit 0) |
| Janela de indicadores ±3 | `window(0,10,3)={0..3}`, `window(5,10,3)={2..8}`, `window(9,10,3)={6..9}` — corretos |
| Orçamento de lotes | 360 KB (inicial), 240 KB (progressivo), 2,4 MB (full) — coerente com a fórmula |

## 7. Pendências

1. Validação visual em navegador real (layout, hover, foco, reduced-motion) — sem browser headless neste ambiente.
2. Imagens reais e `srcset`/`sizes` dependem do image-service (Etapa 06) e do backend (Etapa 04/05).
3. Persistência das edições do admin e autenticação real dependem do backend/MySQL (Etapas 03-04) e da autenticação (Etapa 07).
4. Tratamento de timezone para datas date-only quando o backend enviar datas completas.
5. `commissions.html`/`contact.html` não são necessários nesta versão (página única); `artist.html` vazio permanece sem uso.

## 8. Pontos de continuidade

- OpenSpec: change `frontend-remodel-gallery-lightbox-admin` documenta o redesenho atual.
- Próxima atividade recomendada: Etapa 03 — Modelagem e implementação do banco de dados (`art_portfolio`, tabela de publicações com `file_name`, `file_size`, `width`, `height`, `featured`).
