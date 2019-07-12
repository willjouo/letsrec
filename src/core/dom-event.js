module.exports = (event, selector)=>{
    if(event === null || !(typeof event === 'object') || !('path' in event) || !Array.isArray(event.path)) return null;
    for(let i = 0; i < event.path.length; ++i){
        if(event.path[i].matches && event.path[i].matches(selector)){
            return event.path[i];
        }
    }
    return null;
};