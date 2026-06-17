#!/bin/bash
# Build script for Linux
# Usage: bash scripts/build-linux.sh

set -e

echo "Building Website Desktop Wrapper for Linux..."

# Check if we're on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "Warning: This script is intended for Linux. Current OS: $OSTYPE"
fi

# Install system dependencies (Ubuntu/Debian)
if command -v apt-get &> /dev/null; then
    echo "Installing system dependencies (Debian/Ubuntu)..."
    sudo apt-get update
    sudo apt-get install -y \
        libwebkit2gtk-4.1-dev \
        build-essential \
        curl \
        wget \
        file \
        libxdo-dev \
        libssl-dev \
        libayatana-appindicator3-dev \
        librsvg2-dev
# Install system dependencies (Fedora)
elif command -v dnf &> /dev/null; then
    echo "Installing system dependencies (Fedora)..."
    sudo dnf install -y \
        webkit2gtk4.1-devel \
        openssl-devel \
        curl \
        wget \
        file \
        libappindicator-gtk3-devel \
        librsvg2-devel
# Install system dependencies (Arch)
elif command -v pacman &> /dev/null; then
    echo "Installing system dependencies (Arch)..."
    sudo pacman -S --noconfirm \
        webkit2gtk-4.1 \
        base-devel \
        curl \
        wget \
        file \
        libappindicator-gtk3 \
        librsvg
else
    echo "Warning: Could not detect package manager. Please install dependencies manually."
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
pnpm install

# Build the application
echo "Building Tauri app..."
pnpm tauri build --target x86_64-unknown-linux-gnu

# Output paths
echo ""
echo "Build complete! Artifacts:"
echo "  AppImage: src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/appimage/"
echo "  DEB:      src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/deb/"
echo "  RPM:      src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/rpm/"

# Optional: Build specific formats
echo ""
echo "To build specific formats only:"
echo "  AppImage: pnpm tauri build --target x86_64-unknown-linux-gnu -- --bundles appimage"
echo "  DEB:      pnpm tauri build --target x86_64-unknown-linux-gnu -- --bundles deb"
echo "  RPM:      pnpm tauri build --target x86_64-unknown-linux-gnu -- --bundles rpm"
