#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().add_connection(
            "sqlite:notes.db".to_string(),
            true,
        ))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
