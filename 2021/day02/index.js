require('../../fetch.js')(2021, 2).then(x => {

  const lines = x.split("\n").filter(a => a.trim() !== "");
  const position = lines.reduce((position, line) => {
    const parts = line.split(" ");
    const number = +parts[1];
    const newPosition = ({
      forward: () => ({...position, x: position.x + number}),
      down: () => ({...position, y: position.y + number}),
      up: () => ({...position, y: position.y - number}),
    }[parts[0]])();
    return newPosition;
  }, {x:0, y:0});

  const position2 = lines.reduce((position, line) => {
    const parts = line.split(" ");
    const number = +parts[1];
    const newPosition = ({
      forward: () => ({...position, x: position.x + number, y: position.y + position.aim * number}),
      down: () => ({...position, aim: position.aim + number}),
      up: () => ({...position, aim: position.aim - number}),
    }[parts[0]])();
    return newPosition;
  }, {x:0, y:0, aim:0});

  console.log(position.x * position.y);
  console.log(position2.x * position2.y);


});