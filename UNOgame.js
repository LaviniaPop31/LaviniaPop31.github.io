
class Card {
    constructor(color, value) {
        this.color = color;
        this.value = value;
        this.id = value + "-" + color
        this.src = 'images/' + this.id + '.png';
    }
    display() {
        return '<img id=' + this.id + ' src=' + this.src + '>';
    }
}

class Deck {
    constructor() {
        this.cards = [];
    }
    createDeck() {
        // let totalCards = 100;
        let colors = ['blue', 'green', 'red', 'yellow'];
        let values = ['0', 'Wild', '+4', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+2', 'Skip', '1', '2',
            '3', '4', '5', '6', '7', '8', '9', '+2', 'Skip'];

        for (let i = 0; i < colors.length; i++) {
            for (let j = 0; j < values.length; j++) {
                this.cards.push(new Card(colors[i], values[j]));

            }
        }
    }

    shuffleDeck() {
        let shuffledDeck = [];
        let unshuffledDeck = this.cards;

        do {
            let index = Math.floor(Math.random() * unshuffledDeck.length);

            shuffledDeck.push(unshuffledDeck.splice(index, 1)[0]);

        }
        while (unshuffledDeck.length)
        this.cards = shuffledDeck;
    }


}

class Player {
    constructor(name) {
        this.playerName = name;
        this.playerCards = [];
        this.playerChoice = [];

        //playerCards - cards in hand
        //playerChoice - cards that were played
    }
    get numberOfCards() {
        return 'Number of cards: ' + this.cardsNumber();
    }
    cardsNumber() {
        return this.playerCards.length
    }

    displayPictures() {
        let allCards = '';
        for (let i = 0; i < this.playerCards.length; i++) {
            allCards += this.playerCards[i].display();
        }
        return allCards;
    }

}

class Board {
    constructor() {
        this.cardsFromDeck = [];
        this.cardsInMiddle = [];
        this.players = [];
        this.contorPlus = 0;
        // cardsFromDeck are the cards that players can take when they don't have a matching card
        // contorPlus is suppose to work when the players add +2 over +2 or +4, it keeps the count
        // cardsInMiddle are the cards that players added
    }
    start(firstPlayer, secondPlayer, thirdPlayer, fourtPlayer) {
        this.players.push(new Player(firstPlayer));
        this.players.push(new Player(secondPlayer));
        this.players.push(new Player(thirdPlayer));
        this.players.push(new Player(fourtPlayer));

        let x = new Deck();
        x.createDeck();
        x.shuffleDeck();

        this.players[0].playerCards = x.cards.slice(0, 7);
        this.players[1].playerCards = x.cards.slice(7, 14);
        this.players[2].playerCards = x.cards.slice(14, 21);
        this.players[3].playerCards = x.cards.slice(21, 28);
        this.cardsInMiddle = x.cards.slice(28, 29);
    }
}
//debugger
//start of game

let d = new Deck();
d.createDeck();
d.shuffleDeck();
console.log(d.cards)

let y = new Board();
y.start('Maria', 'Anne', 'Taylor', 'Vanessa');
y.cardsInMiddle = d.cards.slice(28, 29);
y.cardsFromDeck = d.cards.slice(29, 100);
console.log(y.cardsFromDeck)

var curentCard = y.cardsInMiddle[y.cardsInMiddle.length - 1];
var curentColor = y.cardsInMiddle[y.cardsInMiddle.length - 1].color;
var curentValue = y.cardsInMiddle[y.cardsInMiddle.length - 1].value;

let sameColorCards = [];
let sameNumbers = [];
let cardsThatMatch = [...sameColorCards, ...sameNumbers];
let sameValue = [];
let cardsWithDraw = [];
displayWrongCardError(false)
takeCardFromDeck()
displayCardFromDeck()
displayCards();
displayMiddleCard(curentCard);
numberPlayerCards();
instructions();

