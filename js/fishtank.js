const FishCategories = [
    {Count: 1, FolderName: "ArtFight", DisplayName: "Art Fight"},
    {Count: 0, FolderName: "Extra", DisplayName: "Extra"}
]
const State = {
    Open: 0,
    Closed: 1
}
let rollingId = 0
const width = window.innerWidth;
const height = window.innerHeight;

class Position {
    constructor(directionAngle, x, y) {
        this.DirectionAngle = directionAngle
        this.X = x
        this.Y = y
    }
}

class Fish {
    constructor(path) {
        this.Path = path

        this.ClosedEye = this.Path + "/ClosedEye.png"
        this.ClosedMouth = this.Path + "/ClosedMouth.png"
        this.OpenEye = this.Path + "/OpenEye.png"
        this.OpenMouth = this.Path + "/OpenMouth.png"
        this.Flipper = this.Path + "/Flipper.png"
        this.Body = this.Path + "/Body.png"
        this.Tail = this.Path + "/Tail.png"
        this.Thumb = this.Path + "/Thumb.png"

        this.EyeState = State.Open
        this.MouthState = State.Closed

        this.Position = new Position(0, 0, 0)
        this.Removed = false

        this.id = null
        this.Name = null
        this.Size = null
        this.Speed = null
    }

    BuildFish(){
        let strToAppend = "<div class='tank-fish' id='" + this.id + "' width='" + this.Size + "px'>"
        strToAppend += "<div class='Tail fish-part'><img src='" + this.Tail + "'\></div>"
        strToAppend += "<div class='Body fish-part'><img src='" + this.Body + "'\></div>"
        strToAppend += "<div class='Flipper fish-part'><img src='" + this.Flipper + "'\></div>"
        strToAppend += "<div class='Eye fish-part'><img src='" + this.OpenEye + "'\></div>"
        strToAppend += "<div class='Mouth fish-part'><img src='" + this.ClosedMouth + "'\></div>"
        strToAppend += "</div></div>"
        $(".tank").append(strToAppend)

        this.Swim()
    }

    async Swim(){
        //If deg is in first or fourth quadrant, flip
        //If position is at the edge of the tank, reverse direction
        if(this.IsAtEdge()){
            this.HitEdge()
        }
        //If position is outside tank, teleport to middle of tank

        //At random:
        // blink
        // talk
        // change direction

        //Update position in direction at speed
        this.UpdatePosition()
        if(!this.Removed){
            setTimeout(this.Swim(), 300);
        }
    }

    IsAtEdge(){
        let hitBoxDiameter = this.Size / 2.0
        let xOutOfBounds = (this.Position.X - hitBoxDiameter < 0) || (this.Position.X + hitBoxDiameter > width)
        let yOutOfBounds = (this.Position.Y - hitBoxDiameter < 0) || (this.Position.Y + hitBoxDiameter > height)
        return xOutOfBounds || yOutOfBounds
    }

    //When edge is hit, flip fish and reverse velocity
    HitEdge(){
        this.Flip()
        //Swim()
    }

    Flip(){
        this.Blink()
        this.Talk()
    }

    async Blink(){
        await this.SetEyeState(State.Open)
        await this.SetEyeState(State.Closed)
        let promise = Promise.resolve(10)
        let result = await promise
        await this.SetEyeState(State.Open)
    }

    async Talk(){
        await this.SetMouthState(State.Open)
        await this.SetMouthState(State.Closed)
        let promise = Promise.resolve(10)
        let result = await promise
        await this.SetMouthState(State.Open)
    }

    async SetEyeState(state){
        //if this doesn't work, document.getElementById(this.id).querySelector(".Eye").children[0]
        let eyeElement = document.querySelector("#" + this.id + " .Eye").children[0]
        if(state == State.Open){
            eyeElement.src = this.OpenEye
        }
        else{
            eyeElement.src = this.ClosedEye
        }
        this.EyeState = state
    }

    async SetMouthState(state){
        //if this doesn't work, document.getElementById(this.id).querySelector(".Mouth").children[0]
        let eyeElement = document.querySelector("#" + this.id + " .Mouth").children[0]
        if(state == State.Open){
            eyeElement.src = this.OpenMouth
        }
        else{
            eyeElement.src = this.ClosedMouth
        }
        this.MouthState = state
    }

    async UpdatePosition(){
        let fishElement = document.getElementById(this.id)
        let directionRadians = this.Position.DirectionAngle * (Math.PI / 180)
        //do trig with direction angle and speed to find new positions
        let newX = this.Position.X + Math.cos(directionRadians)/this.Speed
        let newY = this.Position.Y + Math.sin(directionRadians)/this.Speed

        fishElement.offsetLeft = newX
        fishElement.offsetTop = newY
        // if direction makes image upside down, visual flip change
        // move to position
        this.Position.X = newX
        this.Position.Y = newY
    }
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
        strToAppend += "<div class='menu-fish' draggable='true' id='" + JSON.stringify(fish) + "'" +
            "ondragstart='drag(event)' ontouchmove='mobileDrag(event)' ontouchend='mobileDragEnd(event)'>" +
            "<div class='name'>" + fish.Name +
            "</div><img class='fish-thumb' id='" + JSON.stringify(fish) + "'src='" + fish.Thumb + "' draggable='false'\></div>"
    })
    strToAppend+= "</div></div>"
    $(".side-menu").append(strToAppend)
}

//Add fish to tank
function AddFish(fishJson){
    let fish = Object.setPrototypeOf(JSON.parse(fishJson), Fish.prototype)
    fish.id = rollingId
    rollingId++
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

function mobileDrag(e){
    console.log(e)
    // grab the location of touch
    let touchLocation = e.targetTouches[0];

    // assign box new coordinates based on the touch.
    e.target.style.left = touchLocation.pageX + 'px';
    e.target.style.top = touchLocation.pageY + 'px';
}

function mobileDragEnd(e){
    AddFish(e.target.id)
}

let toggle = false;

function ToggleSideMenu(){
    $('#hide-menu').toggleClass('show-menu');
    $('#side-menu-button').toggleClass('show-side-menu-button');
    document.getElementById("side-menu-button").innerHTML = toggle ? "Show Fish" : "Hide Fish"
    toggle = !toggle
}