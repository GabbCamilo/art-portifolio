-- Etapa 03 — Carga inicial (mesmos dados simulados do frontend)
-- Execucao: mysql -u root -p < database/seed.sql

USE art_portfolio;

INSERT INTO artist_profile (id, name, location, medium, website, store, patreon) VALUES
(1, 'Kenyureru', 'São Paulo, Brasil', 'Digital', 'https://exemplo.com', 'N/A', 'N/A');

INSERT INTO publications (title, description, complementary, published_at, featured, file_name, file_size, width, height) VALUES
('Retratos Urbanos',
 'Uma série de esboços rápidos capturando a luz da cidade ao entardecer.',
 'Obra selecionada manualmente pelo proprietário como publicação principal. Dados simulados até a integração com backend.',
 '2026-05-12', 1, 'retratos-urbanos.jpg', '2,4 MB', 1200, 900),
('Natureza Abstrata',
 'Exploração de texturas e gradientes em óleo sobre tela grande.',
 '',
 '2026-04-08', 0, 'natureza-abstrata.jpg', '1,8 MB', 1600, 900),
('Figuras em Movimento',
 'Desenhos de carvão estudando posa e gesto humano.',
 '',
 '2026-03-22', 0, 'figuras-em-movimento.jpg', '3,1 MB', 1000, 1400),
('Cidade Noturna',
 'Pintura digital experimentando paletas monocromáticas.',
 '',
 '2026-02-18', 0, 'cidade-noturna.jpg', '2,2 MB', 1400, 1000),
('Auto-retrato Expressivo',
 'Técnica mista sobre papel kraft, 2024.',
 '',
 '2026-02-05', 0, 'auto-retrato-expressivo.jpg', '1,5 MB', 1000, 1000),
('Maré Baixa',
 'Estudo de luz sobre água em aquarela digital.',
 '',
 '2026-01-20', 0, 'mare-baixa.jpg', '2,0 MB', 1500, 1000),
('Silêncio do Interior',
 'Composição minimalista com formas orgânicas.',
 '',
 '2025-12-11', 0, 'silencio-do-interior.jpg', '2,7 MB', 1200, 1500),
('Entre Linhas',
 'Collage digital explorando geometria e espaço negativo.',
 '',
 '2025-11-03', 0, 'entre-linhas.jpg', '1,9 MB', 1600, 1200),
('Jardim Suspenso',
 'Ilustração botânica com paleta restrita.',
 '',
 '2025-10-15', 0, 'jardim-suspenso.jpg', '2,3 MB', 1000, 1300),
('Última Luz',
 'Estudo final de dia ao entardecer.',
 '',
 '2025-09-28', 0, 'ultima-luz.jpg', '1,6 MB', 1400, 900);
