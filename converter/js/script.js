let inp_16 = document.querySelector('#inp1'),
    inp_10 = document.querySelector('#inp2'),
    inp_8 = document.querySelector('#inp3'),
    inp_2 = document.querySelector('#inp4'),
    discard = document.querySelector('.discard');

let value10 =0;
let i16,i8,i2;

function to10(value,system) {

    value10 = parseInt(value, system);
    inp_10.value = value10;

    inp_2.value = value10.toString(2);

    inp_16.value = value10.toString(16).toUpperCase();
    inp_8.value = value10.toString(8);
}



inp_16.addEventListener('input', ()=> {
    inp_16.value = inp_16.value.slice(0,13);
    i16 = inp_16.value.toUpperCase();

    let isRight = false,
        minus = '';

    if (i16[0]==='-') {
        i16 = i16.slice(1);
        minus = '-';
    } 

    for(let i in i16) {
        if (+i16[i] >= 0 && +i16[i] <= 9 || i16[i] === 'A' || i16[i] === 'B' || i16[i] === 'C' || i16[i] === 'D' || i16[i] === 'E' || i16[i] === 'F') {
            isRight = true;
        } else {
            isRight = false;
            inp_16.value = minus + i16.slice(0,+i) + i16.slice(+i+1);
            break;
        }
    }
    if (isRight) {
        to10(inp_16.value,16);
    }
    
    
})

inp_10.addEventListener('input', ()=> {
    inp_10.value = inp_10.value.slice(0,15);
    i10 = inp_10.value;

    let isRight = false,
        minus = '';

    if (i10[0]==='-') {
        i10 = i10.slice(1);
        minus = '-';
    } 
    for (let i in i10) {
        if (+i10[i] <=9 && +i10[i] >=0){
            isRight = true;
        } else {
            isRight = false;
            inp_10.value = minus + i10.slice(0,+i) + i10.slice(+i+1);
            break;
        }
    }
    if (isRight) {
        to10(inp_10.value,10);
    }

})

inp_8.addEventListener('input', ()=> {
    inp_8.value = inp_8.value.slice(0,17);
    i8 = inp_8.value;

    let isRight = false,
        minus = '';

    if (i8[0]==='-') {
        i8 = i8.slice(1);
        minus = '-';
    }
    for (let i in i8) {
        if (+i8[i] <=7 && +i8[i] >=0) {
            isRight = true;
        } else {
            isRight = false;
            inp_8.value = minus + i8.slice(0,+i) + i8.slice(+i+1);
            break;
        }
    }
    if (isRight) {
        to10(inp_8.value,8);
    }
})

inp_2.addEventListener('input', ()=> {
    inp_2.value = inp_2.value.slice(0,53);
    i2 = inp_2.value;

    let isRight = false,
        minus = '';

    if (i2[0]==='-') {
        i2 = i2.slice(1);
        minus = '-';
    } 
    for (let i in i2) {
        if (+i2[i] === 0 || +i2[i] === 1) {
            isRight = true;
        } else {
            isRight = false;
            inp_2.value = minus + i2.slice(0,+i) + i2.slice(+i+1);
            break;
        }
    }
    if (isRight) {
        to10(inp_2.value,2);
    }
})



discard.onclick = ()=> {
    inp_16.value = '';
    inp_10.value = '';
    inp_8.value = '';
    inp_2.value = '';
    value10 =0;
}

