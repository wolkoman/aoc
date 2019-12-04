require('../fetch.js')(3).then(x => {

  let fs = require("fs");

  //x = "R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83\n";
  //x = "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7";
  //x = "R8,U5,L5,D3\nU7,R6,D4,L4";

  class Point{
    constructor(x,y,w){
      this.x = x;
      this.y = y;
      this.w = w;
    }
    static equals(p1,p2){
      return p1.x === p2.x && p2.y === p1.y && p1.w !== p2.w;
    }
    toString(){
      return `${this.x},${this.y}`;
    }

    dis(){
      return Math.abs(this.x) + Math.abs(this.y);
    }
  }

  let c = x.split('\n').filter(x => x !== '').map(x => x.split(','));

  let used = [];
  let crossing = [];
  
  for(let i = 0; i < 2; i++){
    let x = 0, y = 0, l = 0;
    for(let j = 0; j < c[i].length; j++){
      let cur = c[i][j];
      let dir = cur.substring(0,1);
      let length = parseInt(cur.substring(1));
      for(let count = 0; count < length; count++){
        x += dir === 'R' ? 1 : (dir === 'L' ? -1 : 0);
        y += dir === 'D' ? 1 : (dir === 'U' ? -1 : 0);
        l++;

        let p = new Point(x,y,l);

        if(!used[y]){
          used[y] = [];
        }

        if(used[y] && used[y][x] && i === 1){
          p.w += used[y][x];
          crossing.push(p);
        }

        if(i === 0){
          used[y][x] = l;
        }
      }
    }
  }

  let man = crossing.map(x => x.dis()).reduce((a,c) => Math.min(Math.abs(a), Math.abs(c)), 10000000000000000);

  console.log(man);

  console.log(crossing.reduce((a,c) => a.w > c.w ? c : a, new Point(0,0,1000000)).w);





});