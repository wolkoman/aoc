require('../../fetch.js')(2021, 1).then(x => {

  const depth = x
    .split("\n")
    .filter(a => a !== "")
    .map(a => +a);
  const increase = depth.
    map((a,i,as) => i === 0 ? 0 : (a > as[i-1] ? 1 : 0));

  const sliding = depth.map((_, i, as) => i < 2 ? null :
    (as[i] + as[i-1] + as[i-2])).filter(a => a !== null);

  const slidingIncrease = sliding.
  map((a,i,as) => i === 0 ? 0 : (a > as[i-1] ? 1 : 0));


  console.log(increase.reduce((a,b) => a+b, 0));
  console.log(slidingIncrease.reduce((a,b) => a+b, 0));


});