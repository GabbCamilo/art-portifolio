# Design — admin-dashboard-persistence

## Contexto

- Etapa 04: CRUD admin `POST/PUT/DELETE /api/admin/publications` com Bearer de sessão (Etapa 07).
- Etapa 05: site público consome `GET /api/artist`, `GET /api/publications`.
- Etapa 07: auth real (scrypt, sessões), dashboard ainda simulado.
- Simplificação solicitada: o admin deve espelhar a página pública, enviar arquivos de imagem de verdade e publicá-los com um botão; o público mostra apenas o que está no banco.

## Decisões

1. **Rótulos e valores editáveis**: armazenados em `artist_profile.labels` (JSON); o admin renomeia rótulos e edita valores livremente; refletidos no hero público.
2. **Imagem de perfil**: colunas `image_file_name`, `image_file_size`, `image_width`, `image_height` em `artist_profile`; upload via slot "Perfil"; exibida no hero ao lado dos Details.
3. **Upload real de imagens**: `POST /api/admin/uploads` (multer → `image-service` `/process`), slots `featured`/`profile`/`feed`; arquivo original em `storage/images/`; variantes WebP em `storage/processed/`; o servidor Node serve `storage/` estaticamente em `/storage`.
4. **Publicações sem `title`**: coluna removida do banco e da API; o feed exibe apenas a imagem; descrição/complemento só da obra em destaque (exibidos nos Details do hero).
5. **Destaque exclusivo**: `PUT` com `featured: true` zera as demais; upload no slot `featured` move o destaque (o anterior volta ao feed).
6. **Remoção**: `DELETE /api/admin/publications/:id` exclui a linha e o arquivo armazenado (original + variantes).
7. **Página pública sem fallback simulado**: exibe apenas dados do banco; começa vazia; botão "Atualizar" recarrega a API; estados vazio e de erro tratados.
8. **Galeria administrativa**: grid `repeat(auto-fill, minmax(12rem, 1fr))`; cartões contêm apenas a imagem e o botão Remover; sem Subir/Descer e sem "Definir principal".
9. **Tooltip do muro**: `opacity: 0` por padrão; visível apenas no `:hover`/`:focus-visible`.
10. **Sem browser headless**: validação visual continua como checklist manual.

11. **Slot de upload do feed no mesmo tamanho de um card**: a zona de upload do slot `feed` no admin redimensionada para `12rem x 12rem` (mesma largura mínima dos cards da galeria, `minmax(12rem, 1fr)`), com badge "novo" sobreposto no canto superior esquerdo. O `edit-veil` mantém o rótulo e o input de arquivo oculto; o upload continua funcionando via `data-slot="feed"`.

12. **Destaque da imagem do hero ao clicar**: a obra em destaque (`featured-band`, imagem `featured-image`) abre a mesma visualização ampliada (lightbox) usada pelas imagens unitárias do muro, ao clicar ou ao pressionar Enter/Espaço (elemento com `role="button"` e `tabindex="0"`). Todas as bordas/área escura ao redor da imagem (backdrop do lightbox) funcionam como espaço de clique para fechar/sair da visualização destacada; setas de navegação e indicadores são ocultos neste modo, pois é uma imagem única.

13. **Destaque da imagem de perfil do hero ao clicar**: a imagem do perfil (`hero-image`, dentro de `.hero-frame`) abre a mesma visualização ampliada (lightbox) das imagens unitárias do muro, ao clicar ou ao pressionar Enter/Espaço (`role="button"`/`tabindex="0"`/`aria-label`). A área de borda/backdrop fecha a visualização; setas e indicadores ocultos no modo `profile`.

14. **Recorte das imagens publicadas no muro**: as imagens da grade pública (`.wall-item img`) usam `object-fit: cover` com `object-position: top`, mostrando o topo e o meio inteiros da obra; apenas a base (parte inferior) é ocultada pelo recorte do container.

## Riscos

- Nome de arquivo duplicado no upload: `ON DUPLICATE KEY UPDATE` reusa a linha existente no mesmo slot.
- `image-service` deve estar rodando para uploads (porta 8000); falha do serviço retorna erro ao administrador sem quebrar a leitura.
- Navegador sem arquivo selecionado no input: o evento `change` sem arquivos é ignorado.

## Contratos

- `POST /api/admin/uploads?slot=featured|profile|feed` (multipart `file`, Bearer token): 201 com metadados da imagem armazenada; 400 formato inválido; 413 acima de 10 MB; 401 sem sessão.
- `PUT /api/admin/artist` — body com campos do perfil → 200 perfil atualizado.
- `GET /api/artist` → `{...perfil, labels, image|null}`.
- `GET /api/publications` → `{items:[{id, db_id, date, featured, image:{file_name,file_size,width,height,tone}}], total, limit, offset}`; `?featured=true` inclui `description` e `complementary`.
- `PUT /api/admin/publications/:id` — `description`/`complementary` → 200; `featured: true` desmarca as demais.
- `DELETE /api/admin/publications/:id` → 204; remove arquivo e variantes do armazenamento.
