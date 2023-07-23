let netId = 0
let offScreen = -600
class Net{
    constructor() {
        let elementToAppend = "" +
            "<div class=\"net\" id=\"net-" + netId + "\">" +
            "   <img src=\"Images/net.png\">" +
            "</div>"

        $("#net-holder").append(elementToAppend)
        this.Element = document.getElementById("net-" + netId)

        this.Element.children[0].onload = event => this.SetImageLoadedToTrue()
        this.ImageLoaded = false

        this.Position = new Position(0, 500, offScreen)
        this.Position.Element = this.Element
        this.Position.UpdatePosition()
        netId++
    }

    SetImageLoadedToTrue(){
        this.ImageLoaded = true
    }
}

//Animation of a net scooping a fish out of the tank
async function CatchFish(fish){
    let net = new Net()

    //prevent animation from playing before net is loaded in
    while(net.ImageLoaded == false){
        await new Promise(resolve => setTimeout(resolve, 100))
    }

    //Net moves towards fish
    net.Position.X = fish.Position.X - fish.Size
    net.Position.Y = fish.Position.Y - fish.Size
    await net.Position.UpdatePosition()
    await new Promise(resolve => setTimeout(resolve, 1000))

    //Net and fish move up offscreen
    net.Position.X = 500
    net.Position.Y = offScreen
    fish.Position.X = 500
    fish.Position.Y = fish.Size + offScreen
    await fish.Position.UpdatePosition()
    await net.Position.UpdatePosition()
    await new Promise(resolve => setTimeout(resolve, 1000))

    //delete net
    net.Element.remove()
}