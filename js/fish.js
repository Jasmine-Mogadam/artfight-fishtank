const State = {
    Open: 0,
    Closed: 1
}
const audioContext = new AudioContext();
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

        let strToAppend = "<div class='tank-fish' id='" + this.id + "' style='width:" + this.Size + "px;" +
            "height:" + this.Size + "px;'>"
        strToAppend += "<div class='Tail fish-part'><img src='" + this.Tail + "'\></div>"
        strToAppend += "<div class='Body fish-part'><img src='" + this.Body + "'\></div>"
        strToAppend += "<div class='Flipper fish-part'><img src='" + this.Flipper + "'\></div>"
        strToAppend += "<div class='Mouth fish-part'><img src='" + this.ClosedMouth + "'\></div>"
        strToAppend += "<div class='Eye fish-part'><img src='" + this.OpenEye + "'\></div>"
        strToAppend += "</div></div>"
        $(".tank").append(strToAppend)

        this.Element = document.getElementById(this.id)

        this.PlayRandomizedSound("waterDrop")
        this.Swim().then(r => this.Element.remove())
    }

    async Swim(){
        this.StartLoopingAnimations()
        while(!this.Removed){
            //At random:
            // blink
            // talk
            // change direction
            this.RandomEvent(this.Blink.bind(this), .10)
            this.RandomEvent(this.Talk.bind(this), .05)
            this.RandomEvent(this.RandomChangeDirection.bind(this), .05)

            //Update position in direction at speed
            await this.UpdatePositionWithVelocity()
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

    //If deg is in first or fourth quadrant, flip
    //If position is at the edge of the tank, reverse direction
    IsAtEdge(){
        let hitBoxDiameter = this.Size / 2.0
        let xOutOfBounds = (this.Position.X - hitBoxDiameter < 0) || (this.Position.X + hitBoxDiameter > width)
        let yOutOfBounds = (this.Position.Y - hitBoxDiameter < 0) || (this.Position.Y + hitBoxDiameter > height)
        return xOutOfBounds || yOutOfBounds
    }

    //When edge is hit, flip fish and reverse velocity
    async HitEdge(){
        await this.MoveToEdge()
        await this.UpdatePosition().then(r => {
            this.PlayRandomizedSound("glassTap")
            this.Flip()
            this.UpdatePositionWithVelocity()
        })
    }

    async MoveToEdge(){
        //Set position to wall
        let hitBoxDiameter = this.Size / 2.0
        if(this.Position.X - hitBoxDiameter < 0){
            this.Position.X = 0 + hitBoxDiameter
        }
        else if(this.Position.X + hitBoxDiameter > width){
            this.Position.X = width - hitBoxDiameter
        }
        if(this.Position.Y - hitBoxDiameter < 0){
            this.Position.Y = 0 + hitBoxDiameter
        }
        else if(this.Position.Y + hitBoxDiameter > height){
            this.Position.Y = height - hitBoxDiameter
        }
    }

    async PlayFishHitEdgeSound(){
        let randomGlassTap = Math.floor(Math.random() * 3)
        let randomPitch = Math.random()*.5 + .75 //.75 to 1.25

        loadSample("Sound/glassTap-" + randomGlassTap + ".mp3")
            .then(sample => playSample(sample, randomPitch));
    }

    async PlayRandomizedSound(soundName){
        let randomGlassTap = Math.floor(Math.random() * 3)
        let randomPitch = Math.random() + .5

        loadSample("Sound/" + soundName + "-" + randomGlassTap + ".mp3")
            .then(sample => playSample(sample, randomPitch));
    }

    async RandomEvent(event, chance){
        let eventRoll = Math.random()
        if(eventRoll < chance){
            event()
        }
    }

    async RandomChangeDirection(){
        let directionChange = this.Position.DirectionAngle + ((Math.random() - .5) * 60)
        this.SetDirection(directionChange)
    }

    async Flip(){
        console.log(3)
        this.Blink()
        this.Talk()
        this.SetDirection(this.Position.DirectionAngle + 180)
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
        this.Element.style.transform = "rotate(" + angle + "deg) scaleY(" + scale + ")"
        this.Element.style.angle = angle
    }

    async UpdatePositionWithVelocity(){
        let directionRadians = this.Position.DirectionAngle * (Math.PI / 180)
        //do trig with direction angle and speed to find new positions
        let newX = this.Position.X + Math.cos(directionRadians) * this.Speed * refreshRate/1000
        let newY = this.Position.Y + Math.sin(directionRadians) * this.Speed * refreshRate/1000

        if(this.IsAtEdge()){
            await this.HitEdge()
        }
        else{
            this.Element.style.left = newX + "px"
            this.Element.style.top = newY + "px"

            // move to position
            this.Position.X = newX
            this.Position.Y = newY

            await this.SetDirection(this.Position.DirectionAngle)
        }
    }

    async UpdatePosition(){
        this.Element.style.left = this.Position.X
        this.Element.style.top = this.Position.Y
        await this.SetDirection(this.Position.DirectionAngle)
    }

    Remove(){
        this.Removed = true
    }
}