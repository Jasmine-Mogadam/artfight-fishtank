const FishCategories = [
    {Count: 1, FolderName: "ArtFight", DisplayName: "Art Fight"},
    {Count: 0, FolderName: "Extra", DisplayName: "Extra"}
]
const State = {
    Open: 0,
    Closed: 1
}
let rollingId = 0

class Fish {
    constructor(path) {
        this.Path = path

        this.Body = this.Path + "/Body.png"
        this.ClosedEye = this.Path + "/ClosedEye.png"
        this.ClosedMouth = this.Path + "/ClosedMouth.png"
        this.OpenEye = this.Path + "/OpenEye.png"
        this.OpenMouth = this.Path + "/OpenMouth.png"
        this.Tail = this.Path + "/Tail.png"
        this.Thumb = this.Path + "/Thumb.png"

        this.EyeState = State.Open
        this.MouthState = State.Closed
        this.Velocity = 0

        this.id = null
        this.Name = null
        this.Size = null
        this.Speed = null
    }

    BuildFish(){
        let strToAppend = "<div class='x'><div class='y'><div class='tank-fish' id='" + this.id +
            "'>Fish Added! " + this.id
        strToAppend+= "</div></div></div></div>"
        $(".tank").append(strToAppend)
    }

    Swim(){

    }

    //When edge is hit, flip fish and reverse velocity
    HitEdge(){
        this.EyeState = State.Closed
        this.MouthState = State.Open
        this.velocity = 0
        Flip()
        this.EyeState = State.Open
        this.MouthState = State.Closed
        Swim()
    }

    Flip(){

    }

    async Blink(){
        this.EyeState = State.Open
        this.EyeState = State.Closed
        let promise = Promise.resolve(10)
        let result = await promise
        this.EyeState = State.Open
    }
}

async function ReadJsonFile(url) {
    let res = await fetch(url);
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

$(document).ready(function(){
    initializeFishTank()

    const tank = document.querySelector('.tank')
    tank.addEventListener('dragenter', dragEnter)
    tank.addEventListener('dragover', dragOver);
    tank.addEventListener('dragleave', dragLeave);
    tank.addEventListener('drop', drop);
})

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
        strToAppend += "<div class='menu-fish' draggable='true' id='" + JSON.stringify(fish) +
            "' ondragstart='drag(event)'>" +
            "<div class='name'>" + fish.Name +
            "</div><img class='fish-thumb' src='" + fish.Thumb + "' draggable='false'\></div>"
    })
    strToAppend+= "</div></div>"
    $(".side-menu").append(strToAppend)
}

//Add fish to tank
function AddFish(fishJson){
    let fish = Object.setPrototypeOf(JSON.parse(fishJson), Fish.prototype)
    fish.id = rollingId
    rollingId++
    console.log(fish)
    fish.BuildFish()
}

//Remove fish from tank
function RemoveFish(fish){
    //find fish via id in html
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
    AddFish(e.dataTransfer.getData("Fish"))
}

function drag(e){
    e.dataTransfer.setData("Fish", e.target.id)
}

let toggle = false;

function ToggleSideMenu(){
    $('#hide-menu').toggleClass('show-menu');
    $('#side-menu-button').toggleClass('show-side-menu-button');
    document.getElementById("side-menu-button").innerHTML = toggle ? "Show Fish" : "Hide Fish"
    toggle = !toggle
}