function click() {
    let cardsSection = document.getElementById('player1');
    let clickCards = Array.from(cardsSection.querySelectorAll('img'));
    clickCards.forEach(card => {
        card.addEventListener('click', () => {
            var clickedCard = getClickedCard(card.id)
            console.log(clickedCard)
            displayWrongCardError(false)
            playOneFullTurn(clickedCard, curentCard)

        })

    });
}

function playOneFullTurn(clickedCard, curentCard) {

    for (let j = 0; j < y.players.length; j++) {
        delay(j, clickedCard, curentCard);
    }
}
function delay(j, clickedCard, curentCard) {
    //set time between the players
    setTimeout(() => {
        curentCard = y.cardsInMiddle[y.cardsInMiddle.length - 1];
        var curentPlayer = y.players[j];
        var nextPlayer = y.players[j + 1] || y.players[0];
        var previousPlayer = y.players[j - 1] || y.players[3];



        gameRules(curentPlayer, y.cardsInMiddle[y.cardsInMiddle.length - 1].value, previousPlayer, clickedCard, y.contorPlus);

        console.log('Next player ', nextPlayer)
        console.log('Previous player', previousPlayer)
        console.log('Curent player ', curentPlayer)
        console.log(y.players[j].numberOfCards)

        curentCard = y.cardsInMiddle[y.cardsInMiddle.length - 1];
        displayCards();
        displayMiddleCard(curentCard);
        numberPlayerCards()
        let validateEndGame = checkEndOfGame(curentPlayer)
        if (validateEndGame === true) {
            return;
        }


    }, j * 1500);
}

// curentCard, curentValue, curentColor is the card that was played last and is in the middle
// clickedCard is the card on first player clicked
// contorPlus is suppose to work when the players add +2 over +2 or +4, it keeps the count
// cardsInMiddle are the cards that players added
function gameRules(curentPlayer, curentValue, previousPlayer, clickedCard, contorPlus) {
    console.log(y.cardsInMiddle)

    if (curentValue === '+4') {

        wildDrawFour(previousPlayer, curentPlayer, clickedCard, contorPlus);
    } else if (curentValue === '+2') {
        drawTwo(previousPlayer, curentPlayer, clickedCard, contorPlus, curentColor);
    } else if (curentValue === 'Skip') {
        skip(previousPlayer, curentPlayer, y.cardsInMiddle[y.cardsInMiddle.length - 1].color, y.cardsInMiddle[y.cardsInMiddle.length - 1], clickedCard);
    } else if (curentValue === 'Wild') {
        wild(curentPlayer, clickedCard);
    } else {
        anotherCard(curentPlayer, y.cardsInMiddle[y.cardsInMiddle.length - 1].color, y.cardsInMiddle[y.cardsInMiddle.length - 1].value, clickedCard);
    }

}


