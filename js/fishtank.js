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
let refreshRate = 1000;

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

        this.Removed = false
        this.Position = null
        this.id = null
        this.Name = null
        this.Size = null
        this.Speed = null
        this.Element = null
    }

    async BuildFish(){
        this.Position.X -= this.Size * 1.5
        this.Position.Y -= this.Size

        let strToAppend = "<div class='tank-fish' id='" + this.id + "' width='" + this.Size + "px'>"
        strToAppend += "<div class='Tail fish-part'><img src='" + this.Tail + "'\></div>"
        strToAppend += "<div class='Body fish-part'><img src='" + this.Body + "'\></div>"
        strToAppend += "<div class='Flipper fish-part'><img src='" + this.Flipper + "'\></div>"
        strToAppend += "<div class='Eye fish-part'><img src='" + this.OpenEye + "'\></div>"
        strToAppend += "<div class='Mouth fish-part'><img src='" + this.ClosedMouth + "'\></div>"
        strToAppend += "</div></div>"
        $(".tank").append(strToAppend)

        this.Element = document.getElementById(this.id)

        this.Swim().then(r => this.Element.remove())
    }

    async Swim(){
        while(!this.Removed){
            //If deg is in first or fourth quadrant, flip
            //If position is at the edge of the tank, reverse direction
            if(this.IsAtEdge()){
                await this.HitEdge()
            }
            //If position is outside tank, teleport to middle of tank
            this.RandomEvent(this.Blink.bind(this), .10)
            this.RandomEvent(this.Talk.bind(this), .05)
            this.RandomEvent(this.RandomChangeDirection.bind(this), .05)
            //At random:
            // blink
            // talk
            // change direction

            //Update position in direction at speed
            await this.UpdatePosition()
            await new Promise(r => setTimeout(r, refreshRate));
        }
    }

    IsAtEdge(){
        let hitBoxDiameter = this.Size / 2.0
        let xOutOfBounds = (this.Position.X - hitBoxDiameter < 0) || (this.Position.X + hitBoxDiameter > width)
        let yOutOfBounds = (this.Position.Y - hitBoxDiameter < 0) || (this.Position.Y + hitBoxDiameter > height)
        //console.log("hitBoxDia: " + hitBoxDiameter + " | xBounds: " + xOutOfBounds + " | xBounds: "  + yOutOfBounds)
        return xOutOfBounds || yOutOfBounds
    }

    //When edge is hit, flip fish and reverse velocity
    async HitEdge(){
        await this.Flip()
        await this.UpdatePosition()
    }

    async RandomEvent(event, chance){
        let eventRoll = Math.random()
        if(eventRoll < chance){
            event()
        }
    }

    async RandomChangeDirection(){
        let directionChange = this.Position.DirectionAngle + ((Math.random() - .05) * 60)
        this.SetDirection(directionChange)
    }

    async Flip(){
        this.Blink()
        this.Talk()
        this.SetDirection(-this.Position.DirectionAngle)
    }

    async Blink(){
        await this.SetEyeState(State.Open)
        await this.SetEyeState(State.Closed)
        await new Promise(r => setTimeout(r, 300));
        await this.SetEyeState(State.Open)
    }

    async Talk(){
        await this.SetMouthState(State.Closed)
        await this.SetMouthState(State.Open)
        await new Promise(r => setTimeout(r, 300));
        await this.SetMouthState(State.Closed)
    }

    async SetEyeState(state){
        let eyeElement = this.Element.querySelector(".Eye").children[0]
        if(state == State.Open){
            eyeElement.src = this.OpenEye
        }
        else{
            eyeElement.src = this.ClosedEye
        }
        this.EyeState = state
    }

    async SetMouthState(state){
        let eyeElement = this.Element.querySelector(".Mouth").children[0]
        if(state == State.Open){
            eyeElement.src = this.OpenMouth
        }
        else{
            eyeElement.src = this.ClosedMouth
        }
        this.MouthState = state
    }

    async SetDirection(angle){
        this.Position.DirectionAngle = angle
        let unitAngle = angle % 360
        if(unitAngle < 0){
            unitAngle += 360
        }
        let scale = unitAngle < 270 && unitAngle > 90 ? -1 : 1
        this.Element.style.transform = "rotate(" + angle + "deg) scaleX(" + scale + ")"
        this.Element.style.angle = angle
    }

    async UpdatePosition(){
        let directionRadians = this.Position.DirectionAngle * (Math.PI / 180)
        //do trig with direction angle and speed to find new positions
        let newX = this.Position.X + Math.cos(directionRadians) * this.Speed * refreshRate/1000
        let newY = this.Position.Y + Math.sin(directionRadians) * this.Speed * refreshRate/1000

        this.Element.style.left = newX + "px"
        this.Element.style.top = newY + "px"

        // move to position
        this.Position.X = newX
        this.Position.Y = newY

        await this.SetDirection(this.Position.DirectionAngle)
    }

    Remove(){
        this.Removed = true
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
function AddFish(fishJson, xPos, yPos){
    let fish = Object.setPrototypeOf(JSON.parse(fishJson), Fish.prototype)
    fish.id = rollingId
    rollingId++
    fish.Position = new Position(0, xPos, yPos)
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

function ToggleSideMenu(){
    $('#hide-menu').toggleClass('show-menu');
    $('#side-menu-button').toggleClass('show-side-menu-button');
    document.getElementById("side-menu-button").innerHTML = toggle ? "Show Fish" : "Hide Fish"
    toggle = !toggle
}