const { app, BrowserWindow, dialog } = require('electron')
const path = require('path')
const prompt = require('electron-prompt');
const { Atem } = require('atem-connection')
const myAtem = new Atem()

function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    win.loadFile('index.html')

    win.webContents.on("dom-ready", () => {
        prompt({
            title: 'Connecto to ATEM',
            label: 'IP:',
            value: '192.168.178.23',
            inputAttrs: {
                type: 'text'
            },
            type: 'input'
        })
            .then((r) => {
                if (r === null) {
                    console.log('user cancelled');
                } else {
                    myAtem.connect(r);
                    myAtem.on("connected", () => {
                        dialog.showMessageBoxSync(win, { title: "Success", message: "Successfully connected to ATEM."})
                    })
                }
            })
            .catch(console.error);
    });
  }
  
app.whenReady().then(() => {
    createWindow()
})