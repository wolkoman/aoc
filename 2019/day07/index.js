require('../../fetch.js')(2019, 7).then(x => {
  
  let c = x.split("\n").filter(x => x !== '')[0].split(',').map(x => parseInt(x));
  
  class Machine{
    constructor(code, phase, call){
      this.code = code;
      this.phase = phase;
      this.out = call;
      this.index = 0;
      this.halted = true;
      this.in(this.phase);
    }
    
    in(num){
      let input = [num];
      let opcode, modes, instruction, output = [];
      
      // helper functions (input, output, this.index, modes are global)
      let getPos = (i) => this.code[this.code[i]];
      let getVal = (i) => this.code[i];
      let get = (i) => modes[i-1] === 0 ? getPos(this.index+i) : getVal(this.index+i);
      let put = (i,v) => this.code[this.code[this.index+i]] = v;
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
      while((opcode = this.code[this.index]) % 100 !== 99){
        
        //resolve opcode
        instruction = opcode % 100;
        modes = Array(3).fill(0)
          .map((v,i) => Math.pow(10,i+2))
          .map(v => parseInt((opcode % (v*10)) / v));
        
        //if input instruction, wait for input
        if(instruction === 3 && input.length == 0){
          this.halted = true;
          if(output.length > 0){
            this.out(output.pop());
          }
          return;
        }
        
        //execute
        this.index = instructions[instruction](this.index);
      }
      
      this.halted = false;
      if(output.length > 0){
        this.out(output.pop());
      }
      this.out(false);
    }
  }
  let cluster = (code,arr) => new Promise((res,rej) => {
    let callback = (mI) => (num) => {
      let next = mI === arr.length-1 ? 0 : mI+1;
      if(this.machines[next].halted){
        this.machines[next].in(num);
      }else{
        res({in: arr, out: num});
      }
    };
    this.machines = Array(arr.length).fill(0).map((v,i) => new Machine(code, arr[i], callback(i)));
    this.machines[0].in(0);
  });

  //generate all possibilites
  let expand = (dict, array) => array
    .map(sub => dict.map(x => !sub.includes(x) ? sub.concat(x) : null))
    .flat(1)
    .filter(x => x !== null);
  let comb = (x) => Array(x.length-1)
    .fill(0)
    .reduce((a,c) => expand(x, a), x.map(x => [x]));
    
  let findMaxThrust = (dict) => Promise.all(
    comb(dict).map(x => cluster(c,x))).then(x => x.reduce((a,c) => a.out>c.out ? a : c, 0)
  );

  //exercise 1
  findMaxThrust([0,1,2,3,4]).then(x => console.log(x.out));
  //exercise 2
  findMaxThrust([5,6,7,8,9]).then(x => console.log(x.out));

});