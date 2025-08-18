#!/bin/bash
set -e

# ASCII Art Header
echo "╔══════════════════════════════════════════════════════════╗"
echo "║               POSTGRESQL DATABASE SETUP                 ║"
echo "║                    Replitake v2.0                       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Configuration
DB_NAME="app_db"
DB_USER="app_user"
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

echo "[INFO] Initializing PostgreSQL database setup..."
echo "[CONFIG] Database Name: $DB_NAME"
echo "[CONFIG] Database User: $DB_USER"
echo "[CONFIG] Generated Password: ********** (32 chars)"
echo ""

# Check if PostgreSQL is installed
echo "[CHECK] Verifying PostgreSQL installation..."
if ! command -v psql >/dev/null 2>&1; then
    echo "[ERROR] PostgreSQL is not installed or not in PATH"
    echo "[SOLUTION] Please run the install.sh script first"
    exit 1
fi
echo "[OK] PostgreSQL client found: $(psql --version)"

# Check and start PostgreSQL service with version detection
echo "[CHECK] Verifying PostgreSQL service status..."
POSTGRES_RUNNING=false

# Check various PostgreSQL service patterns
if sudo systemctl is-active --quiet postgresql 2>/dev/null; then
    echo "[OK] PostgreSQL service is running (generic service)"
    POSTGRES_RUNNING=true
elif systemctl list-units --type=service --state=active | grep -q "postgresql@"; then
    ACTIVE_PG_VERSION=$(systemctl list-units --type=service --state=active | grep "postgresql@" | head -n1 | awk '{print $1}')
    echo "[OK] PostgreSQL service is running ($ACTIVE_PG_VERSION)"
    POSTGRES_RUNNING=true
elif pgrep -x postgres >/dev/null; then
    echo "[OK] PostgreSQL is running (detected by process)"
    POSTGRES_RUNNING=true
fi

if [[ "$POSTGRES_RUNNING" == "false" ]]; then
    echo "[WARN] PostgreSQL service appears to be stopped"
    echo "[ACTION] Attempting to start PostgreSQL service..."
    
    # Try to detect and start the correct PostgreSQL version
    POSTGRES_VERSION=$(ls /etc/postgresql/ 2>/dev/null | sort -V | tail -n1)
    if [[ -n "$POSTGRES_VERSION" ]]; then
        echo "[INFO] Detected PostgreSQL version: $POSTGRES_VERSION"
        echo "[ACTION] Starting postgresql@$POSTGRES_VERSION service..."
        sudo systemctl enable postgresql@$POSTGRES_VERSION 2>/dev/null || true
        sudo systemctl start postgresql@$POSTGRES_VERSION 2>/dev/null || true
        sleep 3
        
        if sudo systemctl is-active --quiet postgresql@$POSTGRES_VERSION 2>/dev/null; then
            echo "[OK] PostgreSQL $POSTGRES_VERSION service started successfully"
        else
            echo "[WARN] Version-specific service failed, trying generic service..."
            sudo systemctl enable postgresql 2>/dev/null || true
            sudo systemctl start postgresql 2>/dev/null || true
            sleep 3
        fi
    else
        echo "[ACTION] Starting generic PostgreSQL service..."
        sudo systemctl enable postgresql 2>/dev/null || true
        sudo systemctl start postgresql 2>/dev/null || true
        sleep 3
    fi
    
    # Final check
    if sudo systemctl is-active --quiet postgresql 2>/dev/null || sudo systemctl is-active --quiet postgresql@* 2>/dev/null || pgrep -x postgres >/dev/null; then
        echo "[OK] PostgreSQL service started successfully"
    else
        echo "[ERROR] Failed to start PostgreSQL service"
        echo "[MANUAL] Please check PostgreSQL installation and start manually:"
        echo "  - sudo systemctl status postgresql"
        echo "  - sudo systemctl status postgresql@*"
        echo "  - sudo journalctl -u postgresql"
        exit 1
    fi
else
    echo "[OK] PostgreSQL service is already running"
fi

# Check PostgreSQL configuration for password authentication
echo "[CHECK] Verifying PostgreSQL authentication configuration..."
PG_VERSION=$(sudo -u postgres psql -t -c "SELECT version();" | grep -o "PostgreSQL [0-9]*" | grep -o "[0-9]*")
echo "[INFO] Detected PostgreSQL version: $PG_VERSION"

# Test connection to PostgreSQL with better error handling
echo "[TEST] Testing PostgreSQL connection..."
CONNECTION_ATTEMPTS=0
MAX_ATTEMPTS=3

while [ $CONNECTION_ATTEMPTS -lt $MAX_ATTEMPTS ]; do
    if sudo -u postgres psql -c "SELECT 1;" >/dev/null 2>&1; then
        echo "[OK] PostgreSQL connection successful"
        break
    else
        CONNECTION_ATTEMPTS=$((CONNECTION_ATTEMPTS + 1))
        echo "[WARN] Connection attempt $CONNECTION_ATTEMPTS failed"
        
        if [ $CONNECTION_ATTEMPTS -lt $MAX_ATTEMPTS ]; then
            echo "[ACTION] Attempting to restart PostgreSQL service..."
            # Try different PostgreSQL service patterns
            sudo systemctl restart postgresql 2>/dev/null ||             sudo systemctl restart postgresql@* 2>/dev/null ||             sudo service postgresql restart 2>/dev/null || true
            sleep 3
        fi
    fi
