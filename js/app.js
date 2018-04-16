/*
 * Create a list that holds all of your cards with enough cards to fill
 */
const cards = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];
const deck = document.querySelector('.deck');
const deckCards = document.querySelectorAll('.deck li');
const matchingCards = document.getElementsByClassName('match');
const winningMessage = document.querySelector('.won');
const playCards = playDeck(cards);
const counterElement = document.querySelector('.moves');
const starsContainer = document.querySelector('.stars');
let stars = 3;
let counter = 0;
let openCards = [];
let clearingFlag = false;
/**
 * Gets the right number of cards from the card array depending on on the deck available.
 * 
 * @param {array} cards Card array
 * @returns {array} Card array to be used
 */
function playDeck(cards) {
    if (deckCards.length > cards.length * 2){
    console.log('Deck size bigger than cards available')
    return [];}
    else{
        const selectCards = cards.slice(0, deckCards.length/2);
        return [...selectCards, ...selectCards];
    }
}

fillCards(shuffle(playCards));

/**
 * Toggles the card classes with the card array provided in the deck list.
 * 
 * @param {array} playingCards 
 */
function fillCards (playingCards) {
    if (deckCards.length === playingCards.length){
        deckCards.forEach((x,i) => deckCards[i].firstElementChild.classList.toggle('fa-' + playCards[i]));
    }
    else {
        console.log('Amount of cards does not matach the deck');
    }
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


function displayCard(node) {
    node.classList.toggle('show');
    node.classList.toggle('open');
}

function openCard (card){
        openCards.push(card);
    console.log("card tag " + card.tagName);
    console.log(openCards);
}

function clearOpenCards() {
    console.log("clearing");
    clearingFlag = true;
    displayCard(openCards[0]);
    displayCard(openCards[1]);
    openCards = [];
    clearingFlag = false;

}

function checkCard() {
    return (openCards.length == 2 && openCards[0].firstElementChild.className === openCards[1].firstElementChild.className) ?
        true
    :
        false;
}

function cardMatch() {
    openCards[0].classList.toggle('match');
    openCards[1].classList.toggle('match');
}

function moveCount() {
    counter++
    counterElement.textContent = counter;
    if (counter == 16 || counter == 32) {
        removeStar()
    }
}

function removeStar() {
    stars--
    starsContainer.lastElementChild.remove()
}

function wonGame() {
    if (deckCards.length == matchingCards.length) {
        winningMessage.style.display = "flex";
        const msgMoves = document.querySelector('.last-move');
        const msgStars = document.querySelector('.last-star');
        console.log(msgMoves);
        msgMoves.textContent = counter;
        msgStars. textContent = stars;
    }
}
deck.addEventListener('click', showCard)



function showCard(event){
    const clickedCard = event.target;
    console.log(clickedCard);
    if(clickedCard.tagName == 'LI' && openCards.length < 2 && clickedCard.className !== 'card match' && clickedCard.className !== 'card show open'){
        displayCard(clickedCard);
        openCard(clickedCard);
        moveCount();
    }
    if (openCards.length == 2 && !checkCard() && !clearingFlag) {
        clearingFlag = true;
        setTimeout(() => {
            clearOpenCards()
        }, 500);
    }   else if (checkCard()){
        cardMatch()
        clearOpenCards()
        wonGame()
    }

}

