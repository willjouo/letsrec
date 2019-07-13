// First, user settings
require('./core/settings').init();

require('./ui/topbar/topbar').init();
require('./ui/options/options').init();

const Inputs = require('./core/inputs');
const Mics = require('./core/mics');
const Video = require('./core/video');

document.addEventListener('DOMContentLoaded', ()=>{
    Video.init();
    Mics.init();

    Inputs().then((res)=>{
        console.log(res);
        Video.setDevices(res);
        Mics.setDevices(res);
    });
});