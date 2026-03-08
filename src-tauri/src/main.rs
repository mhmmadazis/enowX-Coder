// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tokio::main]
async fn main() {
    if let Err(error) = enowx_coder_lib::run().await {
        eprintln!("Failed to run application: {error}");
    }
}
