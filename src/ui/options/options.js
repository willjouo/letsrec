// Node
const child_process = require('child_process');
const path = require('path');
// Electron
const {remote} = require('electron');
const {dialog} = require('electron').remote;
// 3rd parties
const moment = require('moment');
// LetsRec
const Settings = require('../../core/settings');
const Topbar = require('../topbar/topbar');
const Video = require('../../core/video');

const Controls = {
    isRecording: false,
    timerStart: null,

    init: ()=>{
        // Click on options buttons
        document.querySelector('#controls-options').addEventListener('click', ()=>{
            let opts = document.querySelector('#options');
            opts.style.display = opts.style.display == 'block' ? 'none' : 'block';
        });

        // Click on Start/Stop record
        document.querySelector('#controls-record').addEventListener('click', ()=>{
            Controls.isRecording = !Controls.isRecording;
            Topbar.setIsRecording(Controls.isRecording);
            Controls.startRecord();
        });

        // Fill form
        document.querySelector('#webcam-size').value = Settings.get('cameraSize');
        document.querySelector('#webcam-fps').value = Settings.get('cameraFps');
        document.querySelector('#folder').value = Settings.get('outputFolder');
        document.querySelector('#filename').value = Settings.get('outputFile');

        // Form handler
        document.querySelector('#webcam-size').addEventListener('change', ()=>{
            Settings.set({
                cameraSize: document.querySelector('#webcam-size').value
            });
        });
        document.querySelector('#webcam-fps').addEventListener('change', ()=>{
            Settings.set({
                cameraFps: document.querySelector('#webcam-fps').value
            });
        });
        document.querySelector('#folder').addEventListener('input', ()=>{
            Settings.set({
                outputFolder: document.querySelector('#folder').value
            });
        });
        document.querySelector('#filename').addEventListener('input', ()=>{
            Settings.set({
                outputFile: document.querySelector('#filename').value
            });
        });

        // Click on webcam config
        document.querySelector('#webcam-config').addEventListener('click', ()=>{
            let configpath = path.join(__dirname, '..', '..', '..', 'deps', 'webcamconfig.exe');
            child_process.spawn(configpath, [Video.getSelectedCameraName()]);
        });

        // Click on browse output folder
        document.querySelector('#folder-browse').addEventListener('click', ()=>{
            dialog.showOpenDialog(remote.getCurrentWindow(), {
                title: 'Choose output folder',
                defaultPath: Settings.get('outputFolder'),
                properties: ['openDirectory']
            }, (filepaths)=>{
                if(Array.isArray(filepaths) && filepaths.length === 1){
                    document.querySelector('#folder').value = filepaths[0];
                    Settings.set({
                        outputFolder: document.querySelector('#folder').value
                    });
                }
            });
        });
    },

    startRecord: ()=>{
        // Update timer
        Controls.timerStart = moment();
        Controls.updateTimer();

        // Change button design to red with a stop icon
        document.querySelector('#controls-record').innerHTML = '<i class="fas fa-stop fa-fw"></i>';
        document.querySelector('#controls-record').classList.remove('btn-primary');
        document.querySelector('#controls-record').classList.add('btn-danger');
    },

    updateTimer: ()=>{
        if(!Controls.isRecording){
            document.title = `LetsRec`;
            document.querySelector('#controls-record').innerHTML = '<i class="fas fa-play fa-fw"></i>';
            document.querySelector('#controls-record').classList.remove('btn-danger');
            document.querySelector('#controls-record').classList.add('btn-primary');
            return;
        }

        let diff = moment().diff(Controls.timerStart, 'seconds');
        let timer = moment().hour(0).minute(0).second(diff).format('HH:mm:ss');
        document.querySelector('#timer').innerHTML = timer;
        document.title = `[${timer}] LetsRec`;
        setTimeout(Controls.updateTimer, 100);
    }
};

module.exports = Controls;