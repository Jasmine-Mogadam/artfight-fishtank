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
        this.Score = 0;
        this.Coins = 3;
        this.Time = gameTime; //in milliseconds
        this.UpdateGui();
    }

    SpendCoin(price){
        this.Coins -= price;
        this.IncreaseScore(price * 100)
        this.UpdateGui();
    }

    CoinCollected(value) {
        this.Coins += value;
        this.IncreaseScore(value * 100)
        this.UpdateGui();
    }

    IncreaseScore(value) {
        this.Score += value;
        this.UpdateGui();
    }

    UpdateTime(millisecondsPassed){
        this.Time -= millisecondsPassed
        this.UpdateGui();
    }

    GetTimeAsString(){
        let timeInSeconds = this.Time / 1000
        let minutes = Math.floor(timeInSeconds / 60)
        let seconds = timeInSeconds - minutes * 60

        let stringToReturn = minutes + ":"
        if(seconds < 10){
            stringToReturn += "0" + seconds
        }
        else{
            stringToReturn += seconds
        }

        return stringToReturn
    }

    UpdateGui() {
        // Assuming you have elements in your HTML to display the score and coin count
        document.getElementById("score-display").textContent = "Score: " + this.Score
        document.getElementById("coin-display").textContent = "Coins: " + this.Coins
        document.getElementById("timer-display").textContent = "Time: " + this.GetTimeAsString()
    }

    ClearGui(){
        document.getElementById("score-display").textContent = "";
        document.getElementById("coin-display").textContent = "";
        document.getElementById("timer-display").textContent = "";
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
    let waitForExistingFishToDisappear = refreshRate < 1000 ? 11000 : refreshRate + 100
    await new Promise(r => setTimeout(r, waitForExistingFishToDisappear))
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

    scoreSystem = new ScoreSystem()

    //Once time is up, game ends
    while(scoreSystem.Time >= 0){
        await new Promise(resolve => setTimeout(resolve, 1000)) //wait 1 second
        scoreSystem.UpdateTime(1000) //Update gui with time
    }

    await DisplayEndScreen()
    CleanUpAfterGame()
}

//Show final score with screenshot of fish tank
async function DisplayEndScreen(){
    let captureElement = document.getElementById("capture")
    let splashElement = document.getElementById("game-end-splash")
    await html2canvas(captureElement).then(canvas => {
        splashElement.appendChild(canvas)
    });
    $("#game-end-splash").toggleClass('hidden');
    document.getElementById("splash-black-screen").style.opacity = ".3"
}

//Re-adds start button, turns all game fish into fish, removes gui
function CleanUpAfterGame(){
    $('.game-fish').remove()
    $("#button-StartGame").toggleClass('hide-button')
    $("#button-fish").toggleClass('hide-button')
    $("#button-about").toggleClass('hide-button')
    $("#button-settings").toggleClass('hide-button')
    scoreSystem.ClearGui()
    scoreSystem = null

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