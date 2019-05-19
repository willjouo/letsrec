const Input = {
    listDevices: ()=>{
        return new Promise(async (resolve) => {
            let devices = await navigator.mediaDevices.enumerateDevices();
            let result = [];
            devices.forEach((device) => {
                result.push({
                    id: device.deviceId,
                    type: device.kind,
                    name: device.label
                });
            });
            resolve(result);
        });
    },

    start: async (deviceId)=>{
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
            document.getElementById('vu').style.width = Math.round(average*2.5)+'%';
        }
    },

    showWebcam: async (deviceId)=>{
        let stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: deviceId
            }
        });
        document.getElementById('webcam').srcObject = stream;
    }
}

module.exports = Input;