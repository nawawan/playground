-- Add down migration script here
ALTER TABLE blogs ALTER COLUMN status DROP NOT NULL;