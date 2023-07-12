const FishCategories = [
    {Count: 5, FolderName: "ArtFight", DisplayName: "Art Fight"},
    {Count: 1, FolderName: "Extra", DisplayName: "Extra"},
]
let rollingId = 0

function loadSample(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => audioContext.decodeAudioData(buffer));
}

function playSample(sample, rate) {
    const source = audioContext.createBufferSource();
    source.buffer = sample;
    source.playbackRate.value = rate;
    source.connect(audioContext.destination);
    source.start(0);
}

async function AddInfoFromJsonFilesToFishes(fishes){
    let jsonFetches = []
    for (let i = 0; i < fishes.length; i++) {
        jsonFetches[i] = fetch("./" + fishes[i].Path + "/info.json").then(response => response.json())
    }
    let infoJsonFiles = await Promise.all(jsonFetches)
    for (let i = 0; i < fishes.length; i++) {
        fishes[i].Name = infoJsonFiles[i].Name
        fishes[i].Size = infoJsonFiles[i].Size
        fishes[i].Speed = infoJsonFiles[i].Speed
    }

    return fishes
}

function initializeFishTank() {
    FishCategories.forEach(initializeFishType)
}

function initializeFishType(fishCategory){
    if(fishCategory.Count === 0) return
    const fishes = []
    for (let i = 0; i < fishCategory.Count; i++) {
        fishes[i] = new Fish("Fish/" + fishCategory.FolderName + "/" + i)
    }
    AddInfoFromJsonFilesToFishes(fishes).then((fishes) => CreateMenuCategory(fishes, fishCategory.DisplayName))
}

//Jquery to add fish to side menu
function CreateMenuCategory(fishes, category){
    let strToAppend = "<div class='menu-category'><div class='menu-category-title'>" + category + " Fish</div>"
    fishes.forEach(fish => {
        strToAppend += "<div class='menu-fish' draggable='true' id='" + JSON.stringify(fish) + "'" +
            "ondragstart='drag(event)' ontouchmove='mobileDrag(event)' ontouchend='mobileDragEnd(event)'>" +
            "<div class='name'>" + fish.Name +
            "</div><img class='fish-thumb' id='" + JSON.stringify(fish) + "'src='" + fish.Thumb + "' draggable='false'\></div>"
    })
    strToAppend+= "</div></div>"
    $("#fish-menu-contents").append(strToAppend)
}

//Add fish to tank
function AddFish(fishJson, xPos, yPos){
    let fish = Object.setPrototypeOf(JSON.parse(fishJson), Fish.prototype)
    fish.id = rollingId
    rollingId++
    fish.Position = new Position(0, xPos, yPos)
    fish.BuildFish()
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
    AddFish(e.dataTransfer.getData("Fish"), e.clientX, e.clientY)
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
    AddFish(e.target.id, e.changedTouches[0].pageX, e.changedTouches[0].pageY)
}

let toggle = false;

function ToggleSideMenu(name){
    $('#hide-menu-' + name).toggleClass('show-menu');
    toggle = !toggle
}