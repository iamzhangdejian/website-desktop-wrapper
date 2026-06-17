use crate::config::AppConfig;
use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

/// Create the main application window that loads the website URL
pub fn create_main_window(app: &AppHandle, config: &AppConfig) -> Result<(), tauri::Error> {
    // Parse the URL string into a url::Url
    let url = url::Url::parse(&config.website_url)
        .expect("Invalid website URL in configuration");

    let window = WebviewWindowBuilder::new(app, "main", WebviewUrl::External(url))
        .title(&config.window_title)
        .inner_size(config.window_width, config.window_height)
        .min_inner_size(config.min_width, config.min_height)
        .resizable(true)
        .fullscreen(false)
        .build()?;

    // Note: Tauri 2.0 doesn't have on_navigation callback
    // External link handling should be done via JavaScript injection or CSP
    // For now, we'll rely on the website's own link handling

    Ok(())
}
