let inp1 = document.querySelector('.inp1'),
    inp2 = document.querySelector('.inp2'),
    inpNum = document.querySelector('.inpNum'),
    resaultInput = document.querySelector('.resaultInput'),
    discard = document.querySelector('.discard');


    
function checkLength() {
    if(isNaN(+inp1.value) && inp1.value !== '') {
        inp1.value = inp1.value.slice(0,inp1.value.length-1);
    }
    if(isNaN(+inp2.value) && inp2.value !== '') {
        inp2.value.length === 1 ? inp2.value='' : inp2.value = inp2.value[0];
    }


    if (inp1.value.length>2){
        inp1.value = inp1.value.slice(0,2);
    }
    if (inp2.value.length>2){
        inp2.value = inp2.value.slice(0,2);
    }
    if (inpNum.value.length>25){
        inpNum.value = inpNum.value.slice(0,25);
    }

    inpNum.value === '' ? resaultInput.value = '': '';


    inp1.value !== '' ? inp1.value = parseInt(+inp1.value) :''; 
    inp2.value !== '' ? inp2.value = parseInt(+inp2.value) :'';

}

function trackOfInputs() {
    checkLength()
    if (inp1.value <=36 && inp1.value >=2 && inp2.value <=36 && inp2.value >=2 && inpNum.value !== '') {
        let count = (parseInt(inpNum.value, +inp1.value)).toString(+inp2.value);

        resaultInput.value = count;

        resaultInput.value === 'NaN'? resaultInput.value = '' : '';
    }
}


inp1.oninput = trackOfInputs; 
inp2.oninput = trackOfInputs;
inpNum.oninput = trackOfInputs;

discard.onclick = ()=> {
    inp1.value = '';
    inp2.value = '';
    inpNum.value = '';
    resaultInput.value = '';
}