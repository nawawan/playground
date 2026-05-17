-- Add down migration script here
ALTER TABLE blogs ALTER COLUMN slug DROP NOT NULL;