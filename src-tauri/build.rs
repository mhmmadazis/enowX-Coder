fn main() {
    println!("cargo:rustc-check-cfg=cfg(rust_analyzer)");
    println!("cargo:rustc-env=DATABASE_URL=sqlite://./enowx.db");
    tauri_build::build()
}
