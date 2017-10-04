const {app, BrowserWindow} = require('electron');

let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});
app.commandLine.appendSwitch('ignore-gpu-blacklist');
// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
          width: 800, 
          height: 600, 
          frame:true,
          transparent: false
  });
  
  mainWindow.setIgnoreMouseEvents(false)

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html#webcam');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
