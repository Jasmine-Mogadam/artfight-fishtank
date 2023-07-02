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

        let info = JSON.parse(FileReader.readAsText(path + "\\info.json"))
        this.Name = info.Name
        this.Size = info.Size
        this.Speed = info.Speed

        this.EyeState = State.Open
        this.MouthState = State.Closed
        this.Velocity = 0

        this.id = null
    }

    Swim(){

    }

    HitEdge(){
        this.EyeState = State.Closed
        this.MouthState = State.Open
    }
}

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