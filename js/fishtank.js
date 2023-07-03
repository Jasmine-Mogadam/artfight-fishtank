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

        this.Body = path + "/Body.png"
        this.ClosedEye = path + "/ClosedEye.png"
        this.ClosedMouth = path + "/ClosedMouth.png"
        this.OpenEye = path + "/OpenEye.png"
        this.OpenMouth = path + "/OpenMouth.png"
        this.Tail = path + "/Tail.png"
        this.Thumb = path + "/Thumb.png"

        this.EyeState = State.Open
        this.MouthState = State.Closed
        this.Velocity = 0

        this.id = null
        this.Name = null
        this.Size = null
        this.Speed = null
    }

    Swim(){

    }

    //When edge is hit, flip fish and reverse velocty
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
})

function initializeFishTank() {
    FishCategories.forEach(initializeFishType)
}

function initializeFishType(fishCategory){
    if(fishCategory.Count == 0) return
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
        strToAppend += "<div class='menu-fish'><div class='name'>" + fish.Name +
            "</div><img class='fish-thumb' src='" + fish.Thumb + "'\></div>"
    })
    strToAppend+= "</div></div>"
    $(".side-menu").append(strToAppend)
}

//Add fish to tank
function AddFish(fish){
    fish.id = rollingId
    rollingId++
    //create layered image elements inside div with id
}

//Remove fish from tank
function RemoveFish(fish){
    //find fish via id in html
}