use crate::config::AppConfig;
use crate::updater;
use tauri::AppHandle;
use serde::Serialize;
use tauri_plugin_shell::ShellExt;

#[derive(Serialize)]
pub struct ConfigResponse {
    pub website_url: String,
    pub window_title: String,
    pub enable_tray: bool,
    pub enable_auto_update: bool,
}

/// Get application configuration
#[tauri::command]
pub fn get_config() -> ConfigResponse {
    let config = AppConfig::default();
    ConfigResponse {
        website_url: config.website_url,
        window_title: config.window_title,
        enable_tray: config.enable_tray,
        enable_auto_update: config.enable_auto_update,
    }
}

/// Check for application updates
#[tauri::command]
pub async fn check_update(app: tauri::AppHandle) -> Result<Option<String>, String> {
    updater::check_for_updates(&app).await
}

/// Open a URL in the system default browser
#[tauri::command]
pub fn open_external(app: tauri::AppHandle, url: String) -> Result<(), String> {
    let shell = app.shell();
    shell.open(&url, None).map_err(|e| e.to_string())
}

/// Minimize the main window to system tray
#[tauri::command]
pub fn minimize_to_tray(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Manager;
    if let Some(window) = app.get_webview_window("main") {
        window.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}
