# PowerShell script to fix PostgreSQL permissions
# Run this script as Administrator or with PostgreSQL superuser access

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Permissions Fix Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "ERROR: psql command not found!" -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL is installed and in your PATH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can manually run these SQL commands:" -ForegroundColor Yellow
    Write-Host "  psql -U postgres" -ForegroundColor White
    Write-Host ""
    Write-Host "Then execute the SQL from: backend/setup_postgresql.sql" -ForegroundColor Yellow
    exit 1
}

Write-Host "Step 1: Connecting to PostgreSQL as postgres user..." -ForegroundColor Green
Write-Host "You will be prompted for the postgres password" -ForegroundColor Yellow
Write-Host ""

# SQL commands to fix permissions
$sqlCommands = @"
-- Create database if not exists
SELECT 'CREATE DATABASE school_db2 OWNER school_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'school_db2')\gexec

-- Connect to database
\c school_db2

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE school_db2 TO school_user;

-- Grant privileges on schema public
GRANT ALL ON SCHEMA public TO school_user;
ALTER SCHEMA public OWNER TO school_user;

-- Grant privileges on all existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO school_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO school_user;

-- Grant privileges on future tables and sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO school_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO school_user;

-- Verify
\du school_user
\l school_db2
"@

Write-Host "Executing SQL commands..." -ForegroundColor Green
Write-Host ""

# Save SQL to temporary file
$tempSqlFile = [System.IO.Path]::GetTempFileName() + ".sql"
$sqlCommands | Out-File -FilePath $tempSqlFile -Encoding UTF8

Write-Host "Run this command manually:" -ForegroundColor Yellow
Write-Host "  psql -U postgres -f `"$tempSqlFile`"" -ForegroundColor White
Write-Host ""
Write-Host "Or run these commands interactively:" -ForegroundColor Yellow
Write-Host "  psql -U postgres" -ForegroundColor White
Write-Host "  Then copy and paste the SQL from: backend/setup_postgresql.sql" -ForegroundColor White
Write-Host ""
Write-Host "SQL file location: $tempSqlFile" -ForegroundColor Cyan
