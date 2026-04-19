-- Add up migration script here
ALTER TABLE users ADD COLUMN email text DEFAULT NULL;
ALTER TABLE users ADD COLUMN role varchar(10) DEFAULT 'reader';
ALTER TABLE users DROP COLUMN password;
ALTER TABLE users DROP COLUMN salt;
