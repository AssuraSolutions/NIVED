-- Reset database script
-- This will clear all data and reset the database to a clean state

-- Disable foreign key checks temporarily
SET foreign_key_checks = 0;

-- Drop all tables if they exist
DROP TABLE IF EXISTS custom_orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS settings;

-- Re-enable foreign key checks
SET foreign_key_checks = 1;

-- The tables will be recreated by Prisma when you run the migration
SELECT 'Database reset completed. Run "npx prisma db push" to recreate tables.' as message;
