# Design — admin-dashboard-persistence

## Contexto

- Etapa 04: CRUD admin `POST/PUT/DELETE /api/admin/publications` com Bearer de sessão (Etapa 07).
- Etapa 05: site público consome `GET /api/artist`, `GET /api/publications`.
- Etapa 07: auth real (scrypt, sessões), dashboard ainda simulado.

## Decisões

1. **`position` INT em `publications`** (0 = não ordenado): feed público `ORDER BY position ASC, published_at DESC, id DESC`; reorder grava 1..N na ordem do DOM.
2. **`profile_topics`** independente de `artist_profile` (sem FK): CRUD simples, exibição no hero abaixo dos campos fixos.
3. **PUT com `featured=true`** zera `featured` das demais linhas na mesma transação (única obra principal).
4. **`PUT /api/admin/artist`** com validação de strings (name/location/medium/website/store/patreon); mesmo contrato de campos do GET.
5. **Modal no dashboard** (não nova página): formulário com title, description, complementary, published_at, featured, file_name (metadados + preview local via FileReader; upload real via image-service fica para a próxima etapa).
6. **Drag & drop HTML5** nos cards; botões Subir/Descer removidos; "Definir principal" e "Remover" mantidos.
7. **Tooltip do muro**: `opacity: 0` por padrão, visível no `:hover`/`:focus-visible` (padrão já usado por `.media-caption`).
8. **Rótulos fixos** (Artist/Location/Medium/Website/Store/Patreon) vêm do schema `artist_profile` e não são renomeáveis; títulos editáveis são os dos tópicos customizados.
9. **Muro cíclico**: ao esgotar `total`, o cursor do feed volta ao primeiro item (em modo API o offset reinicia); não há mensagem de fim.
10. **Secundária esticada**: no grid 50/50 do hero (desktop), `.hero-media` ocupa a altura da coluna de texto (`align-items: stretch` + frame `height: 100%`), sem distorção (`object-fit: cover`).

## Riscos

- Backfill de `position` em tabela com dados: feito via root (app user sem ALTER).
- DnD sem fallback de teclado: documentado; acessibilidade via "Definir principal"/"Remover".
- Sem browser headless: validação visual fica como checklist manual.

## Contratos

- `POST /api/admin/publications/reorder` — `{ids:[db_id,...]}` → 204; 400 se não for array de inteiros.
- `PUT /api/admin/artist` — body com campos do perfil → 200 perfil atualizado.
- `GET /api/artist` → `{...perfil, topics:[{id,title,body,position}]}`.
- `POST/PUT/DELETE /api/admin/topics` — CRUD de tópicos.
