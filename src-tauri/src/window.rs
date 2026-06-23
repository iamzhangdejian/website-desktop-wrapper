use crate::settings::AppSettings;
use tauri::{AppHandle, WebviewUrl, WebviewWindowBuilder};

/// Create the main application window.
/// Loads launcher.html which has iframe + settings panel built in (vanilla HTML, no React).
pub fn create_main_window(app: &AppHandle, _settings: &AppSettings) -> Result<(), tauri::Error> {
    let _window = WebviewWindowBuilder::new(
        app,
        "main",
        WebviewUrl::App("/launcher.html".into()),
    )
    .title("SRIT Desktop")
    .inner_size(_settings.window_width, _settings.window_height)
    .min_inner_size(_settings.min_width, _settings.min_height)
    .resizable(true)
    .fullscreen(false)
    .build()?;

    Ok(())
}
