require('../../fetch.js')(2019, 2).then(x => {

 function foo(a,b){
  let c = x.split("\n").filter(x => x !== '')[0].split(",").map(x => parseInt(x));

  c[1] = a;
  c[2] = b;

  let index = 0,opcode;
  while((opcode = c[index]) != 99){
    if(opcode == 1){
      c[c[index+3]] = c[c[index+1]] + c[c[index+2]];
    }else if(opcode == 2){
      c[c[index+3]] = c[c[index+1]] * c[c[index+2]];

    }
    index += 4;
  }

  return {noun: a, verb: b, result: (c[0])};
}

console.log(foo(12,2).result);


for(let a = 0; a < 100; a++){
  for(let b = 0; b < 100; b++){
    let o = foo(a,b);
      if(o.result === 19690720){
        console.log(o.noun * 100 + o.verb);
      }
  }
}


});