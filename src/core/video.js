const Video = {
    devices: [],

    init: ()=>{
        document.getElementById('webcams').addEventListener('change', ()=>{
            let v = document.getElementById('webcams').value;

            if(typeof v === 'string' && v.length > 0){
                Video.show(v);
            }
        });
    },

    setDevices: (devicesList)=>{
        Video.devices = [];
        devicesList.forEach((device)=>{
            if(device.type !== 'videoinput'){
                return;
            }
            Video.devices.push(device);
            document.getElementById('webcams').insertAdjacentHTML('beforeend', `<option value="${device.id}">${device.name}</option>`);
        });

        if(Video.devices.length > 0){
            Video.show(Video.devices[0].id);
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