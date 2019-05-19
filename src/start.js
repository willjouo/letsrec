const Inputs = require('./core/mic');

document.addEventListener('DOMContentLoaded', ()=>{
    Inputs.listDevices().then((res)=>{
        console.log(res);

        // Mics
        res.forEach((device)=>{
            if(device.type !== 'audioinput' && device.type !== 'videoinput') return;
            document.getElementById('inputs').insertAdjacentHTML('beforeend', `<option value="${device.id}">${device.name}</option>`);
        });

        // Webcams
        res.forEach((device)=>{
            if(device.type !== 'videoinput') return;
            document.getElementById('webcams').insertAdjacentHTML('beforeend', `<option value="${device.id}">${device.name}</option>`);
        });

        // Start webcam
        Inputs.showWebcam(document.getElementById('webcams').value);
    });

    document.getElementById('start').addEventListener('click', ()=>{
        Inputs.start(document.getElementById('inputs').value);
    });
});