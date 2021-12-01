// URL of aventofcode host
const http = (year,day) => `https://adventofcode.com/${year}/day/${day}/input`;

// relative path to cookie file
// MUST BE OF FOLLOWING FORM
// session={{YOUR SESSION COOKIE}};
const cookiePath = `cookie.txt`;

// file with current year (e.g. 2019)
const yearPath = `year.txt`;

// path to the individual payload file
const payloadPath = (day) => `2021/day${lz(day)}/payload.txt`;

// helper
const lz = (x) => (x<10?'0':'')+x;

module.exports = {lz, http, cookiePath, yearPath, payloadPath};