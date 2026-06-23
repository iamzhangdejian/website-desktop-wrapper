use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

/// Application settings stored in a JSON file
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    /// Website URL to load in the WebView
    pub website_url: String,
    /// Window width
    pub window_width: f64,
    /// Window height
    pub window_height: f64,
    /// Minimum window width
    pub min_width: f64,
    /// Minimum window height
    pub min_height: f64,
    /// Enable system tray
    pub enable_tray: bool,
    /// Enable desktop notifications
    pub enable_notifications: bool,
    /// Allowed domains for in-app navigation
    pub allowed_domains: Vec<String>,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            website_url: "https://work.sritcloud.com:3100/oa-office/#/pages/login/index".to_string(),
            window_width: 1280.0,
            window_height: 800.0,
            min_width: 375.0,
            min_height: 667.0,
            enable_tray: true,
            enable_notifications: true,
            allowed_domains: vec![
                "work.sritcloud.com".to_string(),
                "sritcloud.com".to_string(),
            ],
        }
    }
}

impl AppSettings {
    /// Get the path to the settings file
    fn settings_path(app: &AppHandle) -> Option<PathBuf> {
        app.path()
            .app_config_dir()
            .ok()
            .map(|p| p.join("settings.json"))
    }

    /// Load settings from file, or return defaults if file doesn't exist
    pub fn load(app: &AppHandle) -> Self {
        let path = match Self::settings_path(app) {
            Some(p) => p,
            None => return Self::default(),
        };

        match fs::read_to_string(&path) {
            Ok(content) => serde_json::from_str(&content).unwrap_or_default(),
            Err(_) => Self::default(),
        }
    }

    /// Save settings to file
    pub fn save(&self, app: &AppHandle) -> Result<(), String> {
        let path = Self::settings_path(app)
            .ok_or_else(|| "Failed to resolve config directory".to_string())?;

        // Create directory if it doesn't exist
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create config directory: {}", e))?;
        }

        let content =
            serde_json::to_string_pretty(self).map_err(|e| format!("Failed to serialize: {}", e))?;

        fs::write(&path, content).map_err(|e| format!("Failed to write settings: {}", e))
    }
}
