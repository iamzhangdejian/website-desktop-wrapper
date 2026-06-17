mod commands;
mod config;
mod menu;
mod tray;
mod updater;
mod window;

use config::AppConfig;
use menu::handle_menu_event;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let config = AppConfig::default();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        // .plugin(tauri_plugin_updater::Builder::new().build()) // Disabled for dev mode
        .setup(move |app| {
            let app_handle = app.handle().clone();

            // Create the main window
            let _window = window::create_main_window(app.handle(), &config)?;

            // Create system tray
            if config.enable_tray {
                // Temporarily disabled for testing
                // let _tray = tray::create_tray(app.handle())?;
            }

            // Create application menu
            // Temporarily disabled for testing
            // let menu = menu::create_menu(app.handle())?;
            // app.set_menu(menu)?;

            // Wire up menu events
            let menu_handle = app_handle.clone();
            app.on_menu_event(move |_app, event| {
                handle_menu_event(&menu_handle, event.id().as_ref());
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_config,
            commands::check_update,
            commands::open_external,
            commands::minimize_to_tray,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
