var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

var height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

addEventListener( "resize", function(event) {
    width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
});

class Position {
    constructor(directionAngle, x, y) {
        this.DirectionAngle = directionAngle
        this.X = x
        this.Y = y
        this.Element = null //assumes element width and height are equal
    }

    async UpdatePositionWithVelocity(speed){
        let directionRadians = this.DirectionAngle * (Math.PI / 180)
        //do trig with direction angle and speed to find new positions
        let newX = this.X + Math.cos(directionRadians) * speed * refreshRate/1000
        let newY = this.Y + Math.sin(directionRadians) * speed * refreshRate/1000

        this.X = newX
        this.Y = newY

        await this.UpdatePosition()
    }

    async UpdatePosition(){
        this.Element.style.left = this.X + "px"
        this.Element.style.top = this.Y + "px"
        await this.UpdateDirection(this.DirectionAngle)
    }

    async UpdateDirection(){
        let unitAngle = this.DirectionAngle % 360
        if(unitAngle < 0){
            unitAngle += 360
        }
        let scale = unitAngle < 270 && unitAngle > 90 ? -1 : 1
        this.Element.style.transform = "rotate(" + this.DirectionAngle + "deg) scaleY(" + scale + ")"
        this.Element.style.angle = this.DirectionAngle
    }

    //If deg is in first or fourth quadrant, flip
    //If position is at the edge of the tank, reverse direction
    IsOutsideWindow(elementSize){
        let hitBoxDiameter = elementSize / 2.0
        let xOutOfBounds = (this.X - hitBoxDiameter < 0) ||
            (this.X + hitBoxDiameter > width)
        let yOutOfBounds = (this.Y - hitBoxDiameter < 0) ||
            (this.Y + hitBoxDiameter > height)
        return (xOutOfBounds || yOutOfBounds)
    }

    //Set position to wall/side element is closest to
    async MoveBackInsideWindow(elementSize){
        let hitBoxDiameter = elementSize / 2.0
        if(this.X - hitBoxDiameter < 0){
            this.X = 0 + hitBoxDiameter
        }
        else if(this.X + hitBoxDiameter > width){
            this.X = width - hitBoxDiameter
        }
        if(this.Y - hitBoxDiameter < 0){
            this.Y = 0 + hitBoxDiameter
        }
        else if(this.Y + hitBoxDiameter > height){
            this.Y = height - hitBoxDiameter
        }
    }
}

function GetRandomPosition(elementSize){
    let randomAngle = Math.random() * 360
    let randomX = Math.random() * width - elementSize
    let randomY = Math.random() * height - elementSize

    let randomPosition = new Position(randomAngle, randomX, randomY)

    return randomPosition
}