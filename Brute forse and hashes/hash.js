function fileName() {
    let fName = process.argv[1];
    fName = fName.split("\\");
    return fName[fName.length - 1];
}
function err(codeErr, val) {
    switch (codeErr) {
        case 1:
            console.log("Ошибка запуска программы:\n" +
                `   не используйте один и тот же ключ несколько раз: "${val}"\n`);
            err(7);
            return;
        case 2:
            console.log("Ошибка запуска программы:\n" +
                `   не поддерживаемый метод: "${val}"\n`)
            err(7);
            return;
        case 3:
            console.log("Ошибка запуска программы:\n" +
                "   ключ \"-c\" не может быть применен к методу \"b\" (brute force).\n")
            err(7);
            return;
        case 4:
            console.log("Ошибка запуска программы!\n")
            err('inf');
            return;
        case 5:
            console.log("Ошибка запуска программы:\n" +
                `   фаил: "${val}" - не существует!`);
            return;
        case 6:
            console.log("Ошибка запуска программы:\n" +
                `   "${val}" - используйте натуральное число.`);
            return;
        case 7:
            console.log("Для получения справки, введите:\n" +
                `   >node ${fName} /?`);
            return;
        case 8:
            console.log("Ошибка запуска программы:\n" +
                `   фаил "${val}" - пуст.`);
            return;
        case 9:
            console.log("Вы не ввели фаил со строкой!\n");
            err(7);
            return;
        case 10:
            console.log("Вы не ввели фаил с подстрокой!\n");
            err(7);
            return;
        case 'inf':
            console.log("Пример запуска:\n" +
                `   >node ${fName} [ключи] [b/h1/h2/h3] string_file substring_file\n` + // имя исп фаила?
                "\n" +
                "где b - brute force, h1 - hashes: сумма кодов, h2 - hashes: сумма квадратов кодов, h3 - hashes: Рабина-Карпа;\n" +
                "string_file - файл со строкой,\n" +
                "substring_file - файл с подстрокой;\n" +
                "ключи - список ключей:\n" +
                "    -с - помимо списка вхождений вывести число коллизий (только хэши);\n" +
                "    -n N, где N - произвольное натуральное число - вывести первые N вхождений;\n" +
                "    -t - вывести время работы алгоритма.");
            return;
    }
}
function sumCode(val, l, exp, mode) {
    let sum = 0;
    if (val.length < l) {
        l = val.length;
    }
    if (mode === 3) {
        for (let i = 0; i < l; i++) {
            sum += val[i].charCodeAt(0) * Math.pow(2, l - i - 1);
        }
    } else {
        for (let i = 0; i < l; i++) {
            sum += Math.pow(val[i].charCodeAt(0), exp);
        }
    }
    return sum;
}
function checkFile(name) {
    try {
        fs.readFileSync(name);
        let content = fs.readFileSync(name, "utf8");
        if (content === '') {
            err(8, name);
            return 1;
        }
        return 0;
    } catch {
        err(5, name);
        return 1;
    }
}
function res(r, t, c) {
    if (r.length === 0) {
        r = 'нет вхождений!';
    }
    console.log(`Индексы вхождений: ${r}`)
    if (cFlag) {
        console.log(`Число коллизий: ${c}`);
    }
    if (tFlag) {
        console.log(`Время работы алгоритма: ${t.toFixed(3)}ms`);
    }
    return 0;
}
function bruteForce(str, sub) {
    let i = 0,
        j = 0,
        subL = sub.length,
        strL = str.length,
        col = 0,
        time = performance.now();
    while (i < strL - subL + 1) {
        j = 0;
        while (str[i + j] === sub[j]) {
            j++;
            if (j === subL) {
                result += String(i + 1) + ',';
                col++;
                break;
            }
        }
        if (col === Number(nFlag)) {
            break;
        }
        i++;
    }
    time = performance.now() - time;
    result = result.slice(0, result.length - 1);
    res(result, time);
    return 0;
}
function hashes(str, sub, exp, mode) {
    let i = 0,
        j = 0,
        col = 0,
        subL = sub.length,
        strL = str.length,
        collision = 0,
        time = performance.now(),
        hsSub = sumCode(sub, subL, exp, mode),
        hsStr = sumCode(str, subL, exp, mode);
    while (i < strL - subL + 1) {
        if (i > 0) {
            if (mode === 3) {
                hsStr = (hsStr - str[i - 1].charCodeAt(0) * Math.pow(2, subL - 1)) * 2 + str[i + subL - 1].charCodeAt(0);
            } else {
                hsStr = hsStr - Math.pow(str[i - 1].charCodeAt(0), exp) + Math.pow(str[i + subL - 1].charCodeAt(0), exp);
            }
        }
        if (hsStr === hsSub) {
            for (; j < subL; j++) {
                if (str[i + j] !== sub[j]) {
                    collision++;
                    break;
                }
            }
            if (j === subL) {
                result += String(i + 1) + ',';
                col++
                if (col === Number(nFlag)) {
                    break;
                }
            }
            j = 0;
        }
        i++;
    }
    time = performance.now() - time;
    result = result.slice(0, result.length - 1);
    res(result, time, collision);
    return 0;
}
function checkArg() {
    if (process.argv[2] === '/?') {
        err('inf');
        return 0;
    } else {
        while (arg) {
            arg = process.argv[++n];
            if (!arg) {
                err(4);
                return 4;
            }
            if (grupArg === 1 && arg) {
                if (keys1.indexOf(arg) !== -1) {
                    if (keys2.indexOf(arg) !== -1) {
                        keys2.splice(keys2.indexOf(arg), 1);
                        if (arg === '-c') {
                            cFlag = 1;
                        } else if (arg === '-n') {
                            nFlag = process.argv[++n];
                            if (nFlag === undefined) {
                                err(4);
                                return 4;
                            }
                            if (!Number.isInteger(+nFlag)) {
                                err(6, nFlag);
                                return 6;
                            }
                            if (+nFlag < 1) {
                                err(6, nFlag);
                                return 6;
                            }
                        } else if (arg === '-t') {
                            tFlag = 1;
                        }
                    } else {
                        err(1, arg);
                        return 1;
                    }
                } else {
                    grupArg = 2;
                }
            }
            if (grupArg === 2 && arg) {
                if (methods.indexOf(arg) !== -1) {
                    if (cFlag && arg === 'b') {
                        err(3, arg);
                        return 3;
                    } else {
                        mFlag = arg;
                        arg = process.argv[++n];
                        if (!arg) {
                            err(9);
                            return 9;
                        }
                        arg2 = process.argv[++n];
                        if (!arg2) {
                            err(10);
                            return 10;
                        }
                        grupArg = 3;
                    }
                } else {
                    err(2, arg);
                    return 2;
                }
            }
            if (grupArg === 3 && arg && arg2) {
                if (!checkFile(arg) && !checkFile(arg2)) {
                    string = fs.readFileSync(arg, "utf8");
                    subString = fs.readFileSync(arg2, "utf8");
                    break;
                } else {
                    return 5;
                }
            }
        }
    }
    switch (mFlag) {
        case 'b':
            bruteForce(string, subString);
            return 0;
        case 'h1':
            hashes(string, subString, 1);
            return 0;
        case 'h2':
            hashes(string, subString, 2);
            return 0;
        case 'h3':
            hashes(string, subString, 1, 3);
            return 0;
    }
}
const fs = require("fs"),
    {performance} = require("perf_hooks"),
    keys1 = ['-c', '-n', '-t'],
    methods = ['b', 'h1', 'h2', 'h3'];

let keys2 = ['-c', '-n', '-t'],
    n = 1, // индекс аргумента командной строки
    arg = process.argv[n], // первый аргумент - исполняемый фаил
    fName = fileName(),
    arg2,
    string,
    subString,
    result = '',
    grupArg = 1, // 1 - ключи, 2 - метод, 3 - фаилы
    cFlag = 0,
    nFlag = -1,
    tFlag = 0,
    mFlag = 0;
checkArg();