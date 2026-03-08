-- Add is_builtin flag to providers
ALTER TABLE providers ADD COLUMN is_builtin INTEGER NOT NULL DEFAULT 0;

-- Seed enowX Labs as the built-in provider
INSERT OR IGNORE INTO providers (id, name, provider_type, base_url, api_key, model, is_default, is_builtin, created_at, updated_at)
VALUES (
  'enowxlabs-builtin',
  'enowX Labs',
  'enowxlabs',
  'https://api.enowxlabs.com/v1',
  NULL,
  'enowx-default',
  1,
  1,
  datetime('now'),
  datetime('now')
);
