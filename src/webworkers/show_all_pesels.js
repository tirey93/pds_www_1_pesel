importScripts('./pesel_calculations.js');

self.onmessage = function (e) {
    const day = e.data.day;
    const month = e.data.month;
    const year = e.data.year;
    let isData = false;
    console.log(day, month, year);


    for (let i = 0; i < 99999; i++) {
    // for (let i = 0; i < 100; i++) {
        let digits = i.toString().padStart(5, '0');
        let pesel = combinePesel(day, month, year, digits);
        if (isValidPesel(pesel)) {
            self.postMessage({
                result: {
                    pesel: pesel,
                    sex: getSex(pesel),
                    day: day,
                    month: month,
                    year: year,
                    digits: digits
                }
            });
            isData = true;
        }
        let result = 0;

        // for (let i = 1; i <= 30000; i++) {
        //     for (let j = 0; j < i; j++) {
        //         result++;
        //     }
        // }
    }

    if (!isData) {
        self.postMessage({ error: true });
    }
};