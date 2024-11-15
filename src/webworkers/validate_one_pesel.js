importScripts('./pesel_calculations.js');

self.onmessage = function(e) {
    const num = e.data.pesel;
    
    const day = e.data.day;
    const month = e.data.month;
    const year = e.data.year;
    const digits = e.data.digits;

    console.log(day, month, year, digits);
    
    let pesel = combinePesel(day, month, year, digits);
    if(isValidPesel(pesel)){
        self.postMessage({ result: {
            pesel: pesel,
            sex: getSex(pesel),
            day: day,
            month: month,
            year: year,
            digits: digits
        } });
    }
    else{
        self.postMessage({ error: true });
    }
};