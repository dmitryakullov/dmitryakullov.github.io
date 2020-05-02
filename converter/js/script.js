let inp_16 = document.querySelector('#inp1'),
    inp_10 = document.querySelector('#inp2'),
    inp_8 = document.querySelector('#inp3'),
    inp_2 = document.querySelector('#inp4'),
    inp_36 = document.querySelector('#inp5'),
    discard = document.querySelector('.discard');

let value10 =0;
let i16,i8,i2,i36;

function to10(value,system) {
    value10 = parseInt(value, system);
    inp_10.value = value10;

    if (+value10 > 0) {
        inp_2.value = value10.toString(2);
    } else {

    }

    inp_16.value = value10.toString(16);
    inp_8.value = value10.toString(8);
    inp_36.value = value10.toString(36);
}



inp_16.addEventListener('input', ()=> {

    i16 = inp_16.value.toLowerCase();
    if ((i16[0]==='-' && i16.length===1)) {
    } 
    else if((+i16[i16.length-1] >=0 && +i16[i16.length-1] <=9) || i16[i16.length-1] ==='a' || i16[i16.length-1] ==='b' || i16[i16.length-1] ==='c' || i16[i16.length-1] ==='d' || i16[i16.length-1] ==='e' || i16[i16.length-1] ==='f') {
        to10(i16,16);
    } else {
        inp_16.value = i16.slice(0,i16.length-1);
    }

})

inp_10.addEventListener('input', ()=> {
    i10 = inp_10.value.toLowerCase();
    if ((i10[0]==='-' && i10.length===1)) {
    } 
    else if(+i10[i10.length-1] <=9 && +i10[i10.length-1] >=0) {
        to10(i10,10);
    } 
    else {
        inp_10.value = i10.slice(0,i10.length-1);
    }
})

inp_8.addEventListener('input', ()=> {
    i8 = inp_8.value.toLowerCase();
    if ((i8[0]==='-' && i8.length===1)) {
    } 
    else if(+i8[i8.length-1] <=7 && +i8[i8.length-1] >=0) {
        to10(i8,8);
    } 
    else {
        inp_8.value = i8.slice(0,i8.length-1);
    }

})

inp_2.addEventListener('input', ()=> {
    i2 = inp_2.value.toLowerCase();
    if ((i2[0]==='-' && i2.length===1)) {
        inp_2.value = '';
    } 
    else if (i2[i2.length-1] === '0' || i2[i2.length-1] === '1') {
        to10(i2,2);
    } 
    else {
        inp_2.value = i2.slice(0,i2.length-1);
    }

})

inp_36.addEventListener('input', ()=> {
    i36 = inp_36.value.toLowerCase();
    to10(i36,36);

})



discard.onclick = ()=> {
    inp_16.value = '';
    inp_10.value = '';
    inp_8.value = '';
    inp_2.value = '';
    inp_36.value = '';
    value10 =0;
}

