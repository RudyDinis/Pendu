const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const fs = require('fs');
let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    ipcMain.on('difficulty', (event, difficulty) => {

        fs.readFile('./data/data.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Erreur lors de la lecture du fichier :', err);
                return;
            }
            const jsonObj = JSON.parse(data);
            jsonObj.difficulty = difficulty;
            fs.writeFile('./data/data.json', JSON.stringify(jsonObj, null, 2), (err) => {
                if (err) {
                    console.error('Erreur lors de l\'écriture du fichier :', err);
                } else {
                    win.loadFile('./view/pendu.html')
                }
            });
        });
    })

    ipcMain.on('mot_selection', (event) => {
        function mot_selection() {
            let mot;
            const numeroLigne = Math.floor(Math.random() * 22263);
            fs.readFile('assets/liste_francais.txt', 'utf8', (err, data) => {
                if (err) {
                    console.error("Erreur lors de la lecture du fichier :", err);
                    console.log(err);
                    return;
                }

                const lignes = data.split('\n');

                if (numeroLigne <= 0 || numeroLigne > lignes.length) {
                    console.error("Numéro de ligne invalide.");
                    console.log("Numéro de ligne invalide.");
                    mot_selection()
                    return;
                }

                fs.readFile('./data/data.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error('Erreur lors de la lecture du fichier :', err);
                        return;
                    }
                    const jsonObj = JSON.parse(data);

                    let min;
                    let max;

                    if (jsonObj.difficulty == "facile") {
                        min = 0;
                        max = 10;
                    } else if (jsonObj.difficulty == "moyen") {
                        min = 10;
                        max = 15;
                    } else {
                        min = 15;
                        max = 26;
                    }
                    mot = lignes[numeroLigne - 1].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

                    if (mot.length <= max & mot.length > min) {
                        jsonObj.mot = mot.replace(/\r/g, '');
                        fs.writeFile('./data/data.json', JSON.stringify(jsonObj, null, 2), (err) => {
                            if (err) {
                                console.error('Erreur lors de l\'écriture du fichier :', err);
                            }
                        });

                        console.log(mot.length)
                        event.reply('mot_selection-reply', mot);
                    } else {
                        mot_selection()
                    }
                })
            });
        }
        mot_selection()
    })

    ipcMain.on('OnGame', (event) => {
        fs.readFile('./data/data.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Erreur lors de la lecture du fichier :', err);
                return;
            }
            const jsonObj = JSON.parse(data);

            event.reply("OnGameReply", [jsonObj.mot, jsonObj.difficulty, jsonObj.trouve, jsonObj.lettre, jsonObj.erreur])
        });
    })


    ipcMain.on('OnLettre', (event, lettre, boolean) => {
        fs.readFile('./data/data.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Erreur lors de la lecture du fichier :', err);
                return;
            }
            const jsonObj = JSON.parse(data);

            jsonObj.lettre = jsonObj.lettre + lettre;

            if (boolean == true) {
                jsonObj.trouve = jsonObj.trouve + lettre;
            } else {
                jsonObj.erreur = jsonObj.erreur + 1;
            }

            fs.writeFile('./data/data.json', JSON.stringify(jsonObj, null, 2), (err) => {
                if (err) {
                    console.error('Erreur lors de l\'écriture du fichier :', err);
                }
            });
        });
    })

    function reset() {
        fs.readFile('./data/data.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Erreur lors de la lecture du fichier :', err);
                return;
            }
            const jsonObj = JSON.parse(data);

            jsonObj.lettre = "";
            jsonObj.erreur = 0;
            jsonObj.trouve = "";
            jsonObj.difficulty = "";
            jsonObj.mot = "";

            fs.writeFile('./data/data.json', JSON.stringify(jsonObj, null, 2), (err) => {
                if (err) {
                    console.error('Erreur lors de l\'écriture du fichier :', err);
                }
            });
        });
    }

    ipcMain.on('Reset', (event) => {
        reset()
    })

    ipcMain.on('Relance', (event) => {
        reset()
        win.loadFile('./view/index.html')
    })

    ipcMain.on('Exit', async (event) => {
        app.exit()
    })


    fs.readFile('./data/data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier :', err);
            return;
        }

        let res;

        const jsonObj = JSON.parse(data);

        for (let i = 0; i < jsonObj.mot.length; i++) {
            const lettre = jsonObj.mot[i];
            if (jsonObj.lettre.indexOf(lettre) === -1) {
                res = false;
            }
        }

        if (jsonObj.erreur >= 6) {
            reset()
            win.loadFile('./view/index.html')
        } else if (res == false) {
            win.loadFile('./view/pendu.html')
        } else {
            reset()
            win.loadFile('./view/index.html')
        }

    });


}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})