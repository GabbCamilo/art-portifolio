# Tasks

## 1. Executar script de schema

- [x] 1.1 Executar `mysql -u root -p < database/schema.sql`
  - Validar criação de banco `art_portfolio`
  - Validar criação de tabelas `artist_profile` e `publicações`
  - Validar índices e restrições
  - Resultado: banco e tabelas criados (MySQL 8.0.46), colunas e índices conferidos via `DESCRIBE`
- [x] 1.2 Executar `mysql -u root -p < database/seed.sql`
  - Validar inserção de dados de artista
  - Validar inserção de 10 registros em `publicações`
  - Validar `featured=1` na primeira publicação
  - Resultado: 10 publicações e 1 perfil inseridos (o seed já havia sido aplicado; reexecução acusou duplicata id=1, esperado)
- [x] 1.3 Criar usuário de aplicação `art_portfolio_app`
  - `CREATE USER 'art_portfolio_app'@'localhost' IDENTIFIED BY 'secure_password'`
  - `GRANT SELECT, INSERT, UPDATE, DELETE ON art_portfolio.* TO 'art_portfolio_app'@'localhost'`
  - `FLUSH PRIVILEGES`
  - Resultado: usuário já existia; `SHOW GRANTS` confirma SELECT/INSERT/UPDATE/DELETE em `art_portfolio`.*; login validado com a senha do `.env`

## 2. Configurar ambiente (`.env`)

- [x] 2.1 Copiar `.env.example` para `.env`
- [x] 2.2 Preencher `.env` com credenciais reais
  - Resultado: `DB_USER=art_portfolio_app` e senha já definidos; login testado com sucesso
- [x] 2.3 Validar `.env` não versionado (já excluído pelo `.gitignore`)

## 3. Deploy no Vercel

- [ ] 3.1 Importar `GabbCamilo/art-portifolio` na Vercel.
- [ ] 3.2 Configurar Root Directory = `frontend/`.
- [ ] 3.3 Framework Preset = Other.
- [ ] 3.4 Executar deploy (Vercel gerencia CI/CD via GitHub).
- [ ] 3.5 Validar preview deploy.
- [ ] 3.6 Validar URL de produção (frontend estático).
- [ ] 3.7 Validar URL de administração (`/admin/login`).

## 4. Validação

- [x] 4.1 `node --check frontend/js/main.js` — OK (exit 0)
- [x] 4.2 `node --check frontend/js/admin.js` — OK (exit 0)
- [x] 4.3 `openspec validate database-and-deploy` — válido
- [x] 4.4 `mysql -u root -p` executar consultas:
  - `SELECT * FROM artist_profile;` — 1 registro (Kenyureru)
  - `SELECT COUNT(*) FROM publications WHERE featured = 1;` — 1
- [x] 4.5 `vercel --version` — Vercel CLI 65.16.0

## 5. Documentação

- [x] 5.1 Atualizar `README.md` com status.
  - Resultado: status Etapa 03 + URLs de produção/admin + link para relatório
- [x] 5.2 Criar `docs/ETAPA-03-DATABASE-DEPLOY.md` com relatório técnico completo.
- [x] 5.3 Validar atualizações de documentação.

## 6. Finalização

- [x] 6.1 `openspec archive database-and-deploy`
- [x] 6.2 Registrar execução no change log.
- [x] 6.3 Exportar artefatos de especificação (proposal.md, design.md, tasks.md).
- [x] 6.4 Validar mudanças no repositório.

## Cronograma sugerido

1. Executar `schema.sql` e `seed.sql` (5 min).
2. Criar usuário `art_portfolio_app` (2 min).
3. Executar validações MySQL (2 min).
4. Validar node --check (1 min).
5. Importar repo na Vercel e executar deploy (5 min).
6. Validar site (2 min).
7. Atualizar README (5 min).
8. Arquivar change (2 min).

Total ~25 min de execução.