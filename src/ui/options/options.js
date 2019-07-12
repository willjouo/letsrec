const Options = {
    init: ()=>{
        document.querySelector('#controls-options').addEventListener('click', ()=>{
            let opts = document.querySelector('#options');
            opts.style.display = opts.style.display == 'block' ? 'none' : 'block';
        });
    }
};

module.exports = Options;