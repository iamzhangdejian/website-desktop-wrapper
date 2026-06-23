use crate::settings::AppSettings;
use tauri::{AppHandle, WebviewUrl, WebviewWindowBuilder};

/// Create the main application window.
pub fn create_main_window(app: &AppHandle, _settings: &AppSettings) -> Result<(), tauri::Error> {
    let _window = WebviewWindowBuilder::new(
        app,
        "main",
        WebviewUrl::App("/".into()),
    )
    .title("SRIT Desktop")
    .inner_size(_settings.window_width, _settings.window_height)
    .min_inner_size(_settings.min_width, _settings.min_height)
    .resizable(true)
    .fullscreen(false)
    .build()?;

    Ok(())
}
