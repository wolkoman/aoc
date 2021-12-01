require('../../fetch.js')(2019, 9).then(x => {


  let des =["","add","mul","inp","out","jnz","jz ","les","equ","rel"];


  let c = x.split("\n").filter(x => x !== '')[0].split(',').map(x => parseInt(x));
  
  class Machine{
    constructor(code, call){
      this.code = code;
      this.code[this.code.length] = 0;
      this.out = call;
      this.index = 0;
      this.halted = true;
    }
    
    in(num){
      let input = [num];
      let opcode, modes, instruction, relativeBase = 0, output = [];
      
      // helper functions (input, output, this.index, modes are global)
      let getPos = (i) => this.code[this.code[i]] || 0;
      let getVal = (i) => this.code[i] || 0;
      let getRel = (i) => this.code[this.code[i]+relativeBase] || 0;
      let putPos = (i,v) => {this.code[this.code[i]] = v;}
      let putRel = (i,v) => {this.code[this.code[i]+relativeBase] = v;}

      let get = (i) => modes[i-1] === 0 ? getPos(this.index+i) : (modes[i-1] === 1 ? getVal(this.index+i) : getRel(this.index+i));
      let put = (i,v) => {modes[i-1] === 0 ? putPos(i+this.index,v) : putRel(i+this.index,v);}
      let inp = () => input.pop();
      let out = (v) => output.push(v);
      
      // instructions
      let instructions = [null,
        (i) => {put(3, get(1) + get(2)); return i+4;},
        (i) => {put(3, get(1) * get(2)); return i+4;},
        (i) => {put(1, inp()); return i+2;},
        (i) => {this.out(get(1)); return i+2;},
        (i) => get(1) !== 0 ? get(2) : i+3,
        (i) => get(1) === 0 ? get(2) : i+3,
        (i) => {put(3, get(1) < get(2) ? 1: 0); return i+4; },
        (i) => {put(3, get(1) === get(2) ? 1: 0); return i+4; },
        (i) => {relativeBase += get(1); return i+2;}
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

  new Machine(c, x => x!==false ? console.log(x) : 0).in(1);
  new Machine(c, x => x!==false ? console.log(x) : 0).in(2);

});