const FishCategories = [
    {Count: 20, FolderName: "ArtFight", DisplayName: "Art Fight"},
    {Count: 1, FolderName: "Extra", DisplayName: "Extra"},
]
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
        let fishJson = JSON.stringify(fish)
        strToAppend += "<div class='menu-fish' draggable='true' id='" + fishJson + "'" +
            "ondragstart='drag(event)' ontouchmove='mobileDrag(event)' ontouchend='mobileDragEnd(event)'>" +
            "<div class='name'>" + fish.Name +
            "</div><img class='fish-thumb' id='" + fishJson + "'src='" + fish.Thumb + "' draggable='false'\></div>"
        allJsonFish.push(fishJson)
    })
    strToAppend+= "</div></div>"
    $("#fish-menu-contents").append(strToAppend)
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
    AddFish(e.target.id, e.changedTouches[0].pageX, e.changedTouches[0].pageY)
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