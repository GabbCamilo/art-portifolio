-- Etapa 03 — Carga inicial (PostgreSQL)
-- Execucao: psql -d art_portfolio -f database/seed.sql

INSERT INTO artist_profile (id, name, location, medium, website, store, patreon)
VALUES (1, 'Kenyureru', 'São Paulo, Brasil', 'Digital', 'https://exemplo.com', 'N/A', 'N/A')
ON CONFLICT (id) DO NOTHING;