done

if [ $CONNECTION_ATTEMPTS -eq $MAX_ATTEMPTS ]; then
    echo "[ERROR] Could not establish PostgreSQL connection after $MAX_ATTEMPTS attempts"
    echo "[INFO] Detected PostgreSQL version: $(psql --version 2>/dev/null || echo 'Unknown')"
    echo "[MANUAL] Please check PostgreSQL service status manually:"
    echo "  - sudo systemctl status postgresql"
    echo "  - sudo systemctl status postgresql@*"
    echo "  - Check PostgreSQL logs: sudo journalctl -u postgresql"
    echo "[CONTINUE] Proceeding with database setup (may fail)..."
fi

# Check if database already exists
echo "[CHECK] Checking if database '$DB_NAME' already exists..."
DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME';")
if [[ "$DB_EXISTS" = "1" ]]; then
    echo "[WARN] Database '$DB_NAME' already exists"
    echo -n "[PROMPT] Do you want to recreate it? This will DELETE ALL DATA. (y/N): "
    read -r RECREATE
    if [[ "$RECREATE" =~ ^[Yy]$ ]]; then
        echo "[ACTION] Dropping existing database..."
        sudo -u postgres psql -c "DROP DATABASE IF EXISTS $DB_NAME;" >/dev/null
        echo "[OK] Existing database dropped"
    else
        echo "[SKIP] Keeping existing database, only updating user permissions"
    fi
fi

# Check if user already exists
echo "[CHECK] Checking if user '$DB_USER' already exists..."
USER_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER';")
if [[ "$USER_EXISTS" = "1" ]]; then
    echo "[WARN] User '$DB_USER' already exists"
    echo "[ACTION] Updating user password and permissions..."
    sudo -u postgres psql -c "ALTER USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';" >/dev/null
    sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;" >/dev/null
    echo "[OK] User updated successfully"
else
    echo "[ACTION] Creating new database user..."
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';" >/dev/null
    sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;" >/dev/null
    echo "[OK] User '$DB_USER' created successfully"
fi

# Create database if it doesn't exist
if [[ "$DB_EXISTS" != "1" ]] || [[ "$RECREATE" =~ ^[Yy]$ ]]; then
    echo "[ACTION] Creating database '$DB_NAME'..."
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" >/dev/null
    echo "[OK] Database '$DB_NAME' created successfully"
fi

# Grant all privileges
echo "[ACTION] Granting privileges to user '$DB_USER'..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" >/dev/null
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;" >/dev/null 2>&1 || true
echo "[OK] Privileges granted successfully"

# Test user connection
echo "[TEST] Testing user connection to database..."
if PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" >/dev/null 2>&1; then
    echo "[OK] User connection test successful"
else
    echo "[WARN] User connection test failed, but continuing..."
    echo "[NOTE] You may need to configure pg_hba.conf for local connections"
fi

# Update .env.local file
echo "[ACTION] Updating environment configuration..."
if [ -f ".env.local" ]; then
    # Backup original file
    cp ".env.local" ".env.local.backup"
    echo "[BACKUP] Created backup: .env.local.backup"
    
    # Update with generated credentials
    sed -i "s/GENERATED_PASSWORD/$DB_PASSWORD/g" .env.local
    sed -i "s/postgresql:\/\/app_user:GENERATED_PASSWORD@localhost:5432\/app_db/postgresql:\/\/$DB_USER:$DB_PASSWORD@localhost:5432\/$DB_NAME/g" .env.local
    echo "[OK] Environment file updated successfully"
else
    echo "[WARN] .env.local file not found, creating minimal configuration..."
    cat > .env.local << EOL
# Database configuration
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
PGHOST=localhost
PGPORT=5432
PGDATABASE=$DB_NAME
PGUSER=$DB_USER
PGPASSWORD=$DB_PASSWORD
EOL
    echo "[OK] Created .env.local with database configuration"
fi

# Final summary
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                   SETUP COMPLETED                       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "[SUMMARY] PostgreSQL Database Setup Complete"
echo "┌─────────────────────────────────────────────────────────┐"
echo "│ Database Details:                                       │"
echo "│   Name: $DB_NAME                                    │"
echo "│   User: $DB_USER                                   │"
echo "│   Pass: ${DB_PASSWORD:0:8}...                           │"
echo "│   URL:  postgresql://$DB_USER:****@localhost:5432/$DB_NAME │"
echo "└─────────────────────────────────────────────────────────┘"
echo ""
echo "[NEXT] Your application is now ready to connect to PostgreSQL!"
echo "[NEXT] Run './start.sh' to launch your application"
echo ""
