require('../../fetch.js')(2019, 6).then(x => {

  class Object{
    constructor(name, orbits){
      this.name = name;
      this.orbits = null;
      this.moons = [];
      objects.push(this);
    }
    get orbitedBy(){
      return this.moons.concat(this.moons.map(m => m.orbitedBy).flat()); 
    }
    ancestorCount(){
      return this.orbits ? (this.orbits.ancestorCount()+1) : 0;
    }
    orbiting(mother){
      this.orbits = mother;
      mother.moons.push(this);
    }
    hasDirect(n){
      return this.moons.find(x => x.name === n) !== undefined;
    }
    hasIndirect(n){
      return this.hasDirect(n) || (this.orbitedBy.find(x => x.name === n) !== undefined);
    }
  }

  //helper
  const YOU = "YOU", SAN = "SAN";
  let objects = [];
  let get = (name) => objects.find(x => x.name === name);
  let getOrNew = (name) => get(name) || new Object(name);
  let orbiting = ([planet, moon]) => moon.orbiting(planet);
  let sum = (a) => a.reduce((a,c) => a+c,0);

  //preparse input
  let input = x.split("\n").filter(x => x !== '').map(x => x.split(")"));

  //build universe
  input.forEach(x => orbiting(x.map(name => getOrNew(name))));

  let ancestorSum = sum(objects.map(x => x.ancestorCount()));

  //move YOU to SANTA
  let you = get(YOU), count = 0;
  while(!you.orbits.hasDirect(SAN)){
    let mother = you.orbits;
    if(mother.hasIndirect(SAN)){
      you.orbits = mother.moons.find(m => m.hasIndirect(SAN));
    }else{
      you.orbits = mother.orbits;
    }
    count++;
  }
  
  console.log(ancestorSum);
  console.log(count);

});