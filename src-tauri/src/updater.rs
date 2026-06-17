use tauri::AppHandle;
use tauri_plugin_updater::UpdaterExt;

/// Check for application updates
pub async fn check_for_updates(app: &AppHandle) -> Result<Option<String>, String> {
    let updater = app.updater().map_err(|e| e.to_string())?;

    match updater.check().await {
        Ok(Some(update)) => {
            // Update available
            let version = update.version.clone();

            // Download and install
            let mut downloaded = 0;
            update
                .download_and_install(
                    |chunk_length, content_length| {
                        downloaded += chunk_length;
                        let total = content_length.unwrap_or(0);
                        let progress = if total > 0 {
                            (downloaded as f64 / total as f64) * 100.0
                        } else {
                            0.0
                        };
                        println!("Download progress: {:.1}%", progress);
                    },
                    || {
                        println!("Download finished, installing...");
                    },
                )
                .await
                .map_err(|e| e.to_string())?;

            Ok(Some(version))
        }
        Ok(None) => {
            // No update available
            Ok(None)
        }
        Err(e) => Err(format!("Update check failed: {}", e)),
    }
}
