-- Add down migration script here
ALTER TABLE blogs ALTER COLUMN title DROP DEFAULT;

ALTER TABLE blogs DROP COLUMN slug;