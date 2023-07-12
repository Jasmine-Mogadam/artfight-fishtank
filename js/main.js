$(document).ready(function(){
    initializeFishTank()

    const tank = document.querySelector('.tank')
    tank.addEventListener('dragenter', dragEnter)
    tank.addEventListener('dragover', dragOver);
    tank.addEventListener('dragleave', dragLeave);
    tank.addEventListener('drop', drop);

    //hide side menus if mouse doesn't move for 5 seconds
    var timedelay = 1;
    function delayCheck()
    {
        if(timedelay == 5)
        {
            $("#button-fish").fadeOut();
            $("#button-about").fadeOut();
            $("#button-settings").fadeOut();
            timedelay = 1;
        }
        timedelay = timedelay+1;
    }
    $(document).mousemove(function() {
        $("#button-fish").fadeIn();
        $("#button-about").fadeIn();
        $("#button-settings").fadeIn();
        timedelay = 1;
        clearInterval(_delay);
        _delay = setInterval(delayCheck, 500);
    });
    // page loads starts delay timer
    _delay = setInterval(delayCheck, 500)
})