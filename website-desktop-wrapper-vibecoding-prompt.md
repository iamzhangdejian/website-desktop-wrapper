# Website Desktop Wrapper — 跨平台桌面应用 VibeCoding 完整提示词


````markdown
# Website Desktop Wrapper — 跨平台桌面应用开发提示词

你是一名资深的 Tauri 2.0 桌面应用开发专家、Rust 工程师、跨平台构建专家。

请为我开发一个：

# Website Desktop Wrapper

基于现有网站的通用跨平台桌面应用程序包装器。

## 项目背景

我有一个已完成的响应式网站系统，部署在线上。网站已实现完整的响应式布局，支持桌面端、平板、手机端浏览器正常运行。

现在需要将该网站包装为原生桌面应用程序，提供更好的桌面用户体验。

---

# 一、核心技术要求

## 技术栈

必须采用：

- **Tauri 2.0**（稳定版）
- **Rust**（后端逻辑）
- **TypeScript**（前端逻辑）
- **Vite**（前端构建工具）
- **React 18**（前端框架，用于加载/错误页面）

要求：

- 轻量化（包体积 < 15MB）
- 高性能启动
- 使用系统 WebView（不捆绑 Chromium）
- 跨平台兼容（Windows / macOS / Linux）
- 原生桌面体验

---

## 禁止使用

- Electron（包体积过大）
- NW.js
- 任何捆绑 Chromium 的方案
- Java / C++ 重型框架

---

# 二、功能需求

## 2.1 核心功能

### 窗口管理

- 默认窗口尺寸：1280 x 800
- 最小窗口尺寸：800 x 600
- 窗口标题：通过配置文件指定
- 窗口图标：提供多尺寸图标（16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024）
- 支持窗口最小化、最大化、关闭
- 支持窗口拖动（如果使用自定义标题栏）
- 记住窗口位置和大小（可选，通过配置文件控制）

### WebView 配置

- 加载目标 URL：通过配置文件指定
- 默认生产环境 URL：`YOUR_WEBSITE_URL`
- 默认开发环境 URL：http://localhost:3000
- 启用 JavaScript
- 启用本地存储（localStorage, sessionStorage）
- 启用剪贴板访问
- 启用文件上传
- 配置 CSP（内容安全策略）

### 导航控制

- 拦截外部链接（非本站域名），使用系统默认浏览器打开
- 内部链接在应用内导航
- 支持前进、后退导航
- 支持刷新页面

### 加载状态

- 显示加载动画/进度指示器
- 加载超时处理（10秒超时提示）
- 网络错误提示页面
- 离线状态检测与提示

---

## 2.2 系统集成功能

### 系统托盘（System Tray）

- 显示托盘图标
- 托盘右键菜单：
  - 显示/隐藏窗口
  - 分隔线
  - 退出应用
- 支持最小化到托盘
- 关闭窗口时最小化到托盘（可配置）

### 应用菜单

**macOS 菜单：**
```
[App Name]
├── About [App Name]
├── Check for Updates...
├── ---
├── Services
├── ---
├── Hide [App Name]
├── Hide Others
├── Show All
├── ---
├── Quit [App Name]

File
├── Close Window (Cmd+W)

Edit
├── Undo (Cmd+Z)
├── Redo (Cmd+Shift+Z)
├── ---
├── Cut (Cmd+X)
├── Copy (Cmd+C)
├── Paste (Cmd+V)
├── Select All (Cmd+A)

View
├── Reload (Cmd+R)
├── Force Reload (Cmd+Shift+R)
├── ---
├── Zoom In (Cmd+=)
├── Zoom Out (Cmd+-)
├── Reset Zoom (Cmd+0)
├── ---
├── Toggle Developer Tools (Cmd+Option+I)

Window
├── Minimize (Cmd+M)
├── Zoom
├── ---
├── Bring All to Front

Help
├── Visit Website
├── Report Issue
├── ---
├── About
```

