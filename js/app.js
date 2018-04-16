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
const restart = document.querySelector('.restart');
const timerElement = document.querySelector('.time');
let stars = 3;
let counter = 0;
let openCards = [];
let clearingFlag = false;
let isTimer = false;
let time = 0;
let timeInterval;
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
 * This resets the game variables, content and repopulates the cards
 * 
 */
function resetGame() {
    fillCards(shuffle(playCards));
    stars = 3;
    counter = 0;
    openCards = [];
    resetStars(stars);
    winningMessage.style.display = 'none';
    counterElement.textContent = 0;
    stopTimer();
    time = 0;
    timerElement.textContent = "00:00"

}
/**
 * Resets the number of stars the game begins with
 * 
 * @param {number} num Interger number to set star
 */
function resetStars(num) {
    const frag = document.createDocumentFragment();
    while (starsContainer.hasChildNodes()) {
        starsContainer.removeChild(starsContainer.lastChild);
    }
    for (let x = 0; x < num; x++) {
        const li = document.createElement('li');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-star');
        frag.appendChild(li.appendChild(icon));
    }
    console.log(frag);
    starsContainer.appendChild(frag);
}
/**
 * Toggles the card classes with the card array provided in the deck list.
 * 
 * @param {array} playingCards 
 */
function fillCards (playingCards) {
    if (deckCards.length === playingCards.length){
        deckCards.forEach((x,i)=> deckCards[i].classList.remove('match', 'show', 'open'));
        deckCards.forEach((x,i) => deckCards[i].firstElementChild.className = '');
        deckCards.forEach((x,i) => deckCards[i].firstElementChild.classList.add('fa', 'fa-' + playCards[i]));
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

/**
 * Toggles classes an element to display css properties
 * 
 * @param {object} node HTML Element
 */
function displayCard(node) {
    node.classList.toggle('show');
    node.classList.toggle('open');
}

/**
 * Adds a card element to the openCards array
 *  
 * @param {object} card HTML Element
 */
function openCard (card){
    openCards.push(card);
}

/**
 * Sets a flag to prevent other cards being clicked and removes the only 2
 * cards in the openCards array. Clears the flag when done.
 * 
 */
function clearOpenCards() {
    clearingFlag = true;
    displayCard(openCards[0]);
    displayCard(openCards[1]);
    openCards = [];
    clearingFlag = false;

}

/**
 * Checks if the 2 cards in the openCards array match.
 * 
 * @returns Boolean
 */
function checkCard() {
    return (openCards.length == 2 && openCards[0].firstElementChild.className === openCards[1].firstElementChild.className) ?
        true
    :
        false;
}

/**
 * Toggles an element class '.match'
 * 
 */
function cardMatch() {
    openCards[0].classList.toggle('match');
    openCards[1].classList.toggle('match');
}

/**
 * Incrememnts the count variable and reduces the star number if it reaches a certain amount.
 * 
 */
function moveCount() {
    counter++
    counterElement.textContent = counter;
    if (counter == 16 || counter == 32) {
        removeStar()
    }
}

/**
 * Removes stars from the variable and the elements showing the star icon.
 * 
 */
function removeStar() {
    stars--
    starsContainer.lastElementChild.remove()
}

/**
 * Checks if the game is won by checking if the ammount of matches meet the amount of
 * starting cards. If it does then a result window is shown with the stats of the game.
 * 
 */
function wonGame() {
    if (deckCards.length == matchingCards.length) {
        stopTimer()
        winningMessage.style.display = "flex";
        const msgMoves = document.querySelector('.last-move');
        const msgStars = document.querySelector('.last-star');
        const msgTime = document.querySelector('.last-time');
        console.log(msgMoves);
        msgMoves.textContent = counter;
        msgStars.textContent = stars;
        msgTime.textContent = showTime();
    }
}

// Card click event listener
deck.addEventListener('click', showCard)


/**
 * Flips card and compares
 * 
 * @param {any} event 
 */
function showCard(event){
    const clickedCard = event.target;
    console.log(clickedCard);
    //If the time is not running, run it
    if(!isTimer){
        isTimer = true;
        timeInterval = setInterval(runTimer, 1000)
    };
    //If it's card and only 2 are select and the card is not already matched or open
    if(clickedCard.tagName == 'LI' && openCards.length < 2 && clickedCard.className !== 'card match' && clickedCard.className !== 'card show open'){
        displayCard(clickedCard);
        openCard(clickedCard);
        moveCount();
    }
    //when 2 cards are open and don't match then clear them
    if (openCards.length == 2 && !checkCard() && !clearingFlag) {
        clearingFlag = true;
        setTimeout(() => {
            clearOpenCards()
        }, 500);
    //when 2 cards do match then keep them open and check if the game is over
    }   else if (checkCard()){
        cardMatch()
        clearOpenCards()
        wonGame()
    }

}

/**
 * Closes the result window
 * 
 */
function closeResults() {
    const won = document.querySelector('.won');
    won.style.display = "none";
};

//invlokes the closing of the event window on click
winningMessage.addEventListener('click', closeResults);

//game reset event listener
restart.addEventListener('click', resetGame);

/**
 * Incremenets the time variable every second and updates the time element
 * 
 */
function runTimer() {
    time++;
    timerElement.textContent = showTime();
}

/**
 * Converts the time from seconds to minutes:seconds '00:00'
 * 
 * @returns String
 */
function showTime() {
    let minutes = Math.floor(time/60);
    let seconds = Math.floor(time - (minutes*60));
    return `${leadingZero(minutes)} : ${leadingZero(seconds)}`;
}

/**
 * Stops the the time interval
 * 
 */
function stopTimer() {
    isTimer = false;
    clearInterval(timeInterval);
}

/**
 * Takes an integer with a single digit and adds a leading zero
 * 
 * @param {any} time 
 * @returns 
 */
function leadingZero(time) {
	if (time <= 9) {
		time = "0" + time;
	}
	return time;
}