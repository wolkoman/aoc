var fetch = require('node-fetch');
var fs = require('fs');

const lz = (x) => (x<10?'0':'')+x;

let http = (year,day) => `https://adventofcode.com/${year}/day/${day}/input`;
let cookiePath = `cookie.txt`;
let yearPath = `year.txt`;
let payloadPath = (day) => `day${lz(day)}/payload.txt`;

module.exports = (day) => {
  let content;
  if(fs.existsSync(payloadPath(day))){
    return new Promise((res,rej) => {
      fs.readFile(payloadPath(day), {}, (err,data) => {
        res(data.toString());
      });
    })
  }else{
    let year = fs.readFileSync(yearPath).toString().trim();
    return fetch(http(year,day), {
      headers: {
        cookie: fs.readFileSync(cookiePath)
      }
    }).then(x => x.text()).then(x => {
      fs.writeFileSync(payloadPath(day), x);
      return x;
    });
  }
}