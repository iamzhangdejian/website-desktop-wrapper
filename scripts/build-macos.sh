#!/bin/bash
# Build script for macOS
# Usage: bash scripts/build-macos.sh

set -e

echo "Building Website Desktop Wrapper for macOS..."

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "Error: This script must be run on macOS. Current OS: $OSTYPE"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Build the application (Universal Binary for Intel + Apple Silicon)
echo "Building Tauri app (Universal Binary)..."
pnpm tauri build --target universal-apple-darwin

# Output paths
echo ""
echo "Build complete! Artifacts:"
echo "  DMG: src-tauri/target/universal-apple-darwin/release/bundle/dmg/"
echo "  APP: src-tauri/target/universal-apple-darwin/release/bundle/macos/"

# Optional: Build for specific architectures
echo ""
echo "To build for specific architectures only:"
echo "  Apple Silicon: pnpm tauri build --target aarch64-apple-darwin"
echo "  Intel:         pnpm tauri build --target x86_64-apple-darwin"
