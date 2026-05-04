use std::collections::HashMap;
use std::process::{Child, Command};
use std::sync::Mutex;

use serde::Deserialize;
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Manager, State};

#[derive(Default)]
struct RuntimeState {
    children: Mutex<HashMap<u32, Child>>,
}

#[derive(Deserialize, Clone)]
struct GamePayload {
    command: String,
    args: String,
    env: String,
}

fn parse_env(raw: &str) -> HashMap<String, String> {
    raw.split(';')
        .filter_map(|pair| pair.split_once('='))
        .map(|(k, v)| (k.trim().to_string(), v.trim().to_string()))
        .collect()
}

#[tauri::command]
fn launch_game(state: State<'_, RuntimeState>, game: GamePayload) -> Result<u32, String> {
    let mut cmd = Command::new(&game.command);
    if !game.args.is_empty() {
        cmd.args(game.args.split_whitespace());
    }
    for (k, v) in parse_env(&game.env) {
        cmd.env(k, v);
    }

    let child = cmd.spawn().map_err(|e| e.to_string())?;
    let pid = child.id();
    state.children.lock().map_err(|e| e.to_string())?.insert(pid, child);
    Ok(pid)
}

#[tauri::command]
fn is_game_running(state: State<'_, RuntimeState>, pid: u32) -> Result<bool, String> {
    let mut children = state.children.lock().map_err(|e| e.to_string())?;

    let Some(child) = children.get_mut(&pid) else {
        return Ok(false);
    };

    match child.try_wait().map_err(|e| e.to_string())? {
        Some(_) => {
            children.remove(&pid);
            Ok(false)
        }
        None => Ok(true),
    }
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
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![launch_game, is_game_running])
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
