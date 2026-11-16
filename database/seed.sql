-- Etapa 03 — Carga inicial
-- Execucao: mysql -u root -p < database/seed.sql

USE art_portfolio;

INSERT INTO artist_profile (id, name, location, medium, website, store, patreon) VALUES
(1, 'Kenyureru', 'São Paulo, Brasil', 'Digital', 'https://exemplo.com', 'N/A', 'N/A');
