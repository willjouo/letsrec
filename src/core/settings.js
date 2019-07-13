const {app} = require('electron').remote;

const Settings = {
    options: {},

    init: ()=>{
        // Get localStorage
        let opts = localStorage.getItem('options');
        if(opts !== null){
            try {
                opts = JSON.parse(opts);
            }
            catch(e){
                opts = {};
            }
        }
        if(opts === null){
            opts = {};
        }

        Settings.options = Object.assign({}, {
            camera: null,
            microphone: null,
            cameraSize: '1080',
            cameraFps: '60',
            outputFolder: app.getPath('documents'),
            outputFile: 'letsrec_%t.mp4'
        }, opts);
    },

    get: (key)=>{
        if(key in Settings.options){
            return Settings.options[key];
        }
        return null;
    },

    set: (infos)=>{
        Settings.options = Object.assign({}, Settings.options, infos);
        localStorage.setItem
    }
};

module.exports = Settings;