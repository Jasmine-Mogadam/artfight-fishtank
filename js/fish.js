const State = {
    Open: 0,
    Closed: 1
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
        this.SilentEntrance = false
        this.Category = "Misc"
        this.Position = null
        this.id = null
        this.Name = null
        this.Size = null
        this.Speed = null
        this.Element = null
        this.LastTap = null
        this.Price = null
        this.Coin = null
    }

    async BuildFish(){
        this.Size = this.Size * sizeMultiplier * (Math.random()/2 + .75);
        this.Speed = this.Speed * speedMultiplier * (Math.random()/2 + .75);

        if(this.Position == null){
            this.Position = new Position(0, this.Size * 2, this.Size * 2)
        }

        let elementToAppend = "<div class='tank-fish' id='" + this.id +
            "' style='width:" + this.Size + "px; height:" + this.Size + "px;'>" +
            "<div class='Tail fish-part'><img src='" + this.Tail + "'\></div>" +
            "<div class='Body fish-part'><img src='" + this.Body + "'\></div>" +
            "<div class='Mouth fish-part'><img src='" + this.ClosedMouth + "'\></div>" +
            "<div class='Eye fish-part'><img src='" + this.OpenEye + "'\></div>" +
            "<div class='Flipper fish-part'><img src='" + this.Flipper + "'\></div>" +
            "</div></div>"
        $("#tank").append(elementToAppend)

        this.Element = document.getElementById(this.id)
        this.Element.ondblclick = event => this.Remove()
        this.Element.ontouchstart = event => this.CheckIfDoubleClickToRemove()
        this.Position.Element = this.Element

        if(!this.SilentEntrance) PlayRandomizedSound("waterDrop")
        this.Swim()
    }

    CheckIfDoubleClickToRemove(){
        let now = new Date().getTime();
        let timeSince = now - this.LastTap;
        if((timeSince < 600) && (timeSince > 0)){
            this.Remove()
        }
        else{
            this.LastTap = new Date().getTime();
        }
    }

    async Swim(){
        this.StartLoopingAnimations()
        while(!this.Removed){
            if(clearScreen){
                this.Removed = true
            }
            //At random:
            // blink
            // talk
            // change direction
            // drop coin if game is ongoing
            RandomEvent(this.Blink.bind(this), .10)
            RandomEvent(this.Talk.bind(this), .05)
            RandomEvent(this.RandomChangeDirection.bind(this), .05)
            if(gamePlaying){
                RandomEvent(this.DropCoin.bind(this), .05)
            }

            if(this.Position.IsOutsideWindow(this.Size)){
                await this.HitEdge()
            }
            else{
                //Update position in direction at speed
                await this.Position.UpdatePositionWithVelocity(this.Speed)
            }
            await new Promise(r => setTimeout(r, refreshRate));
        }
    }

    async StartLoopingAnimations(){
        let flipper = this.Element.querySelector(".Flipper").children[0]
        let tail = this.Element.querySelector(".Tail").children[0]
        while(!this.Removed) {
            await Promise.all([this.FlipperFlop(flipper), this.TailSwish(tail)])
        }
    }

    async FlipperFlop(flipper){
        flipper.style.transform = "rotate(30deg) scaleY(.5)"
        await new Promise(r => setTimeout(r, 500));
        flipper.style.transform = "rotate(-5deg) scaleY(1)"
        await new Promise(r => setTimeout(r, 500));
    }

    async TailSwish(tail){
        tail.style.transform = "rotate(-20deg) scaleY(1.2)"
        await new Promise(r => setTimeout(r, 500));
        tail.style.transform = "rotate(15deg) scaleY(.8)"
        await new Promise(r => setTimeout(r, 500));
    }

    //When edge is hit, flip fish and reverse velocity
    async HitEdge(){
        await this.Position.MoveBackInsideWindow(this.Size)
        await this.Position.UpdatePosition().then(r => {
            PlayRandomizedSound("glassTap")
            this.Flip()
            this.Position.UpdatePositionWithVelocity(this.Speed)
        })
    }

    async RandomChangeDirection(){
        let directionChange = this.Position.DirectionAngle + ((Math.random() - .5) * 60)
        this.Position.DirectionAngle = directionChange
        await this.Position.UpdateDirection()
    }

    async Flip(){
        this.Blink()
        this.Talk()
        this.Position.DirectionAngle += 180
        this.Position.UpdateDirection()
    }

    async Blink(){
        await this.SetEyeState(State.Open)
        await this.SetEyeState(State.Closed)
        await new Promise(r => setTimeout(r, 500));
        await this.SetEyeState(State.Open)
    }

    async Talk(){
        await this.SetMouthState(State.Closed)
        await this.SetMouthState(State.Open)
        await new Promise(r => setTimeout(r, 500));
        await this.SetMouthState(State.Closed)
    }

    async DropCoin(){
        let coin = new Coin(this.Coin.Value, this.Coin.ImagePath)
        coin.Position = new Position(0, this.Position.X, this.Position.Y)
        coin.Drop()
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

    async Remove(){
        this.Speed = 0;
        this.Removed = true
        await CatchFish(this)
        this.Element.remove()
    }
}

function GetRandomFish(){
    let fishJson = allJsonFish[Math.floor(Math.random() * allJsonFish.length)]
    let fish = ConvertJsonToFish(fishJson)
    return fish
}

function AddOneOfEach(){
    allJsonFish.forEach(fishJson => {
        let fish = ConvertJsonToFish(fishJson)
        fish.Position = GetRandomPosition(fish.Size)
        fish.SilentEntrance = true
        fish.BuildFish()
    })
    PlayRandomizedSound("waterDrop")
}

function AddRandomFish(){
    let randomFishCount = document.getElementById('input-AddRandomFish').value
    for(let i = 0; i < randomFishCount; i++){
        let fish = GetRandomFish()
        fish.Position = GetRandomPosition(fish.Size)
        fish.SilentEntrance = true
        fish.BuildFish()
    }
    PlayRandomizedSound("waterDrop")
}