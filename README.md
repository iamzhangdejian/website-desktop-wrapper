# Website Desktop Wrapper

A lightweight, cross-platform desktop application wrapper for websites, built with Tauri 2.0.

Transform any responsive website into a native desktop application for Windows, macOS, and Linux.

## Features

- 🚀 **Lightweight**: Package size < 15MB (compared to Electron's 150MB+)
- ⚡ **High Performance**: Uses system WebView, no bundled Chromium
- 🖥️ **Cross-Platform**: Windows, macOS, and Linux support
- 🎨 **Native Experience**: System tray, application menus, keyboard shortcuts
- 🔄 **Auto-Update**: Built-in update mechanism via GitHub Releases
- 🌙 **Dark Mode**: Automatic dark mode support
- 🔒 **Secure**: Configurable CSP and permission system

## System Requirements

### Development

- **Node.js**: 18+ 
- **pnpm**: 8+
- **Rust**: Latest stable
- **Tauri CLI**: 2.0+

### Platform-Specific Dependencies

#### Windows
- [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (C++ components)
- WebView2 (included in Windows 10/11)

#### macOS
- Xcode Command Line Tools: `xcode-select --install`
- WebKit (system built-in)

#### Linux

**Ubuntu/Debian:**
```bash
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
```

**Fedora:**
```bash
sudo dnf install -y \
    webkit2gtk4.1-devel \
    openssl-devel \
    curl \
    wget \
    file \
    libappindicator-gtk3-devel \
    librsvg2-devel
```

**Arch:**
```bash
sudo pacman -S \
    webkit2gtk-4.1 \
    base-devel \
    curl \
    wget \
    file \
    libappindicator-gtk3 \
    librsvg
```

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-username/website-desktop-wrapper.git
cd website-desktop-wrapper
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure your website URL

Edit `.env` (create from `.env.example`):

```bash
VITE_WEBSITE_URL=https://your-website.com
```

### 4. Update application metadata

Edit `src-tauri/tauri.conf.json`:

```json
{
  "productName": "Your App Name",
  "identifier": "com.yourcompany.yourapp",
  "app": {
    "title": "Your App Name"
  }
}
```

### 5. Add your application icon

Prepare a 1024x1024 PNG icon and generate platform-specific icons:

```bash
pnpm tauri icon ./path/to/your-icon.png
```

### 6. Run in development mode

```bash
pnpm tauri dev
```

## Building for Production

### Windows

```bash
bash scripts/build-windows.sh
# or
pnpm tauri build --target x86_64-pc-windows-msvc
```

**Output:** `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/`
- NSIS installer (.exe)
- MSI installer (.msi)

### macOS

```bash
bash scripts/build-macos.sh
# or
pnpm tauri build --target universal-apple-darwin
```

**Output:** `src-tauri/target/universal-apple-darwin/release/bundle/`
- DMG installer
- APP bundle

### Linux

```bash
bash scripts/build-linux.sh
# or
pnpm tauri build --target x86_64-unknown-linux-gnu
```

**Output:** `src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/`
- AppImage (universal)
- DEB package (Debian/Ubuntu)
- RPM package (Fedora/RHEL)

## Configuration

### Application Settings

Edit `src-tauri/src/config.rs`:

```rust
pub struct AppConfig {
    pub website_url: String,          // Website URL to load
    pub window_title: String,         // Window title
    pub window_width: f64,            // Default width
    pub window_height: f64,           // Default height
    pub min_width: f64,               // Minimum width
    pub min_height: f64,              // Minimum height
    pub enable_tray: bool,            // Enable system tray
    pub enable_auto_update: bool,     // Enable auto-update
    pub allowed_domains: Vec<String>, // In-app navigation domains
}
```

### Security (CSP)

Edit `src-tauri/tauri.conf.json`:

```json
{
  "app": {
    "security": {
      "csp": "default-src 'self'; script-src 'self' 'unsafe-inline'; ..."
    }
  }
}
```

## Project Structure

```
website-desktop-wrapper/
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── main.rs        # Application entry
│   │   ├── lib.rs         # Module declarations
│   │   ├── config.rs      # Configuration
│   │   ├── window.rs      # Window management
│   │   ├── tray.rs        # System tray
│   │   ├── menu.rs        # Application menu
│   │   ├── updater.rs     # Auto-update
│   │   └── commands.rs    # Tauri commands
│   ├── icons/             # Application icons
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
├── src/                    # Frontend (React)
│   ├── components/
│   │   ├── LoadingScreen.tsx
│   │   ├── OfflinePage.tsx
│   │   └── ErrorPage.tsx
│   ├── styles/
│   │   └── global.css
│   ├── App.tsx
│   └── main.tsx
├── .github/workflows/      # CI/CD
│   └── build.yml
├── scripts/                # Build scripts
├── package.json
└── README.md
```

## Features Explained

### System Tray

- Left-click: Show/hide window
- Right-click menu:
  - Show Window
  - Quit

### Application Menu

**macOS:**
- App menu (About, Check for Updates, Quit)
- File, Edit, View, Window, Help menus

**Windows/Linux:**
- File, Edit, View, Help menus

### Keyboard Shortcuts

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Reload | Cmd+R | Ctrl+R / F5 |
| Force Reload | Cmd+Shift+R | Ctrl+Shift+R / Ctrl+F5 |
| Zoom In | Cmd+= | Ctrl+= |
| Zoom Out | Cmd+- | Ctrl+- |
| Reset Zoom | Cmd+0 | Ctrl+0 |
| DevTools | Cmd+Option+I | F12 / Ctrl+Shift+I |
| Close Window | Cmd+W | - |
| Quit | Cmd+Q | Alt+F4 |

### Auto-Update

Configure GitHub Releases in `src-tauri/tauri.conf.json`:

```json
{
  "plugins": {
    "updater": {
      "endpoints": [
        "https://github.com/your-username/your-repo/releases/latest/download/latest.json"
      ]
    }
  }
}
```

## CI/CD

GitHub Actions workflow (`.github/workflows/build.yml`) automatically:

- Builds on push to `main`/`develop`
- Builds on pull requests
- Builds on version tags (`v*.*.*`)
- Uploads artifacts
- Creates GitHub Releases for tags

## Customization

### Loading Screen

Edit `src/components/LoadingScreen.tsx` to customize the loading animation.

### Offline Page

Edit `src/components/OfflinePage.tsx` to customize the offline error message.

### Error Page

Edit `src/components/ErrorPage.tsx` to customize error handling.

### Allowed Domains

Edit `src-tauri/src/config.rs` to configure which domains navigate in-app vs. open in system browser:

```rust
allowed_domains: vec![
    "your-domain.com".to_string(),
    "www.your-domain.com".to_string(),
],
```

## Troubleshooting

### Build fails on Linux

Install missing dependencies:
```bash
# Check which dependencies are missing
ldd src-tauri/target/release/your-app | grep "not found"

# Install them via your package manager
```

### WebView not loading

Check CSP configuration in `tauri.conf.json`. Ensure your website domain is allowed.

### Auto-update not working

Verify GitHub Releases endpoint and ensure `latest.json` is published.

### Window not showing

Check if `enable_tray` is true and window is minimized to tray.

## Comparison with Electron

| Feature | Tauri (This Project) | Electron |
|---------|---------------------|----------|
| Package Size | ~5-15MB | ~80-150MB |
| Memory Usage | ~50-80MB | ~200-400MB |
| Startup Time | Fast | Slow |
| WebView | System WebView | Bundled Chromium |
| Security | Rust backend | Node.js backend |
| Bundle | Native installers | Native installers |

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Resources

- [Tauri Documentation](https://tauri.app/)
- [Tauri API Reference](https://docs.rs/tauri/)
- [Tauri GitHub](https://github.com/tauri-apps/tauri)

---

**Built with ❤️ using Tauri 2.0**
