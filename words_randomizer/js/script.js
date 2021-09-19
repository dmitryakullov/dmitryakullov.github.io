const textarea = document.querySelector('#textarea');
const mixAndShowWordBtn = document.querySelector('#mix-and-show-word');
const clearBtn = document.querySelector('#clear');
const randomWord = document.querySelector('#random-word');
const nextWordBtn = document.querySelector('#next-word');
const wordsListUl = document.querySelector('#words-list');
const accordionButton = document.querySelector('#accordion-button');

let wordList = [];
let randomWordNumber;

function chooseWord(amountWords) {
  return Math.floor(Math.random() * amountWords);
}

function createListAndChooseWord() {
  let stringList = '';
  wordList.map(({ text, wordNumber }) => {
    stringList += `<li class="list-group-item"><b>${wordNumber}.</b> ${text}</li>`;
  });
  wordsListUl.innerHTML = stringList;

  randomWordNumber = chooseWord(wordList.length);
  randomWord.textContent = wordList[randomWordNumber].text;
}

nextWordBtn.addEventListener('click', () => {
  wordList.splice(randomWordNumber, 1);

  if (!wordList.length) {
    randomWord.textContent = '';
    wordsListUl.innerHTML = '';
    wordList = [];
    return;
  }

  createListAndChooseWord();
});

mixAndShowWordBtn.addEventListener('click', () => {
  if (!textarea.value) {
    return;
  }

  const words = textarea.value.split('\n');
  const filteredWords = words.map((text) => text.trim()).filter((text) => text !== '');

  if (!filteredWords.length) {
    textarea.value = '';
    return;
  }

  wordList = filteredWords.map((text, index) => ({ text, wordNumber: index + 1 }));
  textarea.value = '';

  createListAndChooseWord();
});

clear.addEventListener('click', () => {
  textarea.value = '';
  randomWord.textContent = '';
  wordsListUl.innerHTML = '';
});
