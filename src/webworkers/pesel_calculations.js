function combinePesel(day, month, year, digits){
      let peselYear = year.toString().slice(-2); 

      if (year >= 1800 && year < 1900) {
        month += 80;
        peselYear = (year - 1800).toString().padStart(2, '0');
      } else if (year >= 2000 && year < 2100) {
        month += 20;
        peselYear = (year - 2000).toString().padStart(2, '0');
      } else if (year >= 2100 && year < 2200) {
        month += 40;
        peselYear = (year - 2100).toString().padStart(2, '0');
      } else if (year >= 2200 && year < 2300) {
        month += 60;
        peselYear = (year - 2200).toString().padStart(2, '0');
      } else if (year >= 1900 && year < 2000) {
        peselYear = (year - 1900).toString().padStart(2, '0');
      } else {
        return false;
      }
    
      let peselMonth = month.toString().padStart(2, '0');
      let peselDay = day.toString().padStart(2, '0');
    
      let pesel = peselYear + peselMonth + peselDay + digits;
      
      // console.log("pesel", pesel);
      return pesel;
}
function isValidPesel(pesel) {
    if(typeof pesel !== 'string')
        return false;

    let weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let sum = 0;
    let controlNumber = parseInt(pesel.substring(10, 11));

    for (let i = 0; i < weight.length; i++) {
        sum += (parseInt(pesel.substring(i, i + 1)) * weight[i]);
    }
    sum = sum % 10;
    return (10 - sum) % 10 === controlNumber;
}

function getSex(pesel) {
  var sex;
  if (parseInt(pesel.substring(9, 10), 10) % 2 === 1) {
    sex = 'M';
  } else {
    sex = 'K';
  }
  
  return sex;
}