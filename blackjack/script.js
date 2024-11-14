let deck = [];
let tavasumm = 0;
let datorasumm = 0;
let playerCards = [];
let computerCards = [];
let score = 0;

function createDeck() {
    const suits = ['H', 'D', 'C', 'S'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    deck = shuffle(deck);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function drawCard() {
    const card = deck.pop();
    return card;
}

function getCardValue(card) {
    if (['J', 'Q', 'K'].includes(card.value)) {
        return 10;
    }
    if (card.value === 'A') {
        return 11;
    }
    return parseInt(card.value);
}

function calculateSum(cards) {
    let sum = 0;
    let aceCount = 0;
    
    for (let card of cards) {
        sum += getCardValue(card);
        if (card.value === 'A') {
            aceCount++;
        }
    }
    
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount--;
    }
    
    return sum;
}

function sakt() {
    document.querySelector('.controls button:nth-child(1)').style.display = 'none'; // Hide the "Start" button
    
    deck = [];
    createDeck();
    tavasumm = 0;
    datorasumm = 0;
    playerCards = [];
    computerCards = [];
    document.getElementById("player-cards").innerHTML = "";
    document.getElementById("computer-cards").innerHTML = "";
    document.getElementById("p").innerHTML = "";

    const playerCard1 = drawCard();
    const computerCard1 = drawCard();

    playerCards.push(playerCard1);
    computerCards.push(computerCard1);

    tavasumm = calculateSum(playerCards);
    datorasumm = calculateSum(computerCards);

    document.getElementById("a").innerHTML = tavasumm;
    document.getElementById("b").innerHTML = datorasumm;

    addCardToDOM("player-cards", playerCard1);
    addCardToDOM("computer-cards", computerCard1);
}

function pieskirt() {
    const playerCard = drawCard();
    playerCards.push(playerCard);
    tavasumm = calculateSum(playerCards);
    document.getElementById("a").innerHTML = tavasumm;
    addCardToDOM("player-cards", playerCard);
    
    if (tavasumm > 21) {
        document.getElementById("p").innerHTML = "tu zaudēji:(";
        updateScore(-500);
        showStartButton();
        return;
    }

    if (tavasumm === 21) {
        document.getElementById("p").innerHTML = "tu vinnēji";
        updateScore(700);
        showStartButton();
        return;
    }

    setTimeout(() => {
        const datorakarts = drawCard();
        computerCards.push(datorakarts);
        datorasumm = calculateSum(computerCards);
        document.getElementById("b").innerHTML = datorasumm;
        addCardToDOM("computer-cards", datorakarts);
        
        if (datorasumm > 21) {
            document.getElementById("p").innerHTML = "tu vinnēji:)";
            updateScore(700);
            showStartButton();
        } else if (datorasumm === 21) {
            document.getElementById("p").innerHTML = "tu zaudēji";
            updateScore(-500);
            showStartButton();
        }
    }, 500);
}

function apstaties() {
    function computerDraws() {
        if (datorasumm < tavasumm && datorasumm < 21) {
            const card = drawCard();
            computerCards.push(card);
            datorasumm = calculateSum(computerCards);
            addCardToDOM("computer-cards", card);
            document.getElementById("b").innerHTML = datorasumm;
            setTimeout(computerDraws, 500);
        } else {
            finalizeGame();
        }
    }

    function finalizeGame() {
        if (datorasumm > 21 || datorasumm < tavasumm) {
            document.getElementById("p").innerHTML = "tu vinnēji";
            updateScore(700);
        } else if (datorasumm > tavasumm) {
            document.getElementById("p").innerHTML = "tu zaudēji";
            updateScore(-500);
        } else {
            document.getElementById("p").innerHTML = "neizšķirts";
        }
        
        showStartButton();
    }
    
    setTimeout(computerDraws, 500);
}

function addCardToDOM(player, card) {
    const cardImg = document.createElement("img");
    cardImg.src = `cards/${card.value}${card.suit}.png`;
    document.getElementById(player).appendChild(cardImg);
}

function refresh() {
    location.reload();
}

function updateScore(value) {
    score += value;
    document.getElementById("score").innerText = score;
}

function saveScore() {
    setCookie("score", score, 30);
}

window.onload = function() {
    score = parseInt(getCookie("score")) || 0;
    document.getElementById("score").innerText = score;
}

function showStartButton() {
    document.querySelector('.controls button:nth-child(1)').style.display = 'inline-block'; // Show the "Start" button
}
