# Supabase Local Development

This directory contains the Supabase configuration and database migrations for the TW Frontend project.

## Prerequisites

1. **Install Supabase CLI**

   ```bash
   # macOS
   brew install supabase/tap/supabase

   # npm (alternative)
   npm install -g supabase

   # Or check: https://supabase.com/docs/guides/cli/getting-started
   ```

2. **Install Docker**
   - Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Ensure Docker is running before starting Supabase

## Directory Structure

```
supabase/
├── config.toml          # Supabase local configuration
├── migrations/          # Database migration files (versioned SQL)
│   ├── 20250101000001_create_enums.sql
│   ├── 20250101000002_create_companies_table.sql
│   ├── 20250101000003_create_jobs_table.sql
│   ├── 20250101000004_create_search_function.sql
│   ├── 20250101000005_create_technologies_tables.sql
│   └── 20250101000006_create_indexes.sql
├── seed.sql             # (Optional) Seed data for development
└── README.md            # This file
```

## Quick Start

### 1. Start Supabase Locally

```bash
supabase start
```

This will:

- Pull required Docker images (first run only)
- Start all Supabase services (Postgres, Auth, Storage, etc.)
- Apply all migrations automatically
- Output connection URLs and keys

### 2. Access Local Services

After starting, you'll see output like:

```
API URL: http://127.0.0.1:54321
GraphQL URL: http://127.0.0.1:54321/graphql/v1
S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
Inbucket URL: http://127.0.0.1:54324
```

- **Supabase Studio**: http://127.0.0.1:54323 (visual database management)
- **Database**: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

### 3. Stop Supabase

```bash
supabase stop
```

## Migration Commands

### List Migrations

Shows which migrations are applied locally:

```bash
supabase migration list --local
```

### Apply Pending Migrations

Apply any new migrations to the running local database:

```bash
supabase migration up --local
```

### Reset Database

Drops and recreates the database, applying all migrations and seed data:

```bash
supabase db reset
```

### Create a New Migration

Generate a new empty migration file:

```bash
supabase migration new <migration_name>
# Example: supabase migration new add_salary_column
```

### Generate Migration from Schema Diff

If you make changes via Supabase Studio, capture them as a migration:

```bash
supabase db diff -f <migration_name>
# Example: supabase db diff -f add_salary_column
```

## Migration File Naming Convention

Migration files follow the pattern: `<timestamp>_<name>.sql`

- **Timestamp**: 14-digit format (YYYYMMDDHHmmss)
- **Name**: Descriptive snake_case name

Example: `20250101000001_create_enums.sql`

## Migration Order (Current Schema)

1. **create_enums** - All ENUM types (job_function, province, experience_level, etc.)
2. **create_companies_table** - Companies table
3. **create_jobs_table** - Jobs table + search vector trigger
4. **create_search_function** - `search_jobs()` stored procedure
5. **create_technologies_tables** - Technologies, aliases, and junction tables
6. **create_indexes** - All performance indexes

## Troubleshooting

### Docker Not Running

```
Error: Cannot connect to the Docker daemon
```

Solution: Start Docker Desktop and wait for it to fully initialize.

### Port Already in Use

```
Error: Port 54322 is already in use
```

Solution: Stop any existing Supabase instance or change ports in `config.toml`.

### Reset Everything

If you encounter issues, reset the local environment:

```bash
supabase stop --no-backup
supabase start
```

### View Logs

```bash
supabase logs --local
```

## Useful Commands Reference

| Command                         | Description                        |
| ------------------------------- | ---------------------------------- |
| `supabase start`                | Start local Supabase               |
| `supabase stop`                 | Stop local Supabase                |
| `supabase status`               | Show service status and URLs       |
| `supabase db reset`             | Reset database with all migrations |
| `supabase migration up`         | Apply pending migrations           |
| `supabase migration list`       | Show migration status              |
| `supabase migration new <name>` | Create new migration file          |
| `supabase db diff -f <name>`    | Generate migration from changes    |

## Next Steps

- Add seed data in `supabase/seed.sql` for development
- Configure RLS (Row Level Security) policies
- Set up Edge Functions if needed
- Link to a remote project with `supabase link`
