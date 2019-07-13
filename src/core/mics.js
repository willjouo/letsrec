const Settings = require('./settings');
const VuMeter = require('../ui/vumeter/vumeter');

const Mics = {

    devices: [],

    init: ()=>{
        document.getElementById('mics').addEventListener('change', ()=>{
            let v = document.getElementById('mics').value;
            if(typeof v === 'string' && v.length > 0){
                Mics.startVu(v);
                Settings.set({
                    microphone: Mics.getDeviceById(v).name
                });
            }
        });
    },

    getDeviceById: (id)=>{
        for(let i = 0; i < Mics.devices.length; ++i){
            if(Mics.devices[i].id === id){
                return Mics.devices[i];
            }
        }
        return null;
    },

    getDeviceByName: (name)=>{
        for(let i = 0; i < Mics.devices.length; ++i){
            if(Mics.devices[i].name === name){
                return Mics.devices[i];
            }
        }
        return null;
    },

    setDevices: (devicesList)=>{
        // Reset device list
        Mics.devices = [];

        // Select microphones from list of devices
        devicesList.forEach((device)=>{
            if(device.type !== 'audioinput' && device.type !== 'videoinput'){
                return;
            }
            if(device.name.startsWith('Default ') || device.name.startsWith('Communications')){
                return;
            }
            Mics.devices.push(device);
        });

        // Populate select widget
        Mics.devices.forEach((device)=>{
            document.getElementById('mics').insertAdjacentHTML('beforeend', `<option value="${device.id}">${device.name}</option>`);
        });

        // Select default microphone according to settings
        let opt = Settings.get('microphone');
        let def = null;
        if(opt !== null){
            let dev = Mics.getDeviceByName(opt);
            if(dev !== null){
                def = dev.id;
            }
        }

        // If no settings, take the first one
        if(def === null && Mics.devices.length > 0){
            def = Mics.devices[0].id;
        }

        // If a microphone has been found, start the VU meter and select it in the widget
        if(def !== null){
            Mics.startVu(def);
            document.getElementById('mics').value = def;
        }
    },

    startVu: async (deviceId)=>{
        let stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: deviceId
            }
        });

        let audioContext = new AudioContext();
        let analyser = audioContext.createAnalyser();
        let microphone = audioContext.createMediaStreamSource(stream);
        let javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = function(){
            let array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;

            let length = array.length;
            for(let i = 0; i < length; i++){
                values += (array[i]);
            }
            let average = values / length;
            document.getElementById('vu').setAttribute('aria-valuenow', Math.round(average - 40));
            VuMeter.setValue(Math.round(average*2.5));
        }
    }
}

module.exports = Mics;