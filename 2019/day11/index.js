require('../../fetch.js')(2019, 11).then(x => {

  let c = x.split("\n").filter(x => x !== '')[0].split(',').map(x => parseInt(x));
  
  function *Machine(code){
    let opcode, modes, instruction, relativeBase = 0;
    let index = 0;
    
    // helper functions (input, output, index, modes are global)
    let getPos = (i) => code[code[i]] || 0;
    let getVal = (i) => code[i] || 0;
    let getRel = (i) => code[code[i]+relativeBase] || 0;
    let putPos = (i,v) => {code[code[i]] = v;}
    let putRel = (i,v) => {code[code[i]+relativeBase] = v;}

    let get = (i) => [getPos, getVal, getRel][modes[i-1]](index+i);
    let put = (i,v) => [putPos, console.log, putRel][modes[i-1]](index+i,v);
    
    // instructions
    let instructions = [null,
      (i) => {put(3, get(1) + get(2)); return i+4;},
      (i) => {put(3, get(1) * get(2)); return i+4;},
      (i) => i+2,
      (i) => i+2,
      (i) => get(1) !== 0 ? get(2) : i+3,
      (i) => get(1) === 0 ? get(2) : i+3,
      (i) => {put(3, get(1) < get(2) ? 1: 0); return i+4; },
      (i) => {put(3, get(1) === get(2) ? 1: 0); return i+4; },
      (i) => {relativeBase += get(1); return i+2;}
    ];
    
    // while program isn't instructed to stop
    while((opcode = code[index]) % 100 !== 99){
      
      //resolve opcode
      instruction = opcode % 100;
      modes = Array(3).fill(0)
        .map((v,i) => Math.pow(10,i+2))
        .map(v => parseInt((opcode % (v*10)) / v));
      
      //if input instruction, wait for input
      if(instruction === 3 ){
        let inp = yield;
        put(1, inp);
      }

      //if output instruction, fetch output
      if(instruction === 4){
        yield get(1);
      }
      
      //execute
      index = instructions[instruction](index);
    }

    return;
  }
  class Tile{
    constructor(x,y){
      this.x = x;
      this.y = y;
    }
    is(x,y){
      return this.x === x && this.y === y;
    }
  }
  class Painter{
    constructor(code, firstTile){
      this.machine = Machine(code);
      this.dir = 0;
      this.x = 0;
      this.y = 0;
      this.tiles = (firstTile===1) ? [new Tile(0,0)]:[];
      this.visitedTiles = [];
      this.done = false;

      while(!this.done){
        this.next();
        this.paint(this.next(this.camera()));
        this.move(this.next());
      }
    }
    next(x){
      let r = this.machine.next(x);
      this.done = this.done || r.done;
      return r.value;
    }
    hasTile(x,y){
      return this.tiles.find(tile => tile.is(x,y)) !== undefined;
    }
    addTile(x,y){
      if(!this.hasTile(this.x,this.y)) this.tiles.push(new Tile(x,y));
      if(this.visitedTiles.find(tile => tile.is(x,y)) === undefined) this.visitedTiles.push(new Tile(x,y));
    }
    removeTile(x,y){
      if(this.hasTile(this.x,this.y)) this.tiles = this.tiles.filter(tile => !tile.is(x,y));
    }
    camera(){
      return this.hasTile(this.x, this.y) ? 1 : 0;
    }
    paint(x){
      if(x === 0){
        this.removeTile(this.x,this.y)
      }else{
        this.addTile(this.x,this.y);
      }
    }
    move(x){
      this.dir += x === 0 ? -1 : 1;
      this.dir = (this.dir === -1) ? 3 : (this.dir === 4 ? 0 : this.dir);
      this.x += [0,1,0,-1][this.dir];
      this.y += [-1,0,1,0][this.dir];
    }
    render(){
      let size = this.tiles.reduce((a,c) => ({
        startX:Math.min(a.startX,c.x),
        endX:Math.max(a.endX,c.x),
        startY:Math.min(a.startY,c.y),
        endY:Math.max(a.endY,c.y)
      }), {
        startX:Math.min(0,this.x),
        endX:Math.max(0,this.x),
        startY:Math.min(0,this.y),
        endY:Math.max(0,this.y)
      });
      return Array((size.endY+1)-size.startY).fill(0).map((w,_y) =>
        Array((size.endX+1)-size.startX).fill(0).map((v,_x) =>
          (this.x === _x + size.startX && this.y === _y + size.startY) ? (['/\\','->','\\/','<-'][this.dir]) :
          (this.hasTile(_x + size.startX, _y + size.startY) ? '██' : '  ')
        ).join('')
      ).join("\n");
    }
  }

  console.log(new Painter(c, 0).visitedTiles.length);
  console.log(new Painter(c, 1).render());
});