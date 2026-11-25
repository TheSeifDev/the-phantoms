-- Phantoms — Neon Postgres schema
-- The API route creates this table automatically on first lead (CREATE TABLE IF NOT EXISTS),
-- but you can also run this file once in the Neon SQL editor.

CREATE TABLE IF NOT EXISTS leads (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  kind       TEXT,
  budget     TEXT,
  message    TEXT        NOT NULL,
  status     TEXT        NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);
