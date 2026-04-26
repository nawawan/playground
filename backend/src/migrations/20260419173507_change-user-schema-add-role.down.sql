-- Add down migration script here
ALTER TABLE users ADD COLUMN password DEFAULT NULL;
ALTER TABLE users ADD COLUMN salt DEFAULT NULL;
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users DROP COLUMN role;
