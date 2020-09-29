let inp_16 = document.querySelector('#inp1'),
    inp_10 = document.querySelector('#inp2'),
    inp_2 = document.querySelector('#inp3'),
    minusNum = document.querySelector('#minus'),
    minusShow = document.querySelectorAll('.input-minus'),
    discard = document.querySelector('.discard');


let i16, i10, i2, value10 = 0, minus = false; 
i16 = i10 = i2 = '';

function setEmptyStr() {
    inp_16.value = '';
    inp_10.value = '';
    inp_2.value = '';
    value10 =0;
}

function setClassMinus() {
    minusNum.classList.toggle('minus-active');
    minusShow.forEach(i=> {
        i.classList.toggle('visibility')
    })
}


function binaryConverter(num2) {
    num2 = ''+num2;

    if (num2 === '0' || num2 === '') return num2;

    if(minus) {
        const len = num2.length;
        switch (len%4) {
            case 0: 
                num2 = '0000' + num2;
                break;
            case 1: 
                num2 = '000' + num2;
                break;
            case 2: 
                num2 = '00' + num2;
                break;
            case 3: 
                num2 = '0' + num2;
                break;
        }
        const len2 = len.length;

        if (len2 % 8 === 0) {
            // do nothing
        }
        else if (len2 % 8 === 4) {
            num2 = '0000' + num2;
        }
    }

    arr = num2.split('');

    let arr2 = arr.map(i=> i==='1' ? '0' : '1')
    arr = [];


    let finishAdd = false;
    for (let i = arr2.length-1; i >= 0; i--) {
        if (!finishAdd) {
            if (arr2[i] === '1') {
                arr.push('0');

                if(i === 0) {
                    arr.push('1')
                }
            }
            else {
                arr.push('1');
                finishAdd = true;
            }
        }
        else {
            arr.push(arr2[i])
        }
    }
    let resault = (arr.reverse()).join('');

    if (!minus) {                   // cut zeros in start of string
        const regExp = /1[10]*$/g;

        resault = resault.match(regExp) || '0';
    }

    return resault;
}





function to10(value,system) {

    value10 = parseInt(value, system);

    inp_10.value = value10;

    inp_2.value = value10.toString(2);

    inp_16.value = value10.toString(16).toUpperCase();
}


minusNum.addEventListener('click', ()=> {
    if (minus) {
        minus = false;
        setClassMinus();
    }
    else {
        minus = true;
        setClassMinus();
    }

    i2 = binaryConverter(inp_2.value);
    const i10Additional = parseInt(i2, 2);
    i16 = (i10Additional || '') && i10Additional.toString(16).toUpperCase();

    inp_2.value = i2;
    inp_16.value = i16;
});


inp_16.addEventListener('input', ()=> {
    const value = inp_16.value;
    if (value === ''){
        setEmptyStr();
        return;
    };

    const regExp = /[^\da-f]/i;
    

    if (!regExp.test(value)) {
        i16 = value.toUpperCase();
        to10(i16, 16);
    }
    else {
        inp_16.value = i16;
    }
})

inp_10.addEventListener('input', ()=> {
    const value = inp_10.value;
    if (value === ''){
        setEmptyStr();
        return;
    };

    const regExp = /[^\d]/;

    if (!regExp.test(value)) {
        i10 = value;
        to10(i10, 10);
    }
    else {
        inp_10.value = i10;
    }
})


inp_2.addEventListener('input', ()=> {
    const value = inp_2.value;
    if (value === ''){
        setEmptyStr();
        return;
    };

    const regExp = /[^01]/;

    if (!regExp.test(value)) {
        i2 = value;
        to10(i2, 2);
    }
    else {
        inp_2.value = i2
    }
})



discard.onclick = ()=> {
    setEmptyStr();
}































// function binaryConverter(num2) {
//     num2 = ''+num2;

//     if(!minus) {
//         const len = num2.length;
//         switch (len%4) {
//             case 0: 
//                 num2 = '0000' + num2;
//                 break;
//             case 1: 
//                 num2 = '000' + num2;
//                 break;
//             case 2: 
//                 num2 = '00' + num2;
//                 break;
//             case 3: 
//                 num2 = '0' + num2;
//                 break;
//         }
//         const len2 = len.length;

//         if (len2 % 8 === 0) {
//             // do nothing
//         }
//         else if (len2 % 8 === 4) {
//             num2 = '0000' + num2;
//         }
//     }

//     arr = num2.split('');

//     let arr2 = arr.map(i=> i==='1' ? '0' : '1')
//     arr = [];


//     let finishAdd = false;
//     for (let i = arr2.length-1; i >= 0; i--) {
//         if (!finishAdd) {
//             if (arr2[i] === '1') {
//                 arr.push('0');

//                 if(i === 0) {
//                     arr.push('1')
//                 }
//             }
//             else {
//                 arr.push('1');
//                 finishAdd = true;
//             }
//         }
//         else {
//             arr.push(arr2[i])
//         }
//     }
//     arr.reverse();

//     console.log(arr.join(''))
// }