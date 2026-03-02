-- SQL Script to setup PostgreSQL database and fix permissions
-- Run this as postgres superuser: psql -U postgres -f setup_postgresql.sql

-- Drop database if exists (optional - remove this line if you want to keep existing data)
-- DROP DATABASE IF EXISTS school_db2;

-- Create database
CREATE DATABASE school_db2 OWNER school_user;

-- Connect to the database
\c school_db2

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE school_db2 TO school_user;

-- Grant privileges on schema public
GRANT ALL ON SCHEMA public TO school_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO school_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO school_user;

-- Grant privileges on future tables and sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO school_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO school_user;

-- Make school_user the owner of schema public
ALTER SCHEMA public OWNER TO school_user;

-- Verify
\du school_user
\l school_db2