**Windows/Linux 菜单：**
```
File
├── Exit (Alt+F4)

Edit
├── Undo (Ctrl+Z)
├── Redo (Ctrl+Y)
├── ---
├── Cut (Ctrl+X)
├── Copy (Ctrl+C)
├── Paste (Ctrl+V)
├── Select All (Ctrl+A)

View
├── Reload (Ctrl+R / F5)
├── Force Reload (Ctrl+Shift+R / Ctrl+F5)
├── ---
├── Zoom In (Ctrl+=)
├── Zoom Out (Ctrl+-)
├── Reset Zoom (Ctrl+0)
├── ---
├── Toggle Developer Tools (F12 / Ctrl+Shift+I)

Help
├── Visit Website
├── Report Issue
├── ---
├── About
```

### 全局快捷键

- `Cmd/Ctrl + Shift + H`：显示/隐藏窗口
- 其他快捷键通过应用菜单定义

### 自动更新

- 检查更新机制（启动时 + 手动检查）
- 下载更新进度显示
- 更新提示对话框
- 支持静默更新或提示后更新
- 更新源：GitHub Releases

---

## 2.3 平台特定功能

### Windows

- 支持 Windows 10/11
- NSIS 安装包
- 便携版（无需安装）
- 任务栏图标
- Jump List（可选）
- 单实例运行（防止多开）

### macOS

- 支持 macOS 10.15+
- DMG 安装包
- 支持 Universal Binary（Intel + Apple Silicon）
- Dock 图标
- 应用签名支持（可选，需要开发者证书）
- Notarization 支持（可选）
- 单实例运行

### Linux

- 支持主流桌面发行版（Ubuntu 20.04+, Fedora 35+, Debian 11+）
- AppImage（通用格式）
- deb 包（Debian/Ubuntu）
- rpm 包（Fedora/RHEL）
- 桌面集成（.desktop 文件）
- 系统托盘图标（需要 libayatana-appindicator）
- 单实例运行

---

# 三、项目结构要求

请生成以下完整目录结构：

```
website-desktop-wrapper/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs              # 应用入口
│   │   ├── lib.rs               # 库文件
│   │   ├── config.rs            # 配置管理
│   │   ├── window.rs            # 窗口管理
│   │   ├── tray.rs              # 系统托盘
│   │   ├── menu.rs              # 应用菜单
│   │   ├── updater.rs           # 自动更新
│   │   └── commands.rs          # Tauri 命令
│   ├── icons/
│   │   ├── icon.png             # 1024x1024 源图标
│   │   ├── icon.ico             # Windows 图标
│   │   ├── icon.icns            # macOS 图标
│   │   ├── 32x32.png
│   │   ├── 128x128.png
│   │   └── ...
│   ├── templates/
│   │   └── info.plist           # macOS 配置模板
│   ├── Cargo.toml
│   ├── tauri.conf.json          # Tauri 配置
│   ├── build.rs                 # 构建脚本
│   └── capabilities/
│       └── default.json         # 权限配置
├── src/
│   ├── App.tsx                  # React 应用
│   ├── main.tsx                 # 前端入口
│   ├── components/
│   │   ├── LoadingScreen.tsx    # 加载页面
│   │   ├── OfflinePage.tsx      # 离线页面
│   │   └── ErrorPage.tsx        # 错误页面
│   ├── styles/
│   │   └── global.css           # 全局样式
│   └── vite-env.d.ts
├── public/
│   └── ...
├── .github/
│   └── workflows/
│       └── build.yml            # GitHub Actions 构建
├── scripts/
│   ├── build-windows.sh
│   ├── build-macos.sh
│   └── build-linux.sh
├── .gitignore
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts           # 如果使用 Tailwind
├── postcss.config.js
└── README.md
```

---

# 四、配置文件要求

## 4.1 tauri.conf.json

请生成完整的 Tauri 配置，包括：

- 应用标识符：`YOUR_APP_IDENTIFIER`
- 产品名称：`YOUR_APP_NAME`
- 版本号：从 package.json 读取
- 窗口配置
- 安全配置（CSP）
- 打包配置
- 更新配置
- 系统托盘配置

## 4.2 Cargo.toml

Rust 依赖配置，包括：

- tauri 2.0
- tauri-plugin-shell
- tauri-plugin-http（如果需要）
- serde / serde_json
- tokio（异步运行时）
- 其他必要依赖

## 4.3 package.json

前端依赖配置，包括：

- @tauri-apps/api
- @tauri-apps/plugin-*（需要的插件）
- react / react-dom
- vite
- typescript
- tailwindcss（可选）

---

# 五、代码实现要求

