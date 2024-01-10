alert('Расчёт этажа и подъезда по номеру квартиры');
let floors,
  flatPerFloor,
  enterence,
  amountFlats,
  flatsInEnterance,
  needFlat,
  answerEnterence,
  addArgument,
  answerFloor; // Переменные

for (let i = 0; i < 1; i++) {
  // Ввод начальных характеристик дома
  floors = +prompt('Введите количество этажей в доме', '');
  flatPerFloor = +prompt('Введите количество квартир на этаже', '');
  enterence = +prompt('Введите количество подъездов', '');
  if (
    floors == '' ||
    floors < 1 ||
    isNaN(floors) ||
    flatPerFloor == '' ||
    flatPerFloor < 1 ||
    isNaN(flatPerFloor) ||
    enterence == '' ||
    enterence < 1 ||
    isNaN(enterence)
  ) {
    i--;
    alert('Вводите только целые числа');
  }
}
amountFlats = floors * flatPerFloor * enterence; // всего квартир в доме
flatsInEnterance = floors * flatPerFloor; //квартир в одном подъезде

alert(`В вашем доме:
        Этажей: ${floors}
        Подъездов: ${enterence}
        Квартир: ${amountFlats}`);

for (let i = 0; i < 1; i++) {
  // номер запрашиваемой квартиры
  needFlat = +prompt(
    `Введите номер квартиры с диапазона:
    от 1 до ${amountFlats}`,
    ''
  );
  if (isNaN(needFlat) || needFlat < 1 || needFlat == '' || needFlat > amountFlats) {
    i--;
    alert('Введите только целое число с предложенного диапазона');
  }
}
answerEnterence = Math.ceil(needFlat / flatsInEnterance); // это подъезд нужной квартиры

addArgument = needFlat;

addArgument = addArgument % flatsInEnterance; // Это номер нужной квартиры, если считать от первого этажа
if (addArgument == 0) {
  addArgument = flatsInEnterance;
}

answerFloor = Math.ceil(addArgument / flatPerFloor); // Этаж нужной квартиры

alert(`Характеристики квартиры № ${needFlat} :
            Подъезд № ${answerEnterence}
            Этаж № ${answerFloor}`);
