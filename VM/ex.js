let readline = require('readline');
const fs = require("fs")
let a = ram=fs.readFileSync(process.argv[2], "utf8").split(/\s+/);
console.log(a)
