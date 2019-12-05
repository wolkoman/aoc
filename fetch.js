var fetch = require('node-fetch');
var fs = require('fs');
var settings = require('./settings');

module.exports = (day) => {
  if(!fs.existsSync(settings.cookiePath)){
    console.log("Please provide a cookie.txt in the root directory with the following form:");
    console.log("session={{YOUR SESSION COOKIE FROM ADVENTOFCODE.COM}};");
    process.exit();
  }
  if(fs.existsSync(settings.payloadPath(day))){
    return new Promise((res,rej) => {
      fs.readFile(settings.payloadPath(day), {}, (err,data) => {
        res(data.toString());
      });
    })
  }else{
    let year = fs.readFileSync(settings.yearPath).toString().trim();
    return fetch(settings.http(year,day), {
      headers: {
        cookie: fs.readFileSync(settings.cookiePath).toString().trim()
      }
    }).then(x => x.text()).then(x => {
      fs.writeFileSync(settings.payloadPath(day), x);
      return x;
    });
  }
}