//handeling the situation when is +4 in the middle
function wildDrawFour(previousPlayer, curentPlayer, clickedCard, contorPlus) {

    // handeling the situation when +4 is the first card in the game
    if (previousPlayer.playerChoice.length === 0) {
        cardsWithDraw = [];
        for (let i = 0; i < curentPlayer.playerCards.length; i++) {
            if (curentPlayer.playerCards[i].value === '+4') {

                cardsWithDraw.push(curentPlayer.playerCards[i]);
            }
        }
        if (cardsWithDraw.length > 0) {
            //checking if the curent player is the first one or the others
            if (curentPlayer === y.players[0]) {
                for (let i = 0; i < cardsWithDraw.length; i++) {
                    if (cardsWithDraw[i].id === clickedCard.id) {
                        y.cardsInMiddle.push(clickedCard)
                        curentPlayer.playerChoice.push(clickedCard)
                        let index2 = curentPlayer.playerCards.indexOf(clickedCard)
                        curentPlayer.playerCards.splice(index2, 1);

                        if (clickedCard.value === '+4') {
                            contorPlus += 4
                        }
                    }
                }
            } else {
                let index = Math.floor(Math.random() * cardsWithDraw.length);
                let choice = cardsWithDraw.splice(index, 1)
                y.cardsInMiddle.push(choice[0]);
                let index2 = curentPlayer.playerCards.indexOf(choice[0])
                curentPlayer.playerCards.splice(index2, 1);
                curentPlayer.playerChoice.push(choice[0]);

                if (choice[0].value === '+4') {
                    contorPlus += 4
                }
            }
        } else if (cardsWithDraw.length === 0) {
            // over the +4 we can put any card
            if (curentPlayer === y.players[0]) {
                y.cardsInMiddle.push(clickedCard)
                curentPlayer.playerChoice.push(clickedCard)
                let index2 = curentPlayer.playerCards.indexOf(clickedCard)
                curentPlayer.playerCards.splice(index2, 1);
            } else {
                let index = Math.floor(Math.random() * curentPlayer.playerCards.length);
                let choice = curentPlayer.playerCards.splice(index, 1);
                y.cardsInMiddle.push(choice[0]);
                curentPlayer.playerChoice.push(choice[0]);
            }
        }

        // handeling the situation when +4 is the previousPlayer's choice
    } else if (previousPlayer.playerChoice[previousPlayer.playerChoice.length - 1].value === '+4') {
        // if the curent player has a +4 card he can put it down if not he has to take cards
        cardsWithDraw = [];
        for (let i = 0; i < curentPlayer.playerCards.length; i++) {
            if (curentPlayer.playerCards[i].value === '+4') {

                cardsWithDraw.push(curentPlayer.playerCards[i].value === '+4');
            }
        }

        if (cardsWithDraw.length !== 0) {
            // checking if the curent player is the first player or the others
            if (curentPlayer === y.players[0]) {
                for (let i = 0; i < cardsWithDraw.length; i++) {
                    if (cardsWithDraw[i].id === clickedCard.id) {
                        y.cardsInMiddle.push(clickedCard)
                        curentPlayer.playerChoice.push(clickedCard)
                        let index2 = curentPlayer.playerCards.indexOf(clickedCard)
                        curentPlayer.playerCards.splice(index2, 1);
                        if (clickedCard.value === '+4') {
                            contorPlus += 4
                        }
                    }
                }
            } else {
                let index = Math.floor(Math.random() * cardsWithDraw.length);
                let choice = cardsWithDraw.splice(index, 1)
                y.cardsInMiddle.push(choice[0]);
                let index2 = curentPlayer.playerCards.indexOf(choice[0]);
                curentPlayer.playerCards.splice(index2, 1);
                curentPlayer.playerChoice.push(choice[0]);
                if (choice[0].value === '+4') {
                    contorPlus += 4
                }
            }
        } else if (cardsWithDraw.length === 0) {
            if (curentPlayer === y.players[0]) {

            } else {
                drawMoreCards(previousPlayer, contorPlus, y.cardsInMiddle[y.cardsInMiddle.length - 1].value, curentPlayer);
            }
        }
        // handeling the situation when +4 is not the previousPlayer's choice
    } else if (previousPlayer.playerChoice[previousPlayer.playerChoice.length - 1].value !== '+4') {
        // over the +4 we can put any card
        if (curentPlayer === y.players[0]) {
            y.cardsInMiddle.push(clickedCard)
            curentPlayer.playerChoice.push(clickedCard)
            let index2 = curentPlayer.playerCards.indexOf(clickedCard)
            curentPlayer.playerCards.splice(index2, 1);
        } else {
            let index = Math.floor(Math.random() * curentPlayer.playerCards.length);
            let choice = curentPlayer.playerCards.splice(index, 1);
            y.cardsInMiddle.push(choice[0]);
            curentPlayer.playerChoice.push(choice[0]);
        }
    }
}


//handeling the situation when is +2 in the middle
function drawTwo(previousPlayer, curentPlayer, clickedCard, contorPlus, curentColor) {

    // handeling the situation when +2 is the first card in the game
    if (previousPlayer.playerChoice.length === 0) {

        drawTwo1(curentPlayer, clickedCard, contorPlus)

        // handeling the situation when +2 is the previousPlayer's choice
    } else if (previousPlayer.playerChoice[previousPlayer.playerChoice.length - 1].value === '+2') {

        drawTwo2(curentPlayer, previousPlayer, clickedCard, contorPlus)

        // handeling the situation when +2 isn't previousPlayer's choice
    } else if (previousPlayer.playerChoice[previousPlayer.playerChoice.length - 1].value !== '+2') {

        drawTwo3(curentPlayer, clickedCard, curentColor)
    }
}

