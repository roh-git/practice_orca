const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('node:path');
let widgetWindow;

function createWidget() {
  const workArea = screen.getPrimaryDisplay().workArea;
  widgetWindow = new BrowserWindow({
    width: 820, height: 720, minWidth: 620, minHeight: 600,
    x: Math.max(workArea.x, workArea.x + workArea.width - 850), y: workArea.y + 24,
    frame: false, transparent: true, backgroundColor: '#00000000', show: false,
    alwaysOnTop: true, skipTaskbar: true, resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.cjs'),
      contextIsolation: true, nodeIntegration: false, sandbox: true
    }
  });
  widgetWindow.loadFile('monsterball-3d.html');
  widgetWindow.once('ready-to-show', () => widgetWindow.show());
  widgetWindow.on('closed', () => { widgetWindow = null; });
}

app.whenReady().then(createWidget);
app.on('window-all-closed', () => app.quit());
ipcMain.on('widget:minimize', () => widgetWindow?.minimize());
ipcMain.on('widget:close', () => widgetWindow?.close());
ipcMain.handle('widget:toggle-pin', () => {
  if (!widgetWindow) return false;
  const next = !widgetWindow.isAlwaysOnTop();
  widgetWindow.setAlwaysOnTop(next, 'floating');
  return next;
});
