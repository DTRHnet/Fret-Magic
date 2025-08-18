#!/bin/bash
set -e

echo "🚀 Replitake Local Deployment Setup"
echo "Target OS: debian"
echo "Project Type: nodejs"
echo ""

# Detect OS if not specified
if [[ -z "${OS_OVERRIDE}" ]]; then
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v apt >/dev/null 2>&1; then
            PACKAGE_MANAGER="apt"
            INSTALL_CMD="sudo apt update && sudo apt install -y"
        elif command -v dnf >/dev/null 2>&1; then
            PACKAGE_MANAGER="dnf"
            INSTALL_CMD="sudo dnf install -y"
        elif command -v pacman >/dev/null 2>&1; then
            PACKAGE_MANAGER="pacman"
            INSTALL_CMD="sudo pacman -S --noconfirm"
        else
            echo "❌ Unsupported Linux distribution"
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew >/dev/null 2>&1; then
            PACKAGE_MANAGER="brew"
            INSTALL_CMD="brew install"
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

echo "✅ Installation completed successfully!"
echo ""
echo "Next steps:"
echo "1. Run './setup_db.sh' to set up the database (if needed)"
echo "2. Copy and configure the .env.local file"
echo "3. Run './start.sh' to start the application"
echo ""
