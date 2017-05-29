function hook(e) {
    //var el = e.srcElement || e.target;
    var el = e.target.parentNode;
    el.startX = (e.type == 'mousedown') ? (e.clientX - el.offsetWidth) : 0;
    el.startY = (e.type == 'mousedown') ? (e.clientY - el.offsetHeight) : 0;
}
function move(e) {
    //var el = e.srcElement || e.target;
    var el = e.target;
    el = el.parentNode;
    if(el.startX)
        el.style.width = e.clientX - el.startX + 'px';

    if(el.startY)
        el.style.height = e.clientY - el.startY + 'px';

    (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
}

if(!document.attachEvent) {
    document.attachEvent = function(e, f) {
        this.addEventListener(e.substr(2), f, false);
    }
}
document.attachEvent('onmouseup', hook);
document.attachEvent('onmousemove', move);
