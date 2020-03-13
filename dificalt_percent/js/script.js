alert('Программа расчета сложного процента для регулярных инвестиций на долгосрок.');

let currency = prompt('Введите тип вашей валюты.', 'usd'),   // Во данных для расчетов
    startCapital = +prompt('Введите первоначальную суммую', ''),
    putMoneyPerYear = (+prompt('Введите сумму, которую вы будете вкладывать каждый месяцю', '')) * 12,
    percentPerYear = (+prompt('Сколько процентов (%) прибыли в год вы планируете получать?')) / 100,
    amountOfYears = +prompt('Сколько лет вы будете регулярно вкаладывать деньги? (минимум 2 года)', '');

let incomeInResault = startCapital;      //  Вписуем начальную сумму в переменную для результата


for (let i = 2; i <= amountOfYears; i++){           //Главный расчет сложного процента
    incomeInResault = (incomeInResault + putMoneyPerYear) * (1 + percentPerYear) ;
}


let rightNameOfYears;                                        
if(amountOfYears >= 11 && amountOfYears <=19){                        // Конструкция для правильного отображения количествава лет.
    rightNameOfYears = "лет";
} else if (amountOfYears % 10 == 1) {
    rightNameOfYears = 'год';
} else if ((amountOfYears % 10) >=2 && (amountOfYears % 10) <=4){
    rightNameOfYears = 'годa';
} else {
    rightNameOfYears = "лет";

}
                            //Результат
alert('Ваш доход за ' + amountOfYears + ' ' + rightNameOfYears + ' составит ' + incomeInResault.toFixed() + ' ' + currency);




let continueHold = confirm('Оставить деньги под проценты, без продолжения вкладывания денег ежегодно?');


if (continueHold == true) {   // Держать ли деньги дальше?

    let amountOfYears2 = +prompt('Сколько лет вы планируете продолжать держать капитал, без продолжения вкладывания денег ежегодно?', '');


    for(let i = 1; i <= amountOfYears2; i++){                   //Главный расчет сложного процента
        incomeInResault = incomeInResault * (1 + percentPerYear);
    }
    amountOfYears = amountOfYears + amountOfYears2;

    if(amountOfYears >= 11 && amountOfYears <=19){                // Конструкция для правильного отображения количествава лет.
        rightNameOfYears = "лет";
    } else if (amountOfYears % 10 == 1) {
        rightNameOfYears = 'год';
    } else if ((amountOfYears % 10) >=2 && (amountOfYears % 10) <=4){
        rightNameOfYears = 'годa';
    } else {
        rightNameOfYears = "лет";
    }
                                            //Результат
    alert('Ваш доход за ' + amountOfYears + ' ' + rightNameOfYears + ', без продолжения регулярных вложений - составит ' + incomeInResault.toFixed() + ' ' + currency);
    alert('Желаю вам удачи.');
} else {
    alert('Желаю вам удачи.');
}