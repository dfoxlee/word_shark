import phrases from "./resources/phrases.js";
import alphabet from "./resources/alphabet.js";

let playButton = document.querySelector(".play-button");
let introSection = document.querySelector(".intro-section");
let phraseWrapper = document.querySelector(".phrase-wrapper");
let keyWrappers = document.querySelectorAll(".key-wrapper");
let sharkHead = document.querySelector(".shark-head");
let finishSection = document.querySelector(".finish-section");
let missedScore = document.querySelector(".missed-score");
let endCloseButton = document.querySelector(".end-close-button");
let finishMessage = document.querySelector(".finish-message");
let finishPhraseAnswer = document.querySelector(".finish-phrase-answer");

let phrase = "";
let wrongGuesses = 0;
let lettersGuessed = [];
let sharkLevels = ["95%", "85%", "80%", "75%", "70%", "65%"];

// let uniqueValues = [];

// for(let i=0; i<phrases.length; i++) {
//     for(let j=0; j<phrases[i].length; j++) {
//         // console.log(phrases[i][j])
//         if(!uniqueValues.includes(phrases[i][j])) {
//             uniqueValues.push(phrases[i][j]);
//         }
//     }
// }

// // console.log(uniqueValues);

const getRandomPhrase = () => {
    let randomIndex = Math.floor(Math.random()*phrases.length);
    phrase = phrases[randomIndex].split("");
    console.log(phrase.join(""));
}

const fillPhraseWrapper = () => {
    while(phraseWrapper.firstChild) {
        phraseWrapper.removeChild(phraseWrapper.firstChild);
    }


    let punctuationList = ["-", "?", ".", ",", "(", ")", "'"];

    let phraseWord = document.createElement("div");
    phraseWord.classList.add("phrase-word");

    for(let i=0; i<phrase.length; i++) {
        if(phrase[i] == " ") {
            let phraseSpaceWrapper = document.createElement("div");
            phraseSpaceWrapper.classList.add("phrase-space-wrapper");
            let phraseSpace = document.createElement("span");
            phraseSpace.innerHTML = "&#160";
            phraseSpaceWrapper.append(phraseSpace);
            phraseWord.append(phraseSpaceWrapper);
            phraseWrapper.append(phraseWord);
            phraseWord = document.createElement("div");
            phraseWord.classList.add("phrase-word");
        }else if(punctuationList.includes(phrase[i])) {
            let phrasePunctuationWrapper = document.createElement("div");
            phrasePunctuationWrapper.classList.add("phrase-punctuation-wrapper");
            let phrasePunctuation = document.createElement("span");
            phrasePunctuation.classList.add("phrase-punctuation");
            phrasePunctuation.innerText = phrase[i];
            phrasePunctuationWrapper.append(phrasePunctuation);
            phraseWord.append(phrasePunctuationWrapper);
            if(i == phrase.length - 1) {
                phraseWrapper.append(phraseWord);
            }
        }else {
            let phraseLetterWrapper = document.createElement("div");
            phraseLetterWrapper.classList.add("phrase-letter-wrapper");
            let phraseLetter = document.createElement("span");
            phraseLetter.classList.add("phrase-letter");
            phraseLetter.innerText = phrase[i];
            phraseLetterWrapper.append(phraseLetter);
            phraseWord.append(phraseLetterWrapper);
            if(i == phrase.length - 1) {
                phraseWrapper.append(phraseWord);
            }
        }
    }
}

const handlePlayButtonClick = () => {
    introSection.style.display = "none";
    getRandomPhrase();
    fillPhraseWrapper();
}

playButton.addEventListener("click", handlePlayButtonClick);

let resetButton = document.querySelector(".reset-button");

const resetGame = () => {
    finishSection.style.display = "none";
    wrongGuesses = 0;
    missedScore.innerText = wrongGuesses;
    lettersGuessed = [];
    sharkHead.style.top = sharkLevels[wrongGuesses];

    let keyboardKeyOverlayCorrects = document.querySelectorAll(".keyboard-key-overlay-correct");
    let keyboardKeyOverlayWrongs = document.querySelectorAll(".keyboard-key-overlay-wrong");
    for(let i=0; i<keyboardKeyOverlayCorrects.length; i++) {
        keyboardKeyOverlayCorrects[i].remove();
    }

    for(let i=0; i<keyboardKeyOverlayWrongs.length; i++) {
        keyboardKeyOverlayWrongs[i].remove();
    }

    getRandomPhrase();
    fillPhraseWrapper();
}

resetButton.addEventListener("click", resetGame);

const endGame = (result) => {
    finishSection.style.display = "grid";
    let finishPhrase = phrase.join("");
    finishPhraseAnswer.innerText = finishPhrase;
    if(result == "won") {
        finishMessage.innerText = "Great Job! You guessed my phrase!"
    }else if(result == "lost") {
        finishMessage.innerText = "Bummer! You didn't guess my phrase. Now I must eat you."
    }else {
        return;
    }
}

const handleGuess = (guess) => {
    let keyboardKeyOverlay = document.createElement("div");
    if(phrase.includes(guess)) {
        // Correct guess
        lettersGuessed.push(guess);
        let phraseLetters = document.querySelectorAll(".phrase-letter");
        for(let i=0; i<phraseLetters.length; i++) {
            if(guess == phraseLetters[i].innerText) {
                phraseLetters[i].style.display = "block";
            }
        }

        keyboardKeyOverlay.classList.add("keyboard-key-overlay-correct");
        for(let i=0; i<keyWrappers.length; i++) {
            if(guess == keyWrappers[i].innerText && keyWrappers[i].childElementCount < 2) {
                keyWrappers[i].append(keyboardKeyOverlay);
            }
        }

        let lettersHidden = false;
        phraseLetters.forEach((letter) => {
            // if(letter.style){}
            if(letter.style.display == "none" || letter.style.display == "") {
                lettersHidden = true;
            }
        });

        if(lettersHidden) {
            return;
        }else {
            endGame("won");
        }
    }else {
        //Incorrect guess
        lettersGuessed.push(guess);
        wrongGuesses++;
        missedScore.innerText = wrongGuesses;
        sharkHead.style.top = sharkLevels[wrongGuesses];
        keyboardKeyOverlay.classList.add("keyboard-key-overlay-wrong");
        for(let i=0; i<keyWrappers.length; i++) {
            if(guess == keyWrappers[i].innerText && keyWrappers[i].childElementCount < 2) {
                keyWrappers[i].append(keyboardKeyOverlay);
            }
        }
        if(wrongGuesses > 5) {
            endGame("lost");
        }
    }
}

const handleKeyClick = (event) => {
    if(wrongGuesses > 5) {
        return;
    }else if(lettersGuessed.includes(event.target.innerText)) {
        return;
    }else if(!alphabet.includes(event.target.innerText)) {
        return;
    }else {
        handleGuess(event.target.innerText);
    }

    return false;
}

for(let i=0; i<keyWrappers.length; i++) {
    keyWrappers[i].addEventListener("click", handleKeyClick);
}

endCloseButton.addEventListener("click", resetGame);

const handleKeydown = (event) => {
    if(wrongGuesses > 5) {
        return;
    }else if(lettersGuessed.includes(event.key.toUpperCase())) {
        return;
    }else if(!alphabet.includes(event.key)) {
        return;
    }else {
        event.preventDefault();
        let guess = event.key.toUpperCase();
        handleGuess(guess);
    }
}

window.addEventListener("keydown", handleKeydown);