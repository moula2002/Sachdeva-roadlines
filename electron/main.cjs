const { app, BrowserWindow } = require("electron");
const log = require("electron-log");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

let mainWindow;
let backendStarted = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true
    }
  });

  if (!app.isPackaged) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(process.resourcesPath, "frontend", "dist", "index.html");
    mainWindow.loadFile(indexPath);
  }

  // Fix autofill warnings
  mainWindow.webContents.session.setPermissionCheckHandler(() => false);
}

function startBackend() {
  if (backendStarted) return;
  backendStarted = true;

  let jarPath;

  if (!app.isPackaged) {
    
    // DEV MODE → jar is inside project root/backend-jar/ folder
    jarPath = path.join(__dirname, "..", "backend-jar", "sachdeva-backend-jar.jar");
  } else {
    // PRODUCTION MODE → jar (packaged jar) is copied to resources/launcher/
    jarPath = path.join(process.resourcesPath, "launcher", "sachdeva-backend-jar.jar");
  }

  // Validate jar exists
  if (!fs.existsSync(jarPath)) {
    const msg = "❌ Backend JAR missing: " + jarPath;
    console.error(msg);
    log.error(msg);
    return;
  }

  // Use javaw.exe on Windows to avoid opening a CMD terminal
  const javaCmd = process.platform === "win32" ? "javaw" : "java";

  console.log("Starting backend silently with:", javaCmd, jarPath);
  log.info("Starting backend silently with: " + javaCmd + " " + jarPath);

  const child = spawn(javaCmd, ["-jar", jarPath], {
    cwd: path.dirname(jarPath),
    detached: true,
    stdio: "ignore",
    windowsHide: true,
    shell: false
  });

  child.unref();
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});
