/**
 * Template is a small lightweight template system.
 * It takes html files and replace markup like {{vars}} and {{L:i18n_variable}}
 */
const fs = require('fs');

module.exports = function(tpl, vars = {}){
    let content = fs.readFileSync(`${tpl}.html`, {encoding: 'utf-8'});
    return content.replace(/{{([a-zA-Z0-9:\/-_]+)}}/g, (m, v)=>{
        if(vars.hasOwnProperty(v))
            return vars[v];
        return '';
    });
};

// EoF