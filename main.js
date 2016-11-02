'user strict';

// アプリケーションをコントロールするモジュール
var electron = require('electron');
var app = electron.app;
// ウィンドウを作成するモジュール
var BrowserWindow = electron.BrowserWindow;
// メインウィンドウはGCされないようにグローバル宣言
var mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: {nodeIntegration: false}});
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

// Electronの初期化完了後に実行
app.on('ready', createWindow);

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});
