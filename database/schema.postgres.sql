-- Etapa 03 — Esquema do banco art_portfolio (PostgreSQL)
-- Execucao: psql -U postgres -f database/schema.postgres.sql

CREATE DATABASE art_portfolio;

\c art_portfolio

CREATE TABLE artist_profile (
    id SMALLINT NOT NULL PRIMARY KEY DEFAULT 1,
    name VARCHAR(120) NOT NULL,
    location VARCHAR(120) NOT NULL,
    medium VARCHAR(120) NOT NULL,
    website VARCHAR(255) NOT NULL,
    store VARCHAR(255) NOT NULL,
    patreon VARCHAR(255) NOT NULL,
    labels JSONB NOT NULL DEFAULT '{}'::jsonb,
    image_file_name VARCHAR(255) NULL,
    image_file_size VARCHAR(32) NULL,
    image_width SMALLINT NULL,
    image_height SMALLINT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_artist_profile_single_row CHECK (id = 1)
);

CREATE TABLE publications (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    complementary TEXT NOT NULL,
    published_at DATE NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT false,
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(32) NOT NULL,
    width SMALLINT NOT NULL,
    height SMALLINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_publications_file_name UNIQUE (file_name)
);

CREATE INDEX idx_publications_featured ON publications (featured);
CREATE INDEX idx_publications_published_at ON publications (published_at);

CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(60) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_admin_users_username UNIQUE (username)
);

CREATE TABLE admin_sessions (
    token_hash CHAR(64) NOT NULL,
    admin_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    PRIMARY KEY (token_hash),
    CONSTRAINT fk_admin_sessions_admin FOREIGN KEY (admin_id)
        REFERENCES admin_users (id) ON DELETE CASCADE
);

CREATE INDEX idx_admin_sessions_admin ON admin_sessions (admin_id);
