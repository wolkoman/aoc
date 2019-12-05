let fs = require('fs');
let settings = require('./settings');

Array(25)
    .fill(0)
    .map((_,i) => settings.payloadPath(i))
    .concat('cookie.txt')
    .filter(fs.existsSync)
    .forEach(fs.unlinkSync);
