require('../../fetch.js')(2019, 8).then(x => {
  
  let w = 25;
  let h = 6;
  let c = x.split("\n").filter(x => x !== '')[0].split('').map(x => parseInt(x));
  
  //helper functions
  let unflatten = (arr, n) => 
    Array(arr.length/n)
      .fill(0)
      .map((v,i) => arr.slice(i*n,i*n+n));
  let count = (image, digit) => 
    image
    .flat()
    .reduce((a,c) => c===digit?a+1:a, 0);
  let counts = (image) => ({image: image, count: [count(image,0), count(image,1), count(image,2)]});
  let draw = (image) => 
    image.map((row) => 
      row.map((v) => 
        v===1? "X" : " "
      ).join("")
    ).join("\n");
  let render = (image) => 
    image
      .reverse()
      .slice(1)
      .reduce((a,c) =>
        c.map((row,y) =>
          row.map((p,x) => p==2?a[y][x]:p)
        ), image[0]
      );

  //generate image (with layers (with rows))
  let image = unflatten(unflatten(c, w), h);

  //get layer with lowest number of 0s
  let res = image.map(layer => counts(layer)).reduce((a,c) => a.count[0]<c.count[0]?a:c, {count:[Infinity]});

  //exercise 1
  console.log(res.count[1]*res.count[2]);
  //exercise 2
  console.log(draw(render(image)));

});