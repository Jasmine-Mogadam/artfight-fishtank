const FishCount = 25
let allJsonFish = []
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

async function PlayRandomizedSound(soundName){
    let randomGlassTap = Math.floor(Math.random() * 3)
    let randomPitch = Math.random() + .5

    loadSample("Sound/" + soundName + "-" + randomGlassTap + ".mp3")
        .then(sample => playSample(sample, randomPitch));
}

function initializeFishTank() {
    CreateFishes().then(fishes => AddInfoFromJsonFilesToFishes(fishes)
        .then(fishes => AddFishToSideMenu(fishes)))
}

async function CreateFishes(){
    const fishes = []
    for (let i = 0; i < FishCount; i++) {
        fishes[i] = new Fish("Images/Fish/" + i)
    }

    return fishes
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
        if(infoJsonFiles[i].Category != null) fishes[i].Category = infoJsonFiles[i].Category
    }

    return fishes
}

async function AddFishToSideMenu(fishes){
    let categoryElement = null
    fishes.forEach(fish => {
        categoryElement = document.getElementById(fish.Category)
        if(categoryElement == null){
            CreateNewCategory(fish.Category)
        }
        let fishJson = JSON.stringify(fish)
        let strToAppend = "<div class='menu-fish' draggable='true' id='" + fishJson + "'" +
            "ondragstart='drag(event)' ontouchmove='mobileDrag(event)' ontouchend='mobileDragEnd(event)'>" +
            "<div class='name'>" + fish.Name + "</div><img class='fish-thumb' id='" +
            fishJson + "'src='" + fish.Thumb + "' draggable='false'\></div>"
        allJsonFish.push(fishJson)
        $("#" + fish.Category).append(strToAppend)
    })
}

function CreateNewCategory(category){
    let strToAppend = "<div class='menu-category'><button class='collapsible' onclick='Collapse("
        + category + ")'>" + category + "</button><div class='fish-holder' id='" + category +
        "'></div>"
    strToAppend += "</div></div>"
    $("#fish-menu-contents").append(strToAppend)
}

function Collapse(category){
    var content = document.getElementById(category.id);
    content.previousElementSibling.classList.toggle("active");
    if (content.style.maxHeight){
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

function ConvertJsonToFish(fishJson){
    let fish = Object.setPrototypeOf(JSON.parse(fishJson), Fish.prototype)
    fish.id = rollingId
    rollingId++
    return fish
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

function AddOneOfEach(){
    allJsonFish.forEach(fishJson => {
        let fish = ConvertJsonToFish(fishJson)
        fish.Position = new Position(Math.random()*360,
            Math.random() * width - fish.Size,
            Math.random() * height - fish.Size)
        fish.SilentEntrance = true
        fish.BuildFish()
    })
    PlayRandomizedSound("waterDrop")
}

function AddRandomFish(){
    let randomFishCount = document.getElementById('input-AddRandomFish').value
    for(let i = 0; i < randomFishCount; i++){
        let fishJson = allJsonFish[Math.floor(Math.random() * allJsonFish.length)]
        let fish = ConvertJsonToFish(fishJson)
        fish.Position = new Position(Math.random()*360,
            Math.random() * width - fish.Size,
            Math.random() * height - fish.Size)
        fish.SilentEntrance = true
        fish.BuildFish()
    }
    PlayRandomizedSound("waterDrop")
}
