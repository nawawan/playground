-- Add down migration script here
ALTER TABLE users DROP COLUMN IF EXISTS place;
ALTER TABLE users DROP COLUMN IF EXISTS summary;
ALTER TABLE users DROP COLUMN IF EXISTS thumbnail;
