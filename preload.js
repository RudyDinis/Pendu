const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  difficulty: (difficulty) => ipcRenderer.send('difficulty', difficulty),
  mot_selection: () => ipcRenderer.send('mot_selection'),
  onMot_selectionReply: (callback) => ipcRenderer.on('mot_selection-reply', (event, result) => {
    callback(result);
  }),
  OnGame: () => ipcRenderer.send('OnGame'),
  OnGameReply : (callback) => ipcRenderer.on('OnGameReply', (event, result) => {
    callback(result);
  }),
  OnLettre: (lettre, boolean) => ipcRenderer.send('OnLettre', lettre, boolean),
  Relance: () => ipcRenderer.send('Relance'),
  Exit: () => ipcRenderer.send('Exit'),
  Reset: () => ipcRenderer.send('Reset'),
})