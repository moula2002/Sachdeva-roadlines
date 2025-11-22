const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('api', {
  ping: () => 'pong'
});
console.log("Preload loaded");