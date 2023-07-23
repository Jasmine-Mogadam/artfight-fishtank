/*
Fish drop coins
Use coins to buy more fish (random)
*/
class Coin {
    constructor(value, path, x, y) {
        this.Value = value;
        this.Path = path;
        this.X = x;
        this.Y = y;
        this.Removed = false;
        this.Element = null;
    }
}

class Game{
    constructor() {
        this.ShopFish = []
        this.Gui = new Gui()
    }

    Start(){
        this.GenerateShopFish()
    }

    GenerateShopFish(){
        while(this.ShopFish.length < 5){
            let fish = GetRandomFish()
            if(!this.ShopFish.contains(fish)){
                this.ShopFish.append(fish)
            }
        }
    }

    AddFish(type){

    }
}

function Start(){
    let game = new Game()
    game.Start()
}