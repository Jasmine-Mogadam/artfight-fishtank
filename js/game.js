/*
Fish drop coins
Use coins to buy more fish (random)
*/
gameElements = [
    { fishPrice: 3, coinValue: 1, coinPath: "/Images/Coins/0/Coin.gif" },
    { fishPrice: 5, coinValue: 3, coinPath: "/Images/Coins/1/Coin.gif" },
    { fishPrice: 10, coinValue: 4, coinPath: "/Images/Coins/2/Coin.gif" },
    { fishPrice: 15, coinValue: 5, coinPath: "/Images/Coins/3/Coin.gif" },
    { fishPrice: 20, coinValue: 10, coinPath: "/Images/Coins/4/Coin.gif" },
]

class ScoreSystem {
    constructor() {
        this.score = 0;
        this.coins = 3;
        this.UpdateGui();
    }

    CollectCoin(coin) {
        this.coins += coin.Value;
        this.IncreaseScore(coin.Value * 100)
        this.UpdateGui();
    }

    IncreaseScore(value) {
        this.score += value;
        this.UpdateGui();
    }

    UpdateGui() {
        // Assuming you have elements in your HTML to display the score and coin count
        document.getElementById("score-display").textContent = `Score: ${this.score}`;
        document.getElementById("coin-count").textContent = `Coins: ${this.coins}`;
        document.getElementById("timer-display").textContent = `Time Remaining: ${this.time}`;
    }
}

async function StartGame(){
    //do not run if game is in play
    if(gamePlaying){
        return
    }
    gamePlaying = true

    //remove everything off the screen
    $('.tank-fish').remove();
    clearScreen = true;
    await new Promise(r => setTimeout(r, refreshRate + 100))
    clearScreen = false;

    $("#button-StartGame").toggleClass('hide-button')
    $("#button-fish").toggleClass('hide-button')
    $("#button-about").toggleClass('hide-button')
    $("#button-settings").toggleClass('hide-button')

    let shopFish = GetShopFish(5)

    for (let i = 0; i < gameElements.length; i++) {
        let coin = new Coin(gameElements[i].coinValue, gameElements[i].coinPath)
        shopFish[i].Coin = coin
        shopFish[i].Price = gameElements[i].fishPrice
        let elementToAppend = "" +
            "<div class='game-fish' draggable='true' id='" + JSON.stringify(shopFish[i]) + "'" +
            " ondragstart='drag(event)' ontouchmove='mobileDrag(event)' ontouchend='mobileDragEnd(event)''>" +
            "   <div class='fish-price'>" + shopFish[i].Price + " Coins</div>" +
            "   <img class='fish-thumb' src='" + shopFish[i].Thumb + "' id='" + JSON.stringify(shopFish[i]) + "'/>" +
            "</div>"
        $("#fish-store").append(elementToAppend)
    }

    //Set timer for 3 minutes, once time is up game ends
    let timeElapsed = 0
    while(timeElapsed < 180000){ //3 minutes
        //Update gui with time
        console.log(timeElapsed)
        await new Promise(resolve => setTimeout(resolve, 1000))
        timeElapsed += 1000
    }

    DisplayEndScreen()
    CleanUpAfterGame()
}

//Show final score with screenshot of fish tank
function DisplayEndScreen(){

}

//Re-adds start button, turns all game fish into fish, removes gui
function CleanUpAfterGame(){
    $('.game-fish').remove();
    $("#button-StartGame").toggleClass('hide-button')
    $("#button-fish").toggleClass('hide-button')
    $("#button-about").toggleClass('hide-button')
    $("#button-settings").toggleClass('hide-button')

    gamePlaying = false
}

function GetShopFish(fishToReturn){
    let shopFish = []
    while(shopFish.length < fishToReturn){
        let fish = GetRandomFish()
        if(shopFish.find(f => f.Path == fish.Path) == undefined){
            shopFish.push(fish)
        }
    }

    return shopFish
}