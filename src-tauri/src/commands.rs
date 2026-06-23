use crate::settings::AppSettings;
use crate::updater;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;
use tauri::{AppHandle, Manager};
use tauri_plugin_shell::ShellExt;

// Shared flag for menu → frontend communication
pub static PENDING_OPEN_SETTINGS: AtomicBool = AtomicBool::new(false);

/// Check if settings should be opened (polled by frontend).
/// Returns true once after menu triggers it, then resets to false.
#[tauri::command]
pub fn check_pending_action() -> bool {
    PENDING_OPEN_SETTINGS.swap(false, Ordering::SeqCst)
}

/// Get current application settings
#[tauri::command]
pub fn get_settings(app: AppHandle) -> AppSettings {
    let settings = app.state::<Mutex<AppSettings>>();
    let guard = settings.lock().unwrap();
    guard.clone()
}

/// Save application settings to file and update in-memory state.
/// The React app handles closing the settings modal and reloading the iframe.
#[tauri::command]
pub fn save_and_close(
    app: AppHandle,
    new_settings: AppSettings,
) -> Result<String, String> {
    eprintln!("[save_and_close] Called!");

    new_settings.save(&app).map_err(|e| {
        eprintln!("[save_and_close] Save error: {}", e);
        format!("Save error: {}", e)
    })?;

    let settings = app.state::<Mutex<AppSettings>>();
    *settings.lock().unwrap() = new_settings.clone();

    eprintln!("[save_and_close] Settings saved: {}", new_settings.website_url);

    Ok("Settings saved successfully".to_string())
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
    if let Some(window) = app.get_webview_window("main") {
        window.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Debug: test if invoke works
#[tauri::command]
pub fn ping() -> String {
    "pong from Rust".to_string()
}
