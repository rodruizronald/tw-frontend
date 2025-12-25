# =============================================================================
# Supabase Local Development Makefile
# =============================================================================
# This Makefile provides convenient shortcuts for common Supabase operations.
# Run `make help` to see all available commands.
# =============================================================================

.PHONY: help db-start db-stop db-status db-reset db-migrate db-migrate-new db-diff db-list db-logs db-studio

# Default target
help:
	@echo ""
	@echo "Supabase Database Commands"
	@echo "=========================="
	@echo ""
	@echo "  make db-start        Start Supabase local development environment"
	@echo "  make db-stop         Stop Supabase local development environment"
	@echo "  make db-status       Show status of Supabase services"
	@echo "  make db-studio       Open Supabase Studio in browser"
	@echo ""
	@echo "Migration Commands"
	@echo "=================="
	@echo ""
	@echo "  make db-reset        Reset database (drop, recreate, apply all migrations)"
	@echo "  make db-migrate      Apply pending migrations to local database"
	@echo "  make db-list         List all migrations (local status)"
	@echo "  make db-diff         Generate migration from schema changes (interactive)"
	@echo "  make db-migrate-new  Create a new empty migration file (interactive)"
	@echo ""
	@echo "Utility Commands"
	@echo "================"
	@echo ""
	@echo "  make db-logs         View Supabase logs"
	@echo "  make db-stop-clean   Stop Supabase and remove all data"
	@echo ""

# =============================================================================
# Supabase Service Management
# =============================================================================

# Start Supabase local development environment
db-start:
	@echo "Starting Supabase local development..."
	supabase start

# Stop Supabase local development environment
db-stop:
	@echo "Stopping Supabase..."
	supabase stop

# Stop Supabase and remove all local data
db-stop-clean:
	@echo "Stopping Supabase and removing all data..."
	supabase stop --no-backup

# Show status of all Supabase services
db-status:
	@echo "Supabase Status:"
	@echo "================"
	supabase status

# Open Supabase Studio in default browser
db-studio:
	@echo "Opening Supabase Studio..."
	@open http://127.0.0.1:54323 2>/dev/null || xdg-open http://127.0.0.1:54323 2>/dev/null || echo "Visit: http://127.0.0.1:54323"

# =============================================================================
# Migration Commands
# =============================================================================

# Reset the local database (drops and recreates, applies all migrations + seeds)
db-reset:
	@echo "Resetting local database..."
	@echo "WARNING: This will drop all data in the local database!"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	supabase db reset

# Apply pending migrations to the local database
db-migrate:
	@echo "Applying pending migrations..."
	supabase migration up --local

# List all migrations and their status
db-list:
	@echo "Migration Status:"
	@echo "================="
	supabase migration list --local

# Create a new empty migration file
# Usage: make db-migrate-new name=my_migration_name
db-migrate-new:
ifndef name
	@echo "Usage: make db-migrate-new name=<migration_name>"
	@echo "Example: make db-migrate-new name=add_salary_column"
	@exit 1
endif
	@echo "Creating new migration: $(name)"
	supabase migration new $(name)

# Generate a migration by diffing against the current schema
# Usage: make db-diff name=my_migration_name
db-diff:
ifndef name
	@echo "Usage: make db-diff name=<migration_name>"
	@echo "Example: make db-diff name=add_salary_column"
	@exit 1
endif
	@echo "Generating migration from schema diff: $(name)"
	supabase db diff -f $(name)

# =============================================================================
# Utility Commands
# =============================================================================

# View Supabase logs
db-logs:
	supabase logs --local

# =============================================================================
# Quick Reference (for copy-paste)
# =============================================================================
# 
# Start fresh:
#   make db-start
#
# After changing migrations:
#   make db-reset
#
# Create new migration:
#   make db-migrate-new name=add_new_feature
#
# Capture Dashboard changes:
#   make db-diff name=captured_changes
#
# =============================================================================
