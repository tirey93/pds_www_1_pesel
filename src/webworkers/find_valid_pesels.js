importScripts('./pesel_calculations.js');

self.onmessage = function (e) {
    const digits = e.data.digits;
    let isData = false;
    console.log(digits);

    var start = new Date(1990, 0, 1);
    // var end = new Date(1990, 6, 1);
    var end = new Date(2051, 0, 1);


    var loop = new Date(start);
    while (loop < end) {
        // console.log(loop.getDate(), loop.getMonth() + 1, loop.getFullYear());
        
        let pesel = combinePesel(loop.getDate(), loop.getMonth() + 1, loop.getFullYear(), digits);
        if (isValidPesel(pesel)) {
            self.postMessage({
                result: {
                    pesel: pesel,
                    sex: getSex(pesel),
                    day: loop.getDate(),
                    month: loop.getMonth() + 1,
                    year: loop.getFullYear(),
                    digits: digits
                }
            });
            isData = true;
        }

        var newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
    }

    if (!isData) {
        self.postMessage({ error: true });
    }
};