let coinId = 0

class Coin {
    constructor(value, path) {
        this.Value = value
        this.ImagePath = path
        this.Size = 150 * sizeMultiplier
        this.Removed = false
        this.ImageLoaded = false
        this.Position = null
        this.Element = null
    }

    async Drop(){
        let elementToAppend = "" +
            "<div class='coin' id='coin-" + coinId + "' style='width:" + this.Size + "px; height:" + this.Size + "px;'>" +
            "   <img src='" + this.ImagePath + "' id='coin-img-" + coinId + "'/>" +
            "</div>"
        $("#tank").append(elementToAppend)
        this.Element = document.getElementById("coin-" + coinId)
        this.Element.onclick = event => this.CollectCoin()
        this.Element.ontouchstart = event => this.CollectCoin()
        this.Position.Element = this.Element
        this.Element.children[0].onload = event => this.SetImageLoadedToTrue()

        coinId++
        await this.CoinFall()
    }

    SetImageLoadedToTrue(){
        this.ImageLoaded = true
    }

    async CoinFall(){
        await this.Position.UpdatePosition()

        //prevent animation from playing before coin is loaded in
        while(this.ImageLoaded == false){
            await new Promise(resolve => setTimeout(resolve, 100))
        }

        this.Position.Y = height * 1.25
        await this.Position.UpdatePosition()
        await new Promise(resolve => setTimeout(resolve, 10000))
        if(!this.Removed){
            this.DeleteCoin()
        }
    }

    DeleteCoin() {
        this.Removed = true
        this.Element.remove()
    }

    async CollectCoin(){
        scoreSystem.CoinCollected(this.Value)
        PlayRandomizedSound("glassTap")
        this.DeleteCoin()
    }
}