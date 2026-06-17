use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    /// The website URL to load in the WebView
    pub website_url: String,
    /// Window title
    pub window_title: String,
    /// Default window width
    pub window_width: f64,
    /// Default window height
    pub window_height: f64,
    /// Minimum window width
    pub min_width: f64,
    /// Minimum window height
    pub min_height: f64,
    /// Enable system tray
    pub enable_tray: bool,
    /// Enable auto-update
    pub enable_auto_update: bool,
    /// Allowed domains for in-app navigation (others open in system browser)
    pub allowed_domains: Vec<String>,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            website_url: std::env::var("WEBSITE_URL")
                .unwrap_or_else(|_| "https://work.sritcloud.com:3100/oa-office/#/pages/login/index".to_string()),
            window_title: "国研数字".to_string(),
            window_width: 1280.0,
            window_height: 800.0,
            min_width: 375.0,
            min_height: 667.0,
            enable_tray: true,
            enable_auto_update: true,
            allowed_domains: vec![
                "work.sritcloud.com".to_string(),
                "sritcloud.com".to_string(),
            ],
        }
    }
}

impl AppConfig {
    /// Check if a URL is an internal link (should navigate in-app)
    pub fn is_internal_url(&self, url: &str) -> bool {
        if let Ok(parsed) = url::Url::parse(url) {
            if let Some(host) = parsed.host_str() {
                return self.allowed_domains.iter().any(|domain| {
                    host == domain || host.ends_with(&format!(".{}", domain))
                });
            }
        }
        false
    }
}
