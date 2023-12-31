const audioContext = new AudioContext();
var refreshRate = 1000
var sizeMultiplier = 1
var speedMultiplier = 1
var gameTime = 180000 //3 minutes in milliseconds
var gamePlaying = false
var clearScreen = false
var scoreSystem = null


//Prevent anything from being selected except:
// - Menu fish
// - Save fish tank
const handler = event => event.preventDefault();

document.getElementsByClassName("menu-fish").onmousedown = () => document.addEventListener("mousemove", handler);

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
        if(timedelay == 5 && document.getElementsByClassName('show-side-menu').length == 0 &&
            document.getElementsByClassName('show-bottom-menu').length == 0)
        {
            $("#button-fish").fadeOut();
            $("#button-about").fadeOut();
            $("#button-settings").fadeOut();
            $("#button-game").fadeOut();
            timedelay = 1;
        }
        timedelay = timedelay+1;
    }
    $(document).mousemove(function() {
        $("#button-fish").fadeIn();
        $("#button-about").fadeIn();
        $("#button-settings").fadeIn();
        $("#button-game").fadeIn();
        timedelay = 1;
        clearInterval(_delay);
        _delay = setInterval(delayCheck, 500);
    });
    // page loads starts delay timer
    _delay = setInterval(delayCheck, 500)
})

function HideSplashScreen(){
    $("#game-end-splash").toggleClass('hidden');
    document.getElementById("splash-black-screen").style.opacity = "0"
}

function ToggleMenu(name,type){
    $('#hide-menu-' + name).toggleClass('show-' + type + '-menu');
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

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function drop(e) {
    e.target.classList.remove('drag-over');
    let fish = ConvertJsonToFish(e.dataTransfer.getData("Fish"))
    fish.Position = new Position(0,  e.clientX, e.clientY)
    fish.BuildFish()
}

function drag(e){
    e.dataTransfer.setData("Fish", e.target.id)
}

function mobileDrag(e){
    // grab the location of touch
    this.startX = e.touches[0].pageX;
    this.startY = e.touches[0].pageY;
}

function mobileDragEnd(e){
    let fish = ConvertJsonToFish(e.currentTarget.id)
    fish.Position = new Position(0, e.changedTouches[0].pageX, e.changedTouches[0].pageY)
    fish.SilentEntrance = true
    fish.BuildFish()
}

function updateRefreshRate() {
    refreshRate = document.getElementById("refreshRate").value;
}

function updateSizeMultiplier() {
    sizeMultiplier = document.getElementById("sizeMultiplier").value;
}

function updateSpeedMultiplier() {
    speedMultiplier = document.getElementById("speedMultiplier").value;
}

function updateGameTimer() {
    gameTime = document.getElementById("gameTimer").value;
}

async function RandomEvent(event, chance){
    let eventRoll = Math.random()
    if(eventRoll < chance){
        event()
    }
}

function loadSample(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => audioContext.decodeAudioData(buffer));
}

async function displayError(msg){
    let errorContainer = document.getElementById("error-container")
    let errorMsg = document.createElement("p")
    errorMsg.className = "error-message"
    errorMsg.innerText = msg
    errorMsg.style.opacity = 0;
    errorContainer.append(errorMsg)
    errorMsg.style.opacity = 1;
    await new Promise(r => setTimeout(r, 4000));
    errorMsg.style.opacity = 0;
    await new Promise(r => setTimeout(r, 1000));
    errorMsg.remove()
}