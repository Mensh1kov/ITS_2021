function fileName() {
    let name = process.argv[1];
    name = name.split("\\");
    return name[name.length - 1];
}
function information(item) {
    switch (item) {
        case messageCall:
            console.log("Для получения справки, введите:\n" +
                `   >node ${fName} /?`);
            return;
        case helpCall:
            console.log("Пример запуска:\n" +
                "code:\n" +
                `   >node ${fName} code input.txt output.txt [n] [ru/en]\n` +
                "decode:\n" +
                `   >node ${fName} code output.txt result [ru/en]\n` +
                "\n" +
                "где [n] - сдвиг,\n" +
                "[ru/en] - язык.");
            return;
    }
}
function err(codeErr, val) {
    switch (codeErr) {
        case enterLangError:
            console.log("Ошибка запуска программы:\n" +
                `   вы не указали язык.\n`);
            information(messageCall);
            return;
        case enterInputFileError:
            console.log("Вы не ввели фаил с текстом!\n");
            information(messageCall);
            return;
        case enterOutputFileError:
            console.log("Вы не ввели фаил для результата!\n");
            information(messageCall);
            return;
        case enterIntNumError:
            console.log("Ошибка запуска программы:\n" +
                `   вы не ввели целое число.\n`);
            information(messageCall);
            return;
        case existFileError:
            console.log("Ошибка запуска программы:\n" +
                `   фаил: "${val}" - не существует!`);
            return;
        case useIntNumError:
            console.log("Ошибка запуска программы:\n" +
                `   "${val}" - используйте целое число.`);
            return;
        case emptyFileError:
            console.log("Ошибка запуска программы:\n" +
                `   фаил "${val}" - пуст.`);
            return;
        case langError:
            console.log("Ошибка запуска программы:\n" +
                `   неподдерживаемый язык - "${val}"`);
            return;
        case enterOperError:
            console.log("Ошибка запуска программы:\n" +
                "   вы не ввели тип операции (code/decode).");
            return;
        case operError:
            console.log("Ошибка запуска программы:\n" +
                `   неподдерживаемая операция - "${val}"\n`);
            information(messageCall);
            return;
    }
}
function checkFile(name) {
    try {
        fs.readFileSync(name);
        let content = fs.readFileSync(name, "utf8");
        if (content === '') {
            err(emptyFileError, name);
            return true;
        }
        return false;
    } catch {
        err(existFileError, name);
        return true;
    }
}
function code(alph) {
    let first, last, flag = true, alphLen = 0, shift;
    for (let i in alph) {
        if (flag && i !== 'ё') {
            last = i.charCodeAt(0);
            first = i.charCodeAt(0);
            alphLen++;
            flag = false;
        } else if (i !== 'ё') {
            last = Math.max(last, i.charCodeAt(0));
            first = Math.min(first, i.charCodeAt(0));
            alphLen++;
        }
    }
    shift = nFlag % alphLen;
    for (let i of input) {
        let up = false;
        if (!(i in alph)) {
            if (i.toLowerCase() in alph) {
                i = i.toLowerCase();
                up = true;
            }
        }
        if (i in alph) {
            let charCode;

            if (i === 'ё')
                i = 'е';

            charCode = i.charCodeAt(0) + shift;

            if (charCode > last)
                charCode = charCode - last + first - 1;

            if (charCode < first)
                charCode = last - (first - Math.abs(charCode)) + 1;

            if (up)
                result += String.fromCharCode(charCode).toUpperCase();
            else
                result += String.fromCharCode(charCode);
        } else {
            result += i;
        }
    }
    fs.writeFileSync(output, result, "utf8");
    return 0;
}
function searchShift(alphFile) {
    let minSum = Number.MAX_SAFE_INTEGER,
        shift = 0,
        n = 0;

    for (let i in alph)
        n++;
    for (let i = 0; i < n; i++) {
        let j = 0,
            sum = 0;

        for (let k in alph) {
            sum += Math.pow(alphFile[j++] - alph[k], 2);
        }
        if (sum < minSum) {
            minSum = sum;
            shift = i;
        }
        alphFile.splice(0, 0, alphFile[j - 1])
        alphFile.pop();
    }
    nFlag = shift - n;
    console.log("Возможный сдвиг:", n - shift);
    code(alph);
}
function decode(alph) {
    let fileLen = input.length,
        alphFile1 = [],
        alphFile2 = [],
        n = 0;
    for (let i of input) {
        i = i.toLowerCase();
        if (i in alph) {
            if (!(i in alphFile1)) {
                alphFile1[i] = 1;
            } else {
                alphFile1[i] += 1;
            }
        }
    }
    for (let i in alph) {
        if (i in alphFile1) {
            alphFile2[n++] = alphFile1[i] / fileLen;
        } else {
            alphFile2[n++] = 0;
        }
    }
    searchShift(alphFile2);
    return 0;
}
function checkArg() {
    if (process.argv[2] === '/?') {
        information(helpCall);
        return 0;
    } else {
        oFlag = process.argv[++n];
        if (!oFlag) {
            err(enterOperError);
            return enterOperError;
        }
        if (oFlag !== 'code' && oFlag !== 'decode') {
            err(operError, oFlag);
            return operError
        }
        arg = process.argv[++n];
        arg2 = process.argv[++n]; // он создастся, надо проверять на ошибки?
        if (!arg) {
            err(enterInputFileError);
            return enterInputFileError;
        }
        if (!arg2) {
            err(enterOutputFileError);
            return enterOutputFileError;
        }
        if (!checkFile(arg)) {
            input = fs.readFileSync(arg, "utf8");
            output = arg2;
            grupArg++;
        } else {
            return -1;
        }
        if (oFlag === 'code') {
            nFlag = process.argv[++n];
            if (nFlag === undefined) {
                err(enterIntNumError);
                return enterIntNumError;
            }
            if (!Number.isInteger(+nFlag)) {
                err(useIntNumError, nFlag);
                return useIntNumError;
            }
        }
        arg = process.argv[++n];
        switch (arg) {
            case 'ru':
                alph = ruAlph;
                break;
            case 'en':
                alph = enAlph;
                break;
            default:
                if (!arg) {
                    err(enterLangError);
                    return enterLangError;
                }
                err(langError, arg);
                return langError;
        }
        switch (oFlag) {
            case 'code':
                code(alph);
                return 0;
            case 'decode':
                decode(alph);
                return 0;
        }
    }
}

