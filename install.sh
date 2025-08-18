#!/bin/bash
set -e

echo "🚀 Replitake Local Deployment Setup"
echo "Target OS: kali"
echo "Project Type: nodejs"
echo ""

# Detect OS if not specified
if [[ -z "${OS_OVERRIDE}" ]]; then
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Check for Kali Linux first (based on Debian but with different repos)
        if [[ -f /etc/os-release ]] && grep -q "kali" /etc/os-release; then
            PACKAGE_MANAGER="apt"
            INSTALL_CMD="sudo apt update && sudo apt install -y"
            echo "🔍 Detected: Kali Linux"
        elif command -v apt >/dev/null 2>&1; then
            PACKAGE_MANAGER="apt"
            INSTALL_CMD="sudo apt update && sudo apt install -y"
            echo "🔍 Detected: Debian/Ubuntu-based system"
        elif command -v dnf >/dev/null 2>&1; then
            PACKAGE_MANAGER="dnf"
            INSTALL_CMD="sudo dnf install -y"
            echo "🔍 Detected: Fedora/RHEL-based system"
        elif command -v pacman >/dev/null 2>&1; then
            PACKAGE_MANAGER="pacman"
            INSTALL_CMD="sudo pacman -S --noconfirm"
            echo "🔍 Detected: Arch Linux-based system"
        else
            echo "❌ Unsupported Linux distribution"
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew >/dev/null 2>&1; then
            PACKAGE_MANAGER="brew"
            INSTALL_CMD="brew install"
            echo "🔍 Detected: macOS with Homebrew"
        else
            echo "❌ Homebrew not found. Please install Homebrew first."
            exit 1
        fi
    else
        echo "❌ Unsupported operating system"
        exit 1
    fi
fi

echo "📦 Installing system dependencies..."


# Install Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "Installing Node.js 18..."
    if [[ "$PACKAGE_MANAGER" == "apt" ]]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        $INSTALL_CMD nodejs
    elif [[ "$PACKAGE_MANAGER" == "dnf" ]]; then
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        $INSTALL_CMD nodejs
    elif [[ "$PACKAGE_MANAGER" == "pacman" ]]; then
        $INSTALL_CMD nodejs npm
    elif [[ "$PACKAGE_MANAGER" == "brew" ]]; then
        $INSTALL_CMD node@18
    fi
else
    echo "✅ Node.js is already installed"
fi

# Install package manager


# Install project dependencies
echo "Installing project dependencies..."
npm install

# Install PostgreSQL with version management
if ! command -v psql >/dev/null 2>&1; then
    echo "Installing PostgreSQL..."
    if [[ "$PACKAGE_MANAGER" == "apt" ]]; then
        # Install latest PostgreSQL version
        $INSTALL_CMD postgresql postgresql-contrib postgresql-client
        
        # Ensure PostgreSQL service is properly configured
        POSTGRES_VERSION=$(ls /etc/postgresql/ | head -n1)
        if [[ -n "$POSTGRES_VERSION" ]]; then
            echo "Detected PostgreSQL version: $POSTGRES_VERSION"
            sudo systemctl enable postgresql@$POSTGRES_VERSION
            sudo systemctl start postgresql@$POSTGRES_VERSION
            
            # Also try the generic service
            sudo systemctl enable postgresql 2>/dev/null || true
            sudo systemctl start postgresql 2>/dev/null || true
        else
            sudo systemctl enable postgresql
            sudo systemctl start postgresql
        fi
    elif [[ "$PACKAGE_MANAGER" == "dnf" ]]; then
        $INSTALL_CMD postgresql postgresql-server postgresql-contrib
        sudo postgresql-setup --initdb
        sudo systemctl enable postgresql
        sudo systemctl start postgresql
    elif [[ "$PACKAGE_MANAGER" == "pacman" ]]; then
        $INSTALL_CMD postgresql
        sudo -u postgres initdb -D /var/lib/postgres/data
        sudo systemctl enable postgresql
        sudo systemctl start postgresql
    elif [[ "$PACKAGE_MANAGER" == "brew" ]]; then
        $INSTALL_CMD postgresql
        brew services start postgresql
    fi
else
    echo "✅ PostgreSQL is already installed"
    
    # Ensure services are running for existing installations
    if [[ "$PACKAGE_MANAGER" == "apt" ]]; then
        POSTGRES_VERSION=$(ls /etc/postgresql/ 2>/dev/null | head -n1)
        if [[ -n "$POSTGRES_VERSION" ]]; then
            sudo systemctl enable postgresql@$POSTGRES_VERSION 2>/dev/null || true
            sudo systemctl start postgresql@$POSTGRES_VERSION 2>/dev/null || true
        fi
        sudo systemctl enable postgresql 2>/dev/null || true
        sudo systemctl start postgresql 2>/dev/null || true
    fi
fi

# Verify PostgreSQL installation and service
echo "Verifying PostgreSQL installation..."
sleep 2
if systemctl is-active --quiet postgresql || systemctl is-active --quiet postgresql@* 2>/dev/null; then
    echo "✅ PostgreSQL service is running"
elif pgrep -x postgres >/dev/null; then
    echo "✅ PostgreSQL is running (detected by process)"
else
    echo "⚠️  PostgreSQL service may not be running properly"
    echo "    You may need to start it manually after installation"
fi

echo "✅ Installation completed successfully!"
echo ""
echo "Next steps:"
echo "1. Run './setup_db.sh' to set up the database (if needed)"
echo "2. Copy and configure the .env.local file"
echo "3. Run './start.sh' to start the application"
echo ""
