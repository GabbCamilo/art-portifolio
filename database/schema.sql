-- Etapa 03 — Esquema do banco art_portfolio (MySQL 8)
-- Execucao: mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS art_portfolio
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE art_portfolio;

CREATE TABLE IF NOT EXISTS artist_profile (
    id TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    name VARCHAR(120) NOT NULL,
    location VARCHAR(120) NOT NULL,
    medium VARCHAR(120) NOT NULL,
    website VARCHAR(255) NOT NULL,
    store VARCHAR(255) NOT NULL,
    patreon VARCHAR(255) NOT NULL,
    labels JSON NOT NULL DEFAULT ('{}'),
    image_file_name VARCHAR(255) NULL,
    image_file_size VARCHAR(32) NULL,
    image_width SMALLINT UNSIGNED NULL,
    image_height SMALLINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_artist_profile_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS publications (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    description TEXT NOT NULL,
    complementary TEXT NOT NULL,
    published_at DATE NOT NULL,
    featured TINYINT(1) NOT NULL DEFAULT 0,
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(32) NOT NULL,
    width SMALLINT UNSIGNED NOT NULL,
    height SMALLINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_publications_file_name (file_name),
    KEY idx_publications_featured (featured),
    KEY idx_publications_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Etapa 07 — autenticação real de administrador
CREATE TABLE IF NOT EXISTS admin_users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(60) NOT NULL,
    password_hash VARCHAR(255) NOT NULL COMMENT 'scrypt:<salt hex>:<hash hex>',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_admin_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash CHAR(64) NOT NULL COMMENT 'SHA-256 do token entregue ao cliente',
    admin_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    PRIMARY KEY (token_hash),
    KEY idx_admin_sessions_admin (admin_id),
    CONSTRAINT fk_admin_sessions_admin FOREIGN KEY (admin_id)
        REFERENCES admin_users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


