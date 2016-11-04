'user strict';

if (require('electron-squirrel-startup')) return;
// アプリケーションをコントロールするモジュール
var electron = require('electron');
var app = electron.app;

var handleStartupEvent = function() {
  if (process.platform !== 'win32') {
    return false;
  }

  var ChildProcess = require('child_process');
  var path = require('path');
  var appFolder = path.resolve(process.execPath, '..');
  var rootAtomFolder = path.resolve(appFolder, '..');
  var updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  var exeName = path.basename(process.execPath);
  var spawn = function(command, args) {
    var spawnedProcess, error;
    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}
    
    return spawnedProcess;
  };
  var spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  var squirrelCommand = process.argv[1];
  switch (squirrelCommand) {
    case '--squirrel-install':
    case '--squirrel-updated':

      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      spawnUpdate(['--createShortcut', exeName]);
      setTimeout(app.quit, 1000);

      return true;
    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      spawnUpdate(['--removeShortcut', exeName]);
      setTimeout(app.quit, 1000);

      return true;
    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      app.quit();
      return true;
  }
};

if (handleStartupEvent()) {
  return;
}

// ウィンドウを作成するモジュール
var BrowserWindow = electron.BrowserWindow;
// メインウィンドウはGCされないようにグローバル宣言
var mainWindow = null;
var readyFlag = false;

function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: {nodeIntegration: false}});
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

// Electronの初期化完了後に実行
app.on('ready', function() {
  readyFlag = true;
  createWindow();
});

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (readyFlag && (mainWindow === null)) {
    createWindow();
  }
});
