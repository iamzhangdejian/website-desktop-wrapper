#!/bin/bash
# Build script for Windows
# Usage: bash scripts/build-windows.sh

set -e

echo "Building Website Desktop Wrapper for Windows..."

# Check if we're on Windows
if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "cygwin" && "$OSTYPE" != "win32" ]]; then
    echo "Warning: This script is intended for Windows. Current OS: $OSTYPE"
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Build the application
echo "Building Tauri app..."
pnpm tauri build --target x86_64-pc-windows-msvc

# Output paths
echo ""
echo "Build complete! Artifacts:"
echo "  NSIS: src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/"
echo "  MSI:  src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi/"
