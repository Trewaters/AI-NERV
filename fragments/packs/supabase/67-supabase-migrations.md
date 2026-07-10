# Supabase Database Migrations

Use this fragment to enforce safe database schema changes in Supabase.

## Migration rules

- ALWAYS create new SQL migration files when changes to the database need to be made.
- NEVER edit an existing migration file for migration purposes, as this breaks the migration history and causes schema drift or `already exists` errors on databases that have already run it.
- Prefix new migration files properly if generating them manually, or preferably use the Supabase CLI (`npx supabase migration new <name>`) to generate the correct timestamped file.
- If an existing table needs new columns, write an `ALTER TABLE` statement in a new migration instead of adding the columns to the original `CREATE TABLE` migration.