// handeling the situation when +2 is the first card in the game
// if the player has a +2 card he can put it if not he can put any other card with the same color
function drawTwo1(curentPlayer, clickedCard, contorPlus) {
    cardsWithDraw = [];
    for (let i = 0; i < curentPlayer.playerCards.length; i++) {
        if (curentPlayer.playerCards[i].value === '+2' || curentPlayer.playerCards[i].value === '+4') {

            cardsWithDraw.push(curentPlayer.playerCards[i]);
        }
    }
    if (cardsWithDraw.length > 0) {
        if (curentPlayer === y.players[0]) {
            for (let i = 0; i < cardsWithDraw.length; i++) {
                if (cardsWithDraw[i].id === clickedCard.id) {
                    y.cardsInMiddle.push(clickedCard)
                    curentPlayer.playerChoice.push(clickedCard)
                    let index2 = curentPlayer.playerCards.indexOf(clickedCard)
                    curentPlayer.playerCards.splice(index2, 1);
                    if (clickedCard.value === '+2') {
                        contorPlus += 2;
                    } else if (clickedCard.value === '+4') {
                        contorPlus += 4
                    }
                }
            }

        } else {
            let index = Math.floor(Math.random() * cardsWithDraw.length);
            let choice = cardsWithDraw.splice(index, 1)
            y.cardsInMiddle.push(choice[0]);
            let index2 = curentPlayer.playerCards.indexOf(choice[0])
            curentPlayer.playerCards.splice(index2, 1);
            curentPlayer.playerChoice.push(choice[0]);
            if (choice[0].value === '+2') {
                contorPlus += 2;
            } else if (choice[0].value === '+4') {
                contorPlus += 4
            }
        }
    } else if (cardsWithDraw.length === 0) {
        cardsThatMatch = []; // to delete the previous cards
        for (let i = 0; i < curentPlayer.playerCards.length; i++) {
            if (curentColor === curentPlayer.playerCards[i].color) {

                cardsThatMatch.push(curentPlayer.playerCards[i]);

            }
        }
        addingMatchingCards(cardsThatMatch, curentPlayer, clickedCard)
    }
}

// handeling the situation when +2 is the previousPlayer's choice
// if the player has +2 or +4 he can added if not has to take cards
function drawTwo2(curentPlayer, previousPlayer, clickedCard, contorPlus) {
    cardsWithDraw = [];
    for (let i = 0; i < curentPlayer.playerCards.length; i++) {
        if (curentPlayer.playerCards[i].value === '+2' || curentPlayer.playerCards[i].value === '+4') {

            cardsWithDraw.push(curentPlayer.playerCards[i]);
        }
    }

    if (cardsWithDraw.length !== 0) {
        if (curentPlayer === y.players[0]) {
            for (let i = 0; i < cardsWithDraw.length; i++) {
                if (cardsWithDraw[i].id === clickedCard.id) {
                    y.cardsInMiddle.push(clickedCard)
                    curentPlayer.playerChoice.push(clickedCard)
                    let index2 = curentPlayer.playerCards.indexOf(clickedCard)
                    curentPlayer.playerCards.splice(index2, 1);
                    if (clickedCard.value === '+2') {
                        contorPlus += 2;
                    } else if (clickedCard.value === '+4') {
                        contorPlus += 4
                    }
                }
            }
        } else {
            let index = Math.floor(Math.random() * cardsWithDraw.length);
            let choice = cardsWithDraw.splice(index, 1)
            y.cardsInMiddle.push(choice[0]);
            let index2 = curentPlayer.playerCards.indexOf(choice[0]);
            curentPlayer.playerCards.splice(index2, 1);
            curentPlayer.playerChoice.push(choice[0]);
            console.log(choice[0].value)
            if (choice[0].value === '+2') {
                contorPlus += 2;
            } else if (choice[0].value === '+4') {
                contorPlus += 4
            }
        }
    } else if (cardsWithDraw.length === 0) {
        if (curentPlayer === y.players[0]) {

        } else {
            drawMoreCards(previousPlayer, contorPlus, y.cardsInMiddle[y.cardsInMiddle.length - 1].value, curentPlayer);
        }
    }
}