const fs = require('fs'),
    enterLangError = 1,
    enterInputFileError = 2,
    enterOutputFileError = 3,
    enterIntNumError = 4,
    existFileError = 5,
    useIntNumError = 6,
    emptyFileError = 7,
    langError = 8,
    enterOperError = 9,
    operError = 10,

    messageCall = 1,
    helpCall = 2,

    ruAlph = {'а' : 0.062, 'б' : 0.014, 'в' : 0.038, 'г' : 0.013, 'д' : 0.025, 'е' : 0.072, 'ё' : 0.072, 'ж' : 0.007, 'з' : 0.016,
              'и' : 0.062, 'й' : 0.010, 'к' : 0.028, 'л' : 0.035, 'м' : 0.026, 'н' : 0.053, 'о' : 0.090, 'п' : 0.023, 'р' : 0.040,
              'с' : 0.045, 'т' : 0.053, 'у' : 0.021, 'ф' : 0.002, 'х' : 0.009, 'ц' : 0.004, 'ч' : 0.012, 'ш' : 0.006, 'щ' : 0.003,
              'ъ' : 0.014, 'ы' : 0.016, 'ь' : 0.014, 'э' : 0.003, 'ю' : 0.006, 'я' : 0.018},

    enAlph = {'a' : 0.064, 'b' : 0.014, 'c' : 0.027, 'd' : 0.035, 'e' : 0.100, 'f' : 0.020, 'g' : 0.014, 'h' : 0.042, 'i' : 0.063,
              'j' : 0.003, 'k' : 0.006, 'l' : 0.035, 'm' : 0.020, 'n' : 0.056, 'o' : 0.056, 'p' : 0.017, 'q' : 0.004, 'r' : 0.049,
              's' : 0.056, 't' : 0.071, 'u' : 0.031, 'v' : 0.010, 'w' : 0.018, 'x' : 0.003, 'y' : 0.018, 'z' : 0.002};
const Console = require("console");

let n = 1, // индекс аргумента командной строки
    arg = process.argv[n], // первый аргумент - исполняемый фаил
    fName = fileName(),
    arg2,
    input,
    output,
    alph,
    result = '',
    grupArg = 1,
    nFlag = -1,
    oFlag;
checkArg();