require('../fetch.js')(1).then(x => {
  function fuel(x){

    return Math.max(0,Math.floor(parseFloat(x)/3)-2);
  }
  function addfuel(sum){
    let totalsum = 0, newsum;

    while((newsum = fuel(sum)) != sum){
      totalsum += newsum;
      sum = newsum;
    }
    return totalsum;
  }

  let xs1 = x.split("\n").filter(x => x !== '').map(x => fuel(x));

  let xs2 = x.split("\n").filter(x => x !== '').map(x => fuel(x) + addfuel(fuel(x)));


  console.log(xs1.reduce((p,c) => p+c, 0));
  console.log(xs2.reduce((p,c) => p+c, 0));




});