## 5.1 Rust 后端（src-tauri/src/）

### main.rs

```rust
// 应用入口
// - 初始化 Tauri 应用
// - 注册插件
// - 设置菜单
// - 设置托盘
// - 注册命令
// - 运行应用
```

### config.rs

```rust
// 配置管理
// - 定义配置结构体
// - 从配置文件/环境变量读取配置
// - 提供默认值
// - 配置项：
//   - website_url: String
//   - window_title: String
//   - window_width: f64
//   - window_height: f64
//   - min_width: f64
//   - min_height: f64
//   - enable_tray: bool
//   - enable_auto_update: bool
//   - allowed_domains: Vec<String>
```

### window.rs

```rust
// 窗口管理
// - 创建主窗口
// - 窗口事件处理
// - 窗口状态管理
// - 外部链接处理（使用系统浏览器打开）
```

### tray.rs

```rust
// 系统托盘
// - 创建托盘图标
// - 托盘菜单
// - 托盘事件处理
// - 显示/隐藏窗口
```

### menu.rs

```rust
// 应用菜单
// - 创建菜单（区分平台）
// - 菜单事件处理
// - 快捷键绑定
```

### updater.rs

```rust
// 自动更新
// - 检查更新
// - 下载更新
// - 安装更新
// - 更新提示
```

### commands.rs

```rust
// Tauri 命令
// - 供前端调用的命令
// - get_config: 获取配置
// - check_update: 检查更新
// - open_external: 打开外部链接
// - minimize_to_tray: 最小化到托盘
```

## 5.2 前端（src/）

### 加载页面（LoadingScreen.tsx）

- 简洁优雅的加载动画
- 加载进度提示
- 支持暗黑模式
- 可自定义配色

### 离线页面（OfflinePage.tsx）

- 友好的离线提示
- 重试按钮
- 网络状态检测

### 错误页面（ErrorPage.tsx）

- 错误信息展示
- 返回首页按钮
- 报告问题按钮

---

# 六、构建与打包要求

## 6.1 开发环境

```bash
# 开发模式
pnpm tauri dev

# 或
npm run tauri dev
```

## 6.2 构建命令

### Windows

```bash
# NSIS 安装包
pnpm tauri build --target x86_64-pc-windows-msvc

# 便携版
pnpm tauri build --target x86_64-pc-windows-msvc -- --bundles nsis
```

### macOS

```bash
# Universal Binary (Intel + Apple Silicon)
pnpm tauri build --target universal-apple-darwin

# 仅 Apple Silicon
pnpm tauri build --target aarch64-apple-darwin

# 仅 Intel
pnpm tauri build --target x86_64-apple-darwin
```

### Linux

```bash
# AppImage
pnpm tauri build --target x86_64-unknown-linux-gnu -- --bundles appimage

# deb 包
pnpm tauri build --target x86_64-unknown-linux-gnu -- --bundles deb

# rpm 包
pnpm tauri build --target x86_64-unknown-linux-gnu -- --bundles rpm
```

## 6.3 GitHub Actions 工作流

请生成 `.github/workflows/build.yml`，实现：

- 触发条件：
  - Push 到 main 分支
  - 创建 Release 标签（v*.*.*）
  - 手动触发
- 三平台并行构建：
  - Windows (windows-latest)
  - macOS (macos-latest)
  - Linux (ubuntu-latest)
- 构建产物上传：
  - 开发版本：Artifacts
  - Release 版本：GitHub Releases
- 版本号自动管理

---

# 七、安全要求

