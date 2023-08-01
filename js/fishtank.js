const FishCount = 40
let allJsonFish = []
let rollingId = 0

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
