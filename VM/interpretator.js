function NUM(value, e) {
    if (value) {
        el1 = Number(ram[ram[++e]]);
        el2 = Number(ram[ram[++e]]);
        numFlag = 0;
    } else {
        el1 = ram[ram[++e]];
        el2 = ram[ram[++e]];
    }
    return e;
}

const fs = require("fs"),
    numbers = ['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

let ram = [],
    arg = 3,
    error = -1,
    not = 0,
    numFlag = 0,
    el1, el2;

fs.access(process.argv[2], function (errorFile) {
    if (!errorFile) {
        let i = 0;
        ram = fs.readFileSync(process.argv[2], "utf8").split(/\s+/);
        for (let k = 0; k < ram.length; k++) {
            if (ram[k] === '') {
                ram.splice(k,1);
            }
        }
        while (ram[i] !== 'exit' && error === -1) {
            switch (ram[i]) {
                case 'input':
                    ram[ram[++i]] = process.argv[arg++];
                    i++;
                    break;
                case 'put':
                    ram[ram[++i]] = ram[++i];
                    i++;
                    break;
                case 'del':
                    ram[ram[++i]] = undefined;
                    i++;
                    break;
                case 'putin':
                    ram[ram[++i]] = ram[ram[++i]];
                    i++;
                    break;
                case 'sumstr':
                    ram[ram[i + 3]] = ram[ram[++i]] + ram[ram[++i]];
                    i += 2;
                    break;
                case 'sum':
                    ram[ram[i + 3]] = String(Number(ram[ram[++i]]) + Number(ram[ram[++i]]));
                    i += 2;
                    break;
                case 'dif':
                    ram[ram[i + 3]] = String(Number(ram[ram[++i]]) - Number(ram[ram[++i]]));
                    i += 2;
                    break;
                case 'div':
                    ram[ram[i + 3]] = String(Number(ram[ram[++i]]) / Number(ram[ram[++i]]));
                    i += 2;
                    break;
                case 'mul':
                    ram[ram[i + 3]] = String(Number(ram[ram[++i]]) * Number(ram[ram[++i]]));
                    i += 2;
                    break;
                case 'goto':
                    i = Number(ram[++i]);
                    break;
                case 'ifgoto':
                    if ((Number(ram[ram[++i]]) + not) % 2) {
                        i = Number(ram[++i]);
                    } else {
                        i += 2;
                    }
                    not = 0;
                    break;
                case 'not':
                    not = 1;
                    i++;
                    break;
                case 'num':
                    numFlag = 1;
                    i++;
                    break;
                case 'equ':
                    i = NUM(numFlag, i);
                    if (el1 === el2) {
                        ram[ram[++i]] = String((1 + not) % 2);
                    } else {
                        ram[ram[++i]] = String(not % 2);
                    }
                    i++;
                    not = 0;
                    break;
                case 'more':
                    i = NUM(numFlag, i);
                    if (el1 > el2) {
                        ram[ram[++i]] = String((1 + not) % 2);
                    } else {
                        ram[ram[++i]] = String(not % 2);
                    }
                    i++;
                    not = 0;
                    break;
                case 'less':
                    i = NUM(numFlag, i);
                    if (el1 < el2) {
                        ram[ram[++i]] = String((1 + not) % 2);
                    } else {
                        ram[ram[++i]] = String(not % 2);
                    }
                    i++;
                    not = 0;
                    break;
                case 'ifnum':
                    let ifNum = true,
                        suspect = ram[ram[++i]];
                    if (suspect !== undefined && suspect.split('-').length - 1 <= 1 && suspect.indexOf('-') <= 0) {
                        for (let l of suspect) {
                            if (numbers.indexOf(l) === -1) {
                                ifNum = false;
                                break;
                            }
                        }
                    } else {
                        ifNum = false;
                    }
                    if (ifNum) {
                        ram[ram[++i]] = String((1 + not) % 2);
                    } else {
                        ram[ram[++i]] = String(not % 2);
                    }
                    i++;
                    not = 0;
                    break;
                case 'output':
                    console.log(ram[ram[++i]]);
                    i++;
                    break;
                default:
                    error = i;
            }
        }
        if (error !== -1)
            console.log(`ошибка id${error}: ${ram[error]}`)
    }
    else {
        console.log(`File is not found: ${process.argv[2]}`);
    }
})