## CSP 配置

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: https:;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://*.your-domain.com wss://*.your-domain.com;
frame-src 'none';
object-src 'none';
base-uri 'self';
```

根据实际情况调整域名。

## 权限控制

- 仅授予必要的 Tauri 权限
- 禁用不必要的 API
- 配置文件权限

---

# 八、UI/UX 设计要求

## 配色方案

- 支持暗黑模式
- 配色可配置
- 加载动画简洁优雅

## 图标设计

- 提供图标生成说明
- 支持多平台格式

---

# 九、测试要求

## 功能测试

- 窗口正常显示
- 网页正常加载
- 外部链接正确处理
- 系统托盘正常工作
- 菜单功能正常
- 快捷键正常
- 自动更新正常

## 平台测试

- Windows 10/11 测试
- macOS 10.15+ 测试
- Linux 主流发行版测试

---

# 十、文档要求

请生成完整的 README.md，包括：

## 内容结构

1. 项目介绍
2. 功能特性
3. 系统要求
4. 快速开始
5. 安装方法
   - Windows
   - macOS
   - Linux
6. 开发指南
   - 环境准备
   - 安装依赖
   - 开发模式
   - 构建打包
7. 配置说明
   - 修改网站 URL
   - 修改窗口配置
   - 修改应用图标
   - 修改应用名称
8. CI/CD 说明
9. 自定义指南
10. 常见问题
11. 许可证

---

# 十一、输出顺序要求

请按以下顺序生成代码：

1. **项目初始化**
   - 目录结构
   - package.json
   - Cargo.toml
   - 配置文件

2. **Rust 后端核心**
   - main.rs
   - config.rs
   - window.rs

3. **前端基础**
   - 加载页面
   - 离线页面
   - 错误页面

4. **系统集成功能**
   - 系统托盘
   - 应用菜单
   - 导航控制

5. **高级功能**
   - 自动更新
   - 外部链接处理
   - 快捷键

6. **构建配置**
   - tauri.conf.json
   - 图标配置
   - 平台特定配置

7. **CI/CD**
   - GitHub Actions 工作流
   - 构建脚本

8. **文档**
   - README.md
   - 开发文档
   - 部署文档

---

# 十二、最终要求

1. **输出完整代码**
   - 不允许伪代码
   - 不允许省略
   - 保证可运行

2. **代码质量**
   - 类型安全
   - 错误处理完善
   - 注释清晰
   - 符合 Rust/TypeScript 最佳实践

3. **性能优化**
   - 快速启动
   - 低内存占用
   - 平滑动画

4. **用户体验**
   - 原生桌面体验
   - 流畅交互
   - 友好错误提示

---

# 开始实现

请先生成：

1. 完整的项目目录结构
2. 核心配置文件（tauri.conf.json, Cargo.toml, package.json）
3. 主窗口创建代码
4. 基础加载页面

然后逐步实现其他功能。

每一步都输出完整代码，保证可以直接复制运行。

开始吧！
````

---

## 补充说明

### 应用图标准备

你需要准备一个 **1024x1024** 的应用图标（PNG 格式），Tauri 会自动生成各平台所需的图标格式：

```bash
# 安装图标生成工具
pnpm add -D @tauri-apps/cli

# 生成图标（需要 1024x1024 的 PNG）
pnpm tauri icon ./path/to/your-icon.png
```

### 网站 URL 配置

开发时可以通过环境变量切换 URL：

```bash
# .env.development
VITE_WEBSITE_URL=http://localhost:3000

# .env.production
VITE_WEBSITE_URL=https://your-production-domain.com
```

### 自动更新配置

自动更新需要配置 GitHub Releases：

1. 创建 GitHub 仓库
2. 发布 Release 时附带构建产物
3. Tauri 会自动检查更新

### 自定义清单

| 配置项 | 位置 | 说明 |
|--------|------|------|
| 网站 URL | `.env` / `tauri.conf.json` | 目标网站地址 |
| 应用名称 | `tauri.conf.json` | 显示在标题栏、菜单等位置 |
| 应用标识符 | `tauri.conf.json` | 唯一标识，如 `com.example.myapp` |
| 窗口尺寸 | `tauri.conf.json` | 默认/最小窗口大小 |
| 应用图标 | `src-tauri/icons/` | 各平台图标文件 |
| CSP 策略 | `tauri.conf.json` | 内容安全策略 |
| 更新地址 | `tauri.conf.json` | GitHub Releases 地址 |

---

## 平台构建依赖

### Windows

- [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)（C++ 组件）
- WebView2（Windows 10/11 已内置）

### macOS

- Xcode Command Line Tools：`xcode-select --install`
- WebKit（系统内置）

### Linux

```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

# Fedora
sudo dnf install webkit2gtk4.1-devel \
    openssl-devel \
    curl \
    wget \
    file \
    libappindicator-gtk3-devel \
    librsvg2-devel

# Arch
sudo pacman -S webkit2gtk-4.1 \
    base-devel \
    curl \
    wget \
    file \
    libappindicator-gtk3 \
    librsvg
```
