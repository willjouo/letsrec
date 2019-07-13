const Settings = require('./settings');

const Video = {
    devices: [],

    init: ()=>{
        document.getElementById('webcams').addEventListener('change', ()=>{
            let v = document.getElementById('webcams').value;
            if(typeof v === 'string' && v.length > 0){
                Video.show(v);
                Settings.set({
                    camera: Video.getDeviceById(v).name
                });
            }
        });
    },

    getDeviceById: (id)=>{
        for(let i = 0; i < Video.devices.length; ++i){
            if(Video.devices[i].id === id){
                return Video.devices[i];
            }
        }
        return null;
    },

    getDeviceByName: (name)=>{
        for(let i = 0; i < Video.devices.length; ++i){
            if(Video.devices[i].name === name){
                return Video.devices[i];
            }
        }
        return null;
    },

    setDevices: (devicesList)=>{
        // Reset device list
        Video.devices = [];

        // Select webcams from list of devices
        devicesList.forEach((device)=>{
            if(device.type !== 'videoinput'){
                return;
            }
            Video.devices.push(device);
        });

        // Populate select widget
        Video.devices.forEach((device)=>{
            document.getElementById('webcams').insertAdjacentHTML('beforeend', `<option value="${device.id}">${device.name}</option>`);
        });

        // Select default microphone according to settings
        let opt = Settings.get('camera');
        let def = null;
        if(opt !== null){
            let dev = Video.getDeviceByName(opt);
            if(dev !== null){
                def = dev.id;
            }
        }

        // If no settings, take the first one
        if(def === null && Video.devices.length > 0){
            def = Video.devices[0].id;
        }

        // If a microphone has been found, start the VU meter and select it in the widget
        if(def !== null){
            Video.show(def);
            document.getElementById('webcams').value = def;
        }
    },

    show: async (deviceId)=>{
        let stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: deviceId
            }
        });
        document.getElementById('webcam').srcObject = stream;
    }
};

module.exports = Video;