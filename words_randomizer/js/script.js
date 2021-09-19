const textarea = document.querySelector('#textarea');
const mixAndShowWordBtn = document.querySelector('#mix-and-show-word');
const clearBtn = document.querySelector('#clear');
const randomWord = document.querySelector('#random-word');
const nextWordBtn = document.querySelector('#next-word');
const wordsListUl = document.querySelector('#words-list');
const accordionButton = document.querySelector('#accordion-button');

let wordList;
let randomWordNumber;

function chooseWord(amountWords) {
  console.log({ amountWords });
  return Math.floor(Math.random() * amountWords);
}

nextWordBtn.addEventListener('click', () => {});

mixAndShowWordBtn.addEventListener('click', () => {
  if (wordsListUl.innerHTML && !textarea.value) {
    return;
  }

  const words = textarea.value.split('\n');
  wordList = words.map((text, index) => ({ text, wordNumber: index + 1 }));
  textarea.value = '';

  let stringList = '';
  wordList.map(({ text, wordNumber }) => {
    stringList += `<li class="list-group-item"><b>${wordNumber}.</b> ${text}</li>`;
  });

  randomWordNumber = chooseWord(wordList.length);

  randomWord.textContent = wordList[randomWordNumber].text;

  wordsListUl.innerHTML = stringList;
});

clear.addEventListener('click', () => {
  textarea.value = '';
  randomWord.textContent = '';
  wordsListUl.innerHTML = '';
});
