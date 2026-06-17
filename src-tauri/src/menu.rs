use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem, Submenu},
    AppHandle, Manager, Runtime,
};
use tauri_plugin_shell::ShellExt;

/// Create the application menu (platform-aware)
pub fn create_menu<R: Runtime>(app: &AppHandle<R>) -> Result<Menu<R>, tauri::Error> {
    // File menu
    let file_menu = Submenu::with_items(
        app,
        "File",
        true,
        &[
            &MenuItem::with_id(app, "close", "Close Window", true, Some("CmdOrCtrl+W"))?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(
                app,
                "exit",
                if cfg!(target_os = "macos") { "Quit" } else { "Exit" },
                true,
                if cfg!(target_os = "macos") { Some("CmdOrCtrl+Q") } else { None::<&str> },
            )?,
        ],
    )?;

    // Edit menu
    let edit_menu = Submenu::with_items(
        app,
        "Edit",
        true,
        &[
            &PredefinedMenuItem::undo(app, None)?,
            &PredefinedMenuItem::redo(app, None)?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::cut(app, None)?,
            &PredefinedMenuItem::copy(app, None)?,
            &PredefinedMenuItem::paste(app, None)?,
            &PredefinedMenuItem::select_all(app, None)?,
        ],
    )?;

    // View menu
    let view_menu = Submenu::with_items(
        app,
        "View",
        true,
        &[
            &MenuItem::with_id(
                app,
                "reload",
                "Reload",
                true,
                if cfg!(target_os = "macos") { Some("CmdOrCtrl+R") } else { Some("F5") },
            )?,
            &MenuItem::with_id(
                app,
                "force_reload",
                "Force Reload",
                true,
                if cfg!(target_os = "macos") { Some("CmdOrCtrl+Shift+R") } else { Some("Ctrl+F5") },
            )?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "zoom_in", "Zoom In", true, Some("CmdOrCtrl+="))?,
            &MenuItem::with_id(app, "zoom_out", "Zoom Out", true, Some("CmdOrCtrl+-"))?,
            &MenuItem::with_id(app, "zoom_reset", "Reset Zoom", true, Some("CmdOrCtrl+0"))?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(
                app,
                "toggle_devtools",
                "Toggle Developer Tools",
                true,
                if cfg!(target_os = "macos") { Some("CmdOrCtrl+Option+I") } else { Some("F12") },
            )?,
        ],
    )?;

    // Help menu
    let help_menu = Submenu::with_items(
        app,
        "Help",
        true,
        &[
            &MenuItem::with_id(app, "visit_website", "Visit Website", true, None::<&str>)?,
            &MenuItem::with_id(app, "report_issue", "Report Issue", true, None::<&str>)?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "about", "About", true, None::<&str>)?,
        ],
    )?;

    // Build the menu based on platform
    #[cfg(target_os = "macos")]
    {
        let app_submenu = Submenu::with_items(
            app,
            "App",
            true,
            &[
                &MenuItem::with_id(app, "about_mac", "About", true, None::<&str>)?,
                &PredefinedMenuItem::separator(app)?,
                &MenuItem::with_id(app, "check_updates", "Check for Updates...", true, None::<&str>)?,
                &PredefinedMenuItem::separator(app)?,
                &PredefinedMenuItem::hide(app, None)?,
                &PredefinedMenuItem::hide_others(app, None)?,
                &PredefinedMenuItem::show_all(app, None)?,
                &PredefinedMenuItem::separator(app)?,
                &MenuItem::with_id(app, "quit_mac", "Quit", true, Some("CmdOrCtrl+Q"))?,
            ],
        )?;

        let window_menu = Submenu::with_items(
            app,
            "Window",
            true,
            &[
                &PredefinedMenuItem::minimize(app, None)?,
                &PredefinedMenuItem::maximize(app, None)?,
                &PredefinedMenuItem::separator(app)?,
                &MenuItem::with_id(app, "bring_to_front", "Bring All to Front", true, None::<&str>)?,
            ],
        )?;

        return Menu::with_items(
            app,
            &[
                &app_submenu,
                &file_menu,
                &edit_menu,
                &view_menu,
                &window_menu,
                &help_menu,
            ],
        );
    }

    #[cfg(not(target_os = "macos"))]
    {
        return Menu::with_items(app, &[&file_menu, &edit_menu, &view_menu, &help_menu]);
    }
}

/// Handle menu events
pub fn handle_menu_event(app: &AppHandle, event_id: &str) {
    match event_id {
        "close" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.close();
            }
        }
        "exit" | "quit_mac" => {
            app.exit(0);
        }
        "reload" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.eval("window.location.reload()");
            }
        }
        "force_reload" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.eval("window.location.reload(true)");
            }
        }
        "zoom_in" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.eval("document.body.style.zoom = (parseFloat(document.body.style.zoom || 1) + 0.1).toString()");
            }
        }
        "zoom_out" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.eval("document.body.style.zoom = Math.max(0.3, (parseFloat(document.body.style.zoom || 1) - 0.1)).toString()");
            }
        }
        "zoom_reset" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.eval("document.body.style.zoom = '1'");
            }
        }
        "toggle_devtools" => {
            if let Some(window) = app.get_webview_window("main") {
                if window.is_devtools_open() {
                    window.close_devtools();
                } else {
                    window.open_devtools();
                }
            }
        }
        "visit_website" => {
            let shell = app.shell();
            let _ = shell.open("https://your-website-url.com", None);
        }
        "report_issue" => {
            let shell = app.shell();
            let _ = shell.open("https://github.com/your-repo/issues", None);
        }
        _ => {}
    }
}
