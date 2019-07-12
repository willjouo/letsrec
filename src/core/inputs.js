module.exports = ()=>{
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
}