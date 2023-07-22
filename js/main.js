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

function ToggleMenu(name){
    $('#hide-menu-' + name).toggleClass('show-menu');
}

function ToggleFullScreen() {
  var fullScreenArea = document.getElementById("fullscreen-area");
  var fullscreenButton = document.getElementById("fullscreen-button");

  if(fullscreenButton.classList.contains("inactive-fullscreen")){
  /* View in fullscreen */
    if (fullScreenArea.requestFullscreen) {
      fullScreenArea.requestFullscreen();
    } else if (fullScreenArea.webkitRequestFullscreen) { /* Safari */
      fullScreenArea.webkitRequestFullscreen();
    } else if (document.msRequestFullscreen) { /* IE11 */
      fullScreenArea.msRequestFullscreen();
    }
  }
  else{
  /* Close fullscreen */
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
  }
  $('#fullscreen-button').toggleClass('active-fullscreen');
  $('#fullscreen-button').toggleClass('inactive-fullscreen');
}
