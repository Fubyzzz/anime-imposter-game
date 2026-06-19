const {app, BrowserWindow} = require("electron");

require("./server.js");

function createWindow(){

 const win = new BrowserWindow({
  width:900,
  height:700
 });

 setTimeout(()=>{
  win.loadURL("http://localhost:3000");
 },1000);

}

app.whenReady().then(createWindow);