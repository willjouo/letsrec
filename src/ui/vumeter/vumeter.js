const VUMeter = {
    getColor: (value)=>{
        var hue=((1-value)*120).toString(10);
        return ["hsl(",hue,",50%,50%)"].join("");
    },

    setValue: (perp)=>{

        let dom = document.querySelector('#vu');
        if(perp > 100){
            perp = 100;
        }
        
        dom.style.backgroundColor = VUMeter.getColor(perp*0.01 < 0.5 ? 0 : perp * 0.01);
        dom.style.width = `${perp}%`;
    }
};

module.exports = VUMeter;