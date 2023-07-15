const audioContext = new AudioContext();
const width = window.innerWidth;
const height = window.innerHeight;

$(document).ready(function(){
    initializeFishTank()

    const tank = document.querySelector('.tank')
    tank.addEventListener('dragenter', dragEnter)
    tank.addEventListener('dragover', dragOver);
    tank.addEventListener('dragleave', dragLeave);
    tank.addEventListener('drop', drop);

    document.querySelector('#button-fish').addEventListener("click",
        function() {
            $("#button-about").toggleClass('hide');
            $("#button-settings").toggleClass('hide');
        }
    );
    document.querySelector('#button-about').addEventListener("click",
        function() {
            $("#button-fish").toggleClass('hide');
            $("#button-settings").toggleClass('hide');
        }
    );
    document.querySelector('#button-settings').addEventListener("click",
        function() {
            $("#button-about").toggleClass('hide');
            $("#button-fish").toggleClass('hide');
        }
    );

    //hide side menus if mouse doesn't move for 5 seconds
    var timedelay = 1;
    function delayCheck()
    {
        if(timedelay == 5 && document.getElementsByClassName('show-menu').length == 0)
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

function ToggleSideMenu(name){
    $('#hide-menu-' + name).toggleClass('show-menu');
}

function ToggleButtonVis(){

}