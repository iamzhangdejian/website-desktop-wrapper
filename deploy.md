# Website Desktop Wrapper - 配置与发布指南

本文档详细说明如何配置、构建和发布 Website Desktop Wrapper 桌面应用。

---

## 目录

1. [环境要求](#环境要求)
2. [项目配置](#项目配置)
3. [开发模式](#开发模式)
4. [构建发布版本](#构建发布版本)
5. [CI/CD 自动构建](#cicd-自动构建)
6. [应用图标配置](#应用图标配置)
7. [常见问题](#常见问题)
8. [平台特定说明](#平台特定说明)

---

## 环境要求

### 基础依赖

- **Node.js**: 18+ 
- **npm**: 8+ (或 pnpm 8+)
- **Rust**: 最新稳定版
- **Tauri CLI**: 2.0+

### 安装 Rust

```bash
# macOS/Linux
curl --proto '=https://' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Windows
# 下载并运行 https://rustup.rs/
```

### 平台特定依赖

#### macOS

```bash
# 安装 Xcode Command Line Tools
xcode-select --install

# WebKit 已内置
```

#### Windows

- 安装 [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
  - 选择 "C++ build tools"
  - 确保勾选 "Windows 10/11 SDK"
- WebView2 已内置于 Windows 10/11

#### Linux

**Ubuntu/Debian:**
```bash
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

---

## 项目配置

### 1. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 2. 配置网站 URL

编辑 `.env` 文件：

```bash
# 开发环境
VITE_WEBSITE_URL=http://localhost:3000

# 生产环境
VITE_WEBSITE_URL=https://your-website.com
```

### 3. 配置应用信息

编辑 `src-tauri/tauri.conf.json`：

```json
{
  "productName": "你的应用名称",
  "version": "1.0.0",
  "identifier": "com.yourcompany.yourapp",
  "app": {
    "windows": [
      {
        "title": "窗口标题",
        "width": 1280,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

**关键字段说明：**

| 字段 | 说明 | 示例 |
|------|------|------|
| `productName` | 应用显示名称 | `"我的应用"` |
| `identifier` | 唯一标识符（反向域名格式） | `"com.example.myapp"` |
| `version` | 版本号 | `"1.0.0"` |
| `windows[0].title` | 窗口标题 | `"我的应用 - 主页"` |
| `windows[0].width/height` | 默认窗口尺寸 | `1280` / `800` |

### 4. 配置允许的内部域名

编辑 `src-tauri/src/config.rs`：

```rust
impl Default for AppConfig {
    fn default() -> Self {
        Self {
            // ... 其他配置
            allowed_domains: vec![
                "your-domain.com".to_string(),
                "www.your-domain.com".to_string(),
                "api.your-domain.com".to_string(),
            ],
        }
    }
}
```

**说明：** `allowed_domains` 中的域名会在应用内导航，其他域名会在系统浏览器中打开。

### 5. 配置 CSP（内容安全策略）

编辑 `src-tauri/tauri.conf.json`：

```json
{
  "app": {
    "security": {
      "csp": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.your-domain.com wss://*.your-domain.com; frame-src 'none'; object-src 'none'; base-uri 'self';"
    }
  }
}
```

**CSP 配置说明：**

- `default-src 'self'`: 默认只允许加载同源资源
- `script-src 'self' 'unsafe-inline'`: 允许内联脚本（某些网站需要）
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`: 允许 Google Fonts
- `connect-src 'self' https://*.your-domain.com wss://*.your-domain.com`: 允许连接到你的域名和 WebSocket
- `frame-src 'none'`: 禁止 iframe（安全考虑）

**根据你的网站需求调整 CSP。**

---

## 开发模式

### 启动开发服务器

**方式 1：使用 Tauri CLI（推荐）**

```bash
npx tauri dev
```

这会自动：
1. 启动前端开发服务器（Vite，端口 1420）
2. 编译 Rust 后端
3. 启动桌面应用窗口

**方式 2：分别启动**

```bash
# 终端 1：启动前端
npm run dev

# 终端 2：启动 Tauri
npx tauri dev
```

### 热重载

- **前端修改**：自动热重载（HMR）
- **Rust 修改**：需要重启 `tauri dev`
- **配置文件修改**：需要重启 `tauri dev`

### 调试

**打开开发者工具：**
- macOS: `Cmd + Option + I`
- Windows/Linux: `F12` 或 `Ctrl + Shift + I`

**查看日志：**
```bash
# 启用详细日志
RUST_LOG=debug npx tauri dev
```

---

## 构建发布版本

### 构建当前平台

```bash
npx tauri build
```

构建产物位于：
- macOS: `src-tauri/target/release/bundle/macos/` 和 `dmg/`
- Windows: `src-tauri/target/release/bundle/nsis/` 和 `msi/`
- Linux: `src-tauri/target/release/bundle/appimage/`、`deb/`、`rpm/`

### 使用平台脚本

```bash
# macOS
bash scripts/build-macos.sh

# Windows
bash scripts/build-windows.sh

# Linux
bash scripts/build-linux.sh
```

### 构建特定目标

**macOS:**
```bash
# Universal Binary (Intel + Apple Silicon)
npx tauri build --target universal-apple-darwin

# 仅 Apple Silicon
npx tauri build --target aarch64-apple-darwin

# 仅 Intel
npx tauri build --target x86_64-apple-darwin
```

**Windows:**
```bash
npx tauri build --target x86_64-pc-windows-msvc
```

**Linux:**
```bash
npx tauri build --target x86_64-unknown-linux-gnu
```

---

## CI/CD 自动构建

### GitHub Actions 配置

项目已包含 `.github/workflows/build.yml`，支持：

**触发条件：**
- Push 到 `main` 或 `develop` 分支
- 创建版本标签（`v*.*.*`）
- 手动触发（workflow_dispatch）

**构建流程：**
1. 三平台并行构建（Windows、macOS、Linux）
2. 上传构建产物到 GitHub Actions Artifacts
3. 如果是版本标签，自动创建 GitHub Release

### 手动触发构建

1. 进入 GitHub 仓库 → Actions → Build Desktop App
2. 点击 "Run workflow"
3. 选择分支
4. 点击 "Run workflow"

### 发布新版本

**步骤 1：更新版本号**

编辑 `src-tauri/tauri.conf.json` 和 `package.json`：

```json
{
  "version": "1.1.0"
}
```

**步骤 2：创建 Git 标签**

```bash
git add .
git commit -m "chore: bump version to 1.1.0"
git tag v1.1.0
git push origin main --tags
```

**步骤 3：自动发布**

GitHub Actions 会自动：
- 构建三平台版本
- 创建 GitHub Release
- 上传安装包到 Release

### 配置自动更新

编辑 `src-tauri/tauri.conf.json`：

```json
{
  "plugins": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest/download/latest.json"
      ],
      "pubkey": "YOUR_PUBLIC_KEY"
    }
  }
}
```

**生成密钥对：**

```bash
npx tauri signer generate -w ~/.tauri/myapp.key
```

将公钥添加到配置，私钥用于签名 Release。

---

## 应用图标配置

### 准备图标

准备一个 **1024x1024** 的 PNG 图标文件（透明背景）。

### 生成多尺寸图标

```bash
npx tauri icon ./path/to/your-icon.png
```

这会自动生成：
- `icons/icon.png` (1024x1024)
- `icons/icon.ico` (Windows)
- `icons/icon.icns` (macOS)
- `icons/32x32.png`
- `icons/128x128.png`
- `icons/128x128@2x.png`
- 等等...

### 更新配置

编辑 `src-tauri/tauri.conf.json`：

```json
{
  "bundle": {
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

---

## 常见问题

### Q1: 构建时提示 "command not found: pnpm"

**解决方案：**

编辑 `src-tauri/tauri.conf.json`，将 `pnpm` 改为 `npm`：

```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  }
}
```

### Q2: 端口 1420 被占用

**解决方案：**

```bash
# 查找占用端口的进程
lsof -ti:1420

# 杀死进程
lsof -ti:1420 | xargs kill -9

# 或修改 vite.config.ts 中的端口
```

### Q3: macOS 上应用崩溃（app_delegate 错误）

**可能原因：**
- Tauri 版本兼容性问题
- WebView 初始化失败

**解决方案：**

1. 更新 Tauri 到最新版本：
   ```bash
   cargo update -p tauri
   ```

2. 检查 macOS 版本（需要 >= 10.15）

3. 尝试使用 `WebviewUrl::App` 而不是 `External`

4. 查看详细错误日志：
   ```bash
   RUST_BACKTRACE=1 npx tauri dev
   ```

### Q4: Linux 构建失败（缺少依赖）

**解决方案：**

安装缺失的依赖（见"环境要求"章节）。

检查缺失的库：
```bash
ldd src-tauri/target/release/your-app | grep "not found"
```

### Q5: WebView 无法加载网站

**可能原因：**
- CSP 配置过于严格
- 网站阻止了 WebView 访问

**解决方案：**

1. 放宽 CSP 配置（见"配置 CSP"章节）
2. 检查网站是否设置了 `X-Frame-Options` 或 CSP 阻止嵌入

### Q6: 自动更新不工作

**解决方案：**

1. 确保 GitHub Release 中包含 `latest.json`
2. 检查 `pubkey` 配置是否正确
3. 查看更新日志：
   ```bash
   RUST_LOG=debug npx tauri dev
   ```

---

## 平台特定说明

### macOS

**应用签名（可选）：**

如果需要分发到 Mac App Store 或通过 Gatekeeper：

1. 获取 Apple Developer 证书
2. 配置签名：
   ```bash
   export APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name (TEAM_ID)"
   npx tauri build
   ```

**公证（Notarization）：**

```bash
# 提交公证
xcrun notarytool submit src-tauri/target/release/bundle/macos/YourApp.app \
  --apple-id "your@email.com" \
  --password "app-specific-password" \
  --team-id "TEAM_ID"

# 订装结果
xcrun notarytool info YOUR_REQUEST_ID

# 订装
xcrun stapler staple src-tauri/target/release/bundle/macos/YourApp.app
```

### Windows

**代码签名（可选）：**

```bash
# 使用 signtool
signtool sign /f certificate.pfx /p password /tr http://timestamp.digicert.com /td sha256 /fd sha256 YourApp.exe
```

**创建便携版：**

NSIS 安装包已自动生成。如需便携版，可直接复制 `target/release/your-app.exe`。

### Linux

**AppImage 使用说明：**

```bash
# 赋予执行权限
chmod +x YourApp.AppImage

# 运行
./YourApp.AppImage
```

**DEB 包安装：**

```bash
sudo dpkg -i your-app.deb
```

**RPM 包安装：**

```bash
sudo rpm -i your-app.rpm
```

**桌面集成：**

安装后会自动创建 `.desktop` 文件，可在应用菜单中找到。

---

## 构建产物清单

### macOS

- `YourApp.app` - 应用程序包
- `YourApp.dmg` - DMG 安装包

### Windows

- `YourApp_x64_en-US.msi` - MSI 安装包
- `YourApp_x64_en-US.exe` - NSIS 安装包
- `YourApp.exe` - 可执行文件（便携版）

### Linux

- `YourApp.AppImage` - 通用格式（无需安装）
- `your-app_1.0.0_amd64.deb` - Debian/Ubuntu 包
- `your-app-1.0.0-1.x86_64.rpm` - Fedora/RHEL 包

---

## 性能优化

### 减小包体积

1. 启用代码压缩（默认已启用）
2. 移除不必要的依赖
3. 使用 `strip` 命令去除调试符号：
   ```bash
   strip src-tauri/target/release/your-app
   ```

### 优化启动速度

1. 使用 `WebviewUrl::App` 加载本地页面作为启动画面
2. 异步加载远程内容
3. 预加载关键资源

---

## 安全建议

1. **定期更新依赖**
   ```bash
   npm audit fix
   cargo update
   ```

2. **使用 HTTPS** - 确保网站 URL 使用 HTTPS

3. **配置严格的 CSP** - 只允许必要的域名和资源类型

4. **验证外部链接** - 在 `config.rs` 中配置 `allowed_domains`

5. **代码签名** - 生产环境建议对应用进行签名

---

## 支持资源

- [Tauri 官方文档](https://tauri.app/)
- [Tauri API 文档](https://docs.rs/tauri/)
- [Tauri GitHub](https://github.com/tauri-apps/tauri)
- [项目 README](./README.md)

---

**最后更新**: 2026-06-16
**版本**: 1.0.0
