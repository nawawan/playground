-- Add up migration script here
ALTER TABLE blogs ADD COLUMN slug VARCHAR(30);

ALTER TABLE blogs ALTER COLUMN title SET DEFAULT 'Untitled';