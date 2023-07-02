const artFishCount = 1;
const extraFishCount = 0;
const State = {
    Open: 0,
    Closed: 1
}
let rollingId = 0

class Fish {
    constructor(path) {
        this.Body = path + "\\Body"
        this.ClosedEye = path + "\\ClosedEye"
        this.ClosedMouth = path + "\\ClosedMouth"
        this.OpenEye = path + "\\OpenEye"
        this.OpenMouth = path + "\\OpenMouth"
        this.Tail = path + "\\Tail"

        fetch("./" + path + "/info.json")
            .then((response) => response.json())
            .then((infoJson) => {
                this.Name = infoJson.Name
                this.Size = infoJson.Size
                this.Speed = infoJson.Speed
            });

        this.EyeState = State.Open
        this.MouthState = State.Closed
        this.Velocity = 0

        this.id = null
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

    Blink(){
        this.EyeState = State.Open
        this.EyeState = State.Closed
        //some async wait
        this.EyeState = State.Open
    }

    GetThumb(){

    }
}

$(document).ready(function(){
    initializeFishTank()
})

function initializeFishTank() {
    const artFishes = [artFishCount]
    const extraFishes = [extraFishCount]
    for (let i = 0; i < artFishCount; i++) {
        artFishes[i] = new Fish("Fish\\Artfight\\" + i)
    }
    for (let i = 0; i < extraFishCount; i++) {
        extraFishes[i] = new Fish("Fish\\Extra\\" + i)
    }
    CreateMenuCategory(artFishes, "Art Fight Fishes")
    CreateMenuCategory(extraFishes, "Extra Fishes")
}

//Jquery to add fish to side menu
function CreateMenuCategory(fishes, category){
    if(fishes.length === 0) return
    let strToAppend = ""
    for (let fish in fishes) {
        strToAppend += "<div class='menu-fish'><div class='name'>" + fish.Name +
            "</div><img class='fish-thumb' src='" + fish.Body + "'</div>"
    }
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