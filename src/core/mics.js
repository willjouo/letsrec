const VuMeter = require('../ui/vumeter/vumeter');

const Mics = {

    devices: [],

    init: ()=>{
        document.getElementById('mics').addEventListener('change', ()=>{
            let v = document.getElementById('mics').value;
            if(typeof v === 'string' && v.length > 0){
                Mics.startVu(v);
            }
        });
    },

    setDevices: (devicesList)=>{
        Mics.devices = [];
        devicesList.forEach((device)=>{
            if(device.type !== 'audioinput' && device.type !== 'videoinput'){
                return;
            }
            Mics.devices.push(device);
            document.getElementById('mics').insertAdjacentHTML('beforeend', `<option value="${device.id}">${device.name}</option>`);
        });

        if(Mics.devices.length > 0){
            Mics.startVu(Mics.devices[0].id);
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