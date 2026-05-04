use std::collections::HashMap;
use std::path::PathBuf;
use std::process::{Child, Command};
use std::sync::Mutex;
use std::time::Instant;

use rusqlite::{params, Connection};
use serde::Deserialize;
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Manager, State};

#[derive(Default)]
struct RuntimeState {
    children: Mutex<HashMap<String, Child>>,
}

#[derive(Deserialize, Clone)]
struct GamePayload {
    id: String,
    name: String,
    command: String,
    args: String,
    env: String,
    hotkey: String,
}

fn db_path(app: &AppHandle) -> PathBuf {
    app.path().app_data_dir().expect("app dir").join("asobi.sqlite")
}

fn open_db(app: &AppHandle) -> Result<Connection, String> {
    let path = db_path(app);
    std::fs::create_dir_all(path.parent().ok_or("missing parent")?).map_err(|e| e.to_string())?;
    let conn = Connection::open(path).map_err(|e| e.to_string())?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS game_runtime (game_id TEXT PRIMARY KEY, seconds INTEGER NOT NULL DEFAULT 0)",
        [],
    )
    .map_err(|e| e.to_string())?;
    Ok(conn)
}

fn parse_env(raw: &str) -> HashMap<String, String> {
    raw.split(';')
        .filter_map(|pair| pair.split_once('='))
        .map(|(k, v)| (k.trim().to_string(), v.trim().to_string()))
        .collect()
}

#[tauri::command]
fn launch_game(app: AppHandle, state: State<'_, RuntimeState>, game: GamePayload) -> Result<i64, String> {
    let mut cmd = Command::new(&game.command);
    if !game.args.is_empty() {
        cmd.args(game.args.split_whitespace());
    }
    for (k, v) in parse_env(&game.env) {
        cmd.env(k, v);
    }
    let mut child = cmd.spawn().map_err(|e| e.to_string())?;
    let started_at = Instant::now();
    let status = child.wait().map_err(|e| e.to_string())?;
    let elapsed = started_at.elapsed().as_secs() as i64;

    let conn = open_db(&app)?;
    conn.execute(
        "INSERT INTO game_runtime(game_id, seconds) VALUES (?1, ?2)
        ON CONFLICT(game_id) DO UPDATE SET seconds = seconds + excluded.seconds",
        params![game.id, elapsed],
    )
    .map_err(|e| e.to_string())?;

    let _ = status.code();
    state.children.lock().map_err(|e| e.to_string())?.remove(&game.id);
    get_runtime_seconds(app, game.id)
}

#[tauri::command]
fn get_runtime_seconds(app: AppHandle, game_id: String) -> Result<i64, String> {
    let conn = open_db(&app)?;
    let mut stmt = conn
        .prepare("SELECT seconds FROM game_runtime WHERE game_id = ?1")
        .map_err(|e| e.to_string())?;

    let value = stmt
        .query_row([game_id], |row| row.get::<_, i64>(0))
        .unwrap_or(0);

    Ok(value)
}

fn build_tray(app: &AppHandle) -> Result<(), tauri::Error> {
    TrayIconBuilder::new()
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
        .build(app)?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(RuntimeState::default())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![launch_game, get_runtime_seconds])
        .setup(|app| {
            build_tray(app.handle())?;
            if let Some(window) = app.get_webview_window("main") {
                window.on_window_event(|event| {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        let _ = event.window().hide();
                    }
                });
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