// handeling the situation when +2 isn't previousPlayer's choice
// that means that the draw cards were taken and now has to add the same color card
function drawTwo3(curentPlayer, clickedCard, curentColor) {
    cardsThatMatch = []; // to delete the previous cards
    for (let i = 0; i < curentPlayer.playerCards.length; i++) {
        if (curentColor === curentPlayer.playerCards[i].color) {

            cardsThatMatch.push(curentPlayer.playerCards[i]);
        }
    }

    addingMatchingCards(cardsThatMatch, curentPlayer, clickedCard)

    // if (sameColorCards.length === 0) {
    //     getCardFromDeck(curentPlayer);
    //     // curentPlayer.playerCards.push(y.cardsFromDeck[y.cardsFromDeck.length - 1]);
    //     // y.cardsFromDeck.pop();
    //     console.log(y.cardsFromDeck);
    //     console.log(curentPlayer.playerCards);
    // } else {
    //     let index = Math.floor(Math.random() * sameColorCards.length);
    //     var choice = sameColorCards.splice(index, 1)
    //     y.cardsInMiddle.push(choice[0]);
    //     let index2 = curentPlayer.playerCards.indexOf(choice[0]);
    //     curentPlayer.playerChoice.push(choice[0]);
    //     curentPlayer.playerCards.splice(index2, 1);
    //     console.log('playerCards after removing one ', curentPlayer.playerCards)

    // }
}

// handeling the situation when the first player is stoped
function skip(previousPlayer, curentPlayer, curentColor, curentCard, clickedCard) {
    var lastCard = false;

    if (curentCard === previousPlayer.playerChoice[previousPlayer.playerChoice.length - 1]) {
        lastCard = true;
    }

    if (lastCard === false) {
        skipSecondPart(curentPlayer, curentColor, clickedCard);
    } else {
        // checks if the first player turn is valide, if false return false
        let isTurnValide = skipFirstPart(curentPlayer, clickedCard);
        if (isTurnValide === false) {
            return false;
        }
    }
    return true;
}

// handeling the situation when curentPlayer is stoped, he can add just a skip card if he has, if not nextPlayer plays
function skipFirstPart(curentPlayer, clickedCard) {
    cardsThatMatch = [];

    // if the curent player has a Skip card, he can put it
    for (let i = 0; i < curentPlayer.playerCards.length; i++) {
        if (curentPlayer.playerCards[i].value === 'Skip') {
            cardsThatMatch.push(curentPlayer.playerCards[i]);
        }
    }
    if (cardsThatMatch.length > 0) {
        if (curentPlayer === y.players[0]) {
            // checks if the first player turn is valide, if false return false
            let isTurnValide = handelingSituation(clickedCard, curentPlayer);
            if (isTurnValide === false) {
                return false;
            }
        } else {
            let index = Math.floor(Math.random() * cardsThatMatch.length);
            let choice = cardsThatMatch.splice(index, 1);
            y.cardsInMiddle.push(choice[0]);
            let index2 = curentPlayer.playerCards.indexOf(choice[0]);
            curentPlayer.playerChoice.push(choice[0]);
            curentPlayer.playerCards.splice(index2, 1);
        }
    }
    return true;
}

