require('../../fetch.js')(2019, 5).then(x => {

  function foo(code, input){
    let c = [...code];
    let index = 0, opcode, modes, instruction, output = [];

    // helper functions (input, output, index, modes are global)
    let getPos = (i) => c[c[i]];
    let getVal = (i) => c[i];
    let get = (i) => modes[i-1] === 0 ? getPos(index+i) : getVal(index+i);
    let put = (i,v) => c[c[index+i]] = v;
    let inp = () => input.pop();
    let out = (v) => output.push(v);

    // instructions
    let instructions = [null,
      (i) => {put(3, get(1) + get(2)); return i+4;},
      (i) => {put(3, get(1) * get(2)); return i+4;},
      (i) => {put(1, inp()); return i+2;},
      (i) => {out(get(1)); return i+2;},
      (i) => get(1) !== 0 ? get(2) : i+3,
      (i) => get(1) === 0 ? get(2) : i+3,
      (i) => {put(3, get(1) < get(2) ? 1: 0); return i+4; },
      (i) => {put(3, get(1) === get(2) ? 1: 0); return i+4; },
    ];

    // while program isn't instructed to stop
    while((opcode = c[index]) % 100 !== 99){

      //resolve opcode
      instruction = opcode % 100;
      modes = Array(3).fill(0)
        .map((v,i) => Math.pow(10,i+2))
        .map(v => parseInt((opcode % (v*10)) / v));
      
      //execute
      index = instructions[instruction](index);
    }
    return {code: c, output};
  }

  let c = x.split("\n").filter(x => x !== '')[0].split(",").map(x => parseInt(x));

  console.log(foo(c, [1]).output.filter(x => x != 0)[0]); // part 1
  console.log(foo(c, [5]).output[0]); // part 2

});