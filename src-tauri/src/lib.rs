mod commands;
mod config;
mod menu;
mod settings;
mod tray;
mod updater;
mod window;

use menu::handle_menu_event;
use settings::AppSettings;
use std::sync::Mutex;
use tauri::{Emitter, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(move |app| {
            let app_handle = app.handle().clone();

            // Load settings from file
            let settings = AppSettings::load(app.handle());

            // Store settings in app state for commands to access
            app.handle().manage(Mutex::new(settings.clone()));

            // Create the main window with settings
            let _window = window::create_main_window(app.handle(), &settings)?;

            // Create application menu
            let menu = menu::create_menu(app.handle())?;
            app.set_menu(menu)?;

            // Wire up menu events
            let menu_handle = app_handle.clone();
            app.on_menu_event(move |_app, event| {
                let id = event.id().as_ref();
                eprintln!("[menu] Event fired: id='{}'", id);
                if id == "open_settings" {
                    commands::PENDING_OPEN_SETTINGS.store(true, std::sync::atomic::Ordering::SeqCst);
                    eprintln!("[menu] Set PENDING_OPEN_SETTINGS = true");
                } else {
                    handle_menu_event(&menu_handle, id);
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_settings,
            commands::save_and_close,
            commands::check_update,
            commands::open_external,
            commands::minimize_to_tray,
            commands::ping,
            commands::check_pending_action,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