// handeling the situation when previousPlayer was stoped and curentPlayer can add sameValue or sameColor
function skipSecondPart(curentPlayer, curentColor, clickedCard) {
    sameValue = [];
    sameColorCards = [];
    cardsThatMatch = [];

    // if the curent player hasn't a Skip card, he is stoped and next player has to play
    for (let i = 0; i < curentPlayer.playerCards.length; i++) {
        if (curentColor === curentPlayer.playerCards[i].color) {
            sameColorCards.push(curentPlayer.playerCards[i]);
        } else if (curentPlayer.playerCards[i].value === 'Skip') {
            sameValue.push(curentPlayer.playerCards[i]);
        }
    }
    cardsThatMatch = [...sameColorCards, ...sameValue];
    addingMatchingCards(cardsThatMatch, curentPlayer, clickedCard);
}

// over the Wild card we can add any card we want
function wild(curentPlayer, clickedCard) {
    if (curentPlayer === y.players[0]) {
        y.cardsInMiddle.push(clickedCard)
        curentPlayer.playerChoice.push(clickedCard)
        let index2 = curentPlayer.playerCards.indexOf(clickedCard)
        curentPlayer.playerCards.splice(index2, 1);
    } else {
        let index = Math.floor(Math.random() * curentPlayer.playerCards.length);
        let choice = curentPlayer.playerCards.splice(index, 1);
        y.cardsInMiddle.push(choice[0]);
        curentPlayer.playerChoice.push(choice[0]);
    }
}

// if is not one of the special cards
function anotherCard(curentPlayer, curentColor, curentValue, clickedCard) {
    cardsThatMatch = [];
    sameNumbers = [];
    sameColorCards = [];

    for (let i = 0; i < curentPlayer.playerCards.length; i++) {

        if (curentColor === curentPlayer.playerCards[i].color) {
            sameColorCards.push(curentPlayer.playerCards[i]);

        } else if (curentValue === curentPlayer.playerCards[i].value) {
            sameNumbers.push(curentPlayer.playerCards[i]);
        }
    }
    cardsThatMatch = [...sameColorCards, ...sameNumbers];

    addingMatchingCards(cardsThatMatch, curentPlayer, clickedCard)
}

// handeling the situation when players put +2 over +2 or +4
function drawMoreCards(previousPlayer, contorPlus, curentValue, curentPlayer) {

    var drawCardTwo = false;
    var drawCardFour = false;

    if (previousPlayer.playerChoice[previousPlayer.playerChoice.length - 1].value === '+2' && curentValue === '+2') {
        drawCardTwo = true;
    } else if (previousPlayer.playerChoice[previousPlayer.playerChoice.length - 1].value === '+4' && curentValue === '+4') {
        drawCardFour = true;
    }

    if (drawCardTwo === true) {
        contorPlus += 2;

    } else if (drawCardFour === true) {
        contorPlus += 4;

    }
    console.log(contorPlus)
    let drawCards = y.cardsFromDeck.splice(y.cardsFromDeck[0], contorPlus)
    for (let i = 0; i < drawCards.length; i++) {
        curentPlayer.playerCards.push(drawCards[i]);
    }
    contorPlus = 0;
}

// here is the array with matching cards from the player hand
function addingMatchingCards(cardsThatMatch, curentPlayer, clickedCard) {
    //handeling the situation when the player doesn't have a maching card to put in the middle
    if (cardsThatMatch.length === 0) {

        // handeling the situation when the curentPlayer is the player who has to click the wanted card
        if (curentPlayer === y.players[0]) {
            let message = document.getElementById("errorMessage");
            message.innerHTML = 'You do not have a matching card, you have to take one from deck'

        } else {
            getCardFromDeck(curentPlayer);
        }

    } else if (cardsThatMatch.length !== 0) {

        // handeling the situation when the curentPlayer is the player who has to click the wanted card
        if (curentPlayer === y.players[0]) {

            console.log(clickedCard)
            handelingSituation(clickedCard, curentPlayer);

        } else {
            let index = Math.floor(Math.random() * cardsThatMatch.length);
            let choice = cardsThatMatch.splice(index, 1)
            console.log(choice[0])
            y.cardsInMiddle.push(choice[0]);
            curentPlayer.playerChoice.push(choice[0]);

            // finding the index of choice in playerCards
            let index2 = curentPlayer.playerCards.indexOf(choice[0])
            curentPlayer.playerCards.splice(index2, 1);
        }
    }
}

