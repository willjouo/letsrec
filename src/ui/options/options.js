const moment = require('moment');

const Topbar = require('../topbar/topbar');

const Controls = {
    isRecording: false,
    timerStart: null,

    init: ()=>{
        document.querySelector('#controls-options').addEventListener('click', ()=>{
            let opts = document.querySelector('#options');
            opts.style.display = opts.style.display == 'block' ? 'none' : 'block';
        });

        document.querySelector('#controls-record').addEventListener('click', ()=>{
            Controls.isRecording = !Controls.isRecording;
            Topbar.setIsRecording(Controls.isRecording);
            Controls.startRecord();
        });
    },

    startRecord: ()=>{
        Controls.timerStart = moment();
        Controls.updateTimer();
    },

    updateTimer: ()=>{
        if(!Controls.isRecording){
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