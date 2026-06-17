use tauri::{
    image::Image,
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState},
    AppHandle, Manager,
};

/// Create the system tray icon and menu
pub fn create_tray(app: &AppHandle) -> Result<(), tauri::Error> {
    // Create tray menu items
    let show_item = MenuItem::with_id(app, "show", "Show Window", true, None::<&str>)?;
    let separator = MenuItem::with_id(app, "separator", "─", false, None::<&str>)?;
    let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

    // Build the tray menu
    let tray_menu = Menu::with_items(app, &[&show_item, &separator, &quit_item])?;

    // Load the icon - use the placeholder icon bytes
    // Image::new expects RGBA pixel data, width, and height
    // For a PNG file, we need to decode it first or use raw RGBA data
    // Using a simple 1x1 transparent pixel as fallback
    let icon = Image::new(&[0, 0, 0, 0], 1, 1);

    // Build the tray icon
    TrayIconBuilder::new()
        .tooltip("Website Desktop Wrapper")
        .icon(icon)
        .menu(&tray_menu)
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .on_menu_event({
            let app_handle = app.clone();
            move |_app, event| {
                match event.id().as_ref() {
                    "show" => {
                        if let Some(window) = app_handle.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        app_handle.exit(0);
                    }
                    _ => {}
                }
            }
        })
        .build(app)?;

    Ok(())
}