// displayed number of cards in the hand for other 3 players
function numberPlayerCards() {
    let container1 = document.getElementById('numberOfCards2');
    container1.innerHTML = y.players[1].numberOfCards

    let container2 = document.getElementById('numberOfCards3');
    container2.innerHTML = y.players[2].numberOfCards

    let container3 = document.getElementById('numberOfCards4');
    container3.innerHTML = y.players[3].numberOfCards
}

// displayed pictures cards of the first player
function displayCards() {
    let pictures = document.getElementById('cards');
    pictures.innerHTML = y.players[0].displayPictures();
    click()
}

// displayed last card from cardsInMiddle
function displayMiddleCard(curentCard) {
    let picture = document.getElementById('lastMiddleCard');
    picture.innerHTML = displayLastCard(curentCard);
    console.log(displayLastCard(curentCard))
    console.log(curentCard)
}

function displayLastCard(curentCard) {
    return curentCard.display();
}

// when a player finished his cards, won
function endGame(curentPlayer) {
    if (curentPlayer.playerCards.length === 0) {
        let message = document.getElementById('message');
        let content = document.createElement('div');
        message.appendChild(content);
        content.innerHTML = curentPlayer['playerName'] + ' won the game !';
        return true;
    }
    return false;
}

//checking if the game has ended
function checkEndOfGame(curentPlayer) {
    let gameEnded = endGame(curentPlayer);
    if (gameEnded === true) {
        return true;
    } else {
        return false;
    }
}

//handeling the situation when the other 3 players have to take a card
function getCardFromDeck(curentPlayer) {
    curentPlayer.playerCards.push(y.cardsFromDeck[y.cardsFromDeck.length - 1]);
    y.cardsFromDeck.pop();
}


// first player functionality

// returns the card that was clicked
function getClickedCard(id) {
    for (let i = 0; i < y.players[0].playerCards.length; i++) {
        if (y.players[0].playerCards[i].id == id) {
            return y.players[0].playerCards[i];
        }
    }
}

//handeling the situation when the first player has to take a card from deck
function takeCardFromDeck() {
    let sectionDeck = document.getElementById('cardsFromDeck');

    sectionDeck.onclick = function () {
        y.players[0].playerCards.push(y.cardsFromDeck[y.cardsFromDeck.length - 1]);
        displayCards();
        y.cardsFromDeck.pop();
    }
}

// displayed cardsFromDeck in UI
function displayCardFromDeck() {
    let sectionDeck = document.getElementById('cardsFromDeck');
    sectionDeck.innerHTML = getBackImage()
}

function getBackImage() {
    return '<img src=images/back.png>'
}

// handeling the error when firstPlayer clicks on a card that doesn't match
// returns true when clicked card match, false otherwise
function handelingSituation(clickedCard, curentPlayer) {
    console.log(clickedCard);

    for (let i = 0; i < cardsThatMatch.length; i++) {
        if (cardsThatMatch[i].id === clickedCard.id) {
            y.cardsInMiddle.push(clickedCard)
            curentPlayer.playerChoice.push(clickedCard)
            let index2 = curentPlayer.playerCards.indexOf(clickedCard)
            curentPlayer.playerCards.splice(index2, 1);
            return true;
        }
    }
    displayWrongCardError(true);
    return false;
}

// display error message for wrong card clicked
// when show == true display message
// when show == false hide message
function displayWrongCardError(show) {
    let message = document.getElementById("errorMessage")

    if (show === true) {
        message.style.display = 'block';
    } else {
        message.style.display = 'none';
    }
}

function instructions() {
    let message = document.getElementById('instructions');

    message.innerHTML = `
        <h4>WELCOME</h4>
        <div>When you are ready</div>
        <div>Click on the card you want to added it</div>
        <div>If you don't have a matching card,</div>
        <div>Take from deck</div>`
}


