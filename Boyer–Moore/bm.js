function fileName() {
    let name = process.argv[1];
    name = name.split("\\"
    );
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
                `   >node ${fName} [ключи] string_file substring_file\n` +
                "\n" +
                "где string_file - файл со строкой,\n" +
                "substring_file - файл с подстрокой;\n" +
                "ключи - список ключей:\n" +
                "    -n N, где N - произвольное натуральное число - вывести первые N вхождений;\n" +
                "    -t - вывести время работы алгоритма.");
            return;
    }
}
function err(codeErr, val) {
    switch (codeErr) {
        case duplicateKeyError:
            console.log("Ошибка запуска программы:\n" +
                `   не используйте один и тот же ключ несколько раз: "${val}"\n`);
            information(messageCall);
            return;
        case enterStringFileError:
            console.log("Вы не ввели фаил со строкой!\n");
            information(messageCall);
            return;
        case enterSubstringFileError:
            console.log("Вы не ввели фаил с подстрокой!\n");
            information(messageCall);
            return;
        case enterNaturalNumError:
            console.log("Ошибка запуска программы:\n" +
                `   "${val} " - вы не ввели натуральное число.`);
            return;
        case existFileError:
            console.log("Ошибка запуска программы:\n" +
                `   фаил: "${val}" - не существует!`);
            return;
        case useNaturalNumError:
            console.log("Ошибка запуска программы:\n" +
                `   "${val}" - используйте натуральное число.`);
            return;
        case emptyFileError:
            console.log("Ошибка запуска программы:\n" +
                `   фаил "${val}" - пуст.`);
            return;
    }
}
function res(r, t) {
    if (r.length === 0) {
        r = 'нет вхождений!';
    }
    console.log(`Индексы вхождений: ${r}`)
    if (tFlag) {
        console.log(`Время работы алгоритма: ${t.toFixed(3)}ms`);
    }
    return 0;
}
function goodSuffix(m, l, sub) {
    let k,
        start,
        correct = 0;
    m--;
    k = m - l; // (1)
    start = k;
    while (true) {
        if (k < 0) {
            start = 0;
            correct = Math.abs(k);
        } else {
            start = k;
            correct = 0;
        }
        if (sub.slice(start, k + l) === sub.slice(m + correct - l + 1, m + 1)) { // (2)
            if ((k > 0 && sub.charAt(k - 1) !== sub.charAt(m - l)) || (k <= 0)) { // (3)
                return m - k - l + 1;
            }
        }
        k--;
    }
}
function boyerMoore(str, sub) {
    let i = 0,
        goodPos = -1,
        sufL = 0, // количество совпавших символов
        col = 0,
        strL = str.length,
        subL = sub.length,
        firstRule = [],
        secondRule = [],
        shift_1,
        shift_2,
        time = performance.now();
    // построение таблиц
    for (; i < subL; i++) {
        firstRule[sub.charAt(i)] = i + 1;
        secondRule[i] = goodSuffix(subL, i, sub);
    }
    secondRule[i] = goodSuffix(subL, i, sub);
    // поиск вхождений
    i = subL - 1;
    for (let j = subL - 1; j < strL;) {
        if (str.charAt(j) === sub.charAt(i)) {
            sufL++;
            if (j === goodPos) {   // удачный индекс
                j = j + sufL - subL;
                sufL = subL;
            }
            if (sufL === subL) {
                result += String(j + 1) + ',';
                goodPos = j + subL;
                j += subL + secondRule[sufL];
                i = subL;
                sufL = 0;
                col++;
                if (col === Number(nFlag)) {
                    break;
                }
            }
        } else {
            if (str.charAt(j) in firstRule) {
                shift_1 = Math.max(subL - firstRule[str.charAt(j)] - sufL, 1);
                shift_2 = secondRule[sufL];
                j += sufL + Math.max(shift_1, shift_2) + 1;
            } else {
                j = j + subL + 1;
            }
            goodPos = -1;
            sufL = 0;
            i = subL;
        }
        j--;
        i--;
    }
    time = performance.now() - time;
    result = result.slice(0, result.length - 1);
    res(result, time);
    return 0;
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
function checkArg() {
    if (process.argv[2] === '/?') {
        information(helpCall);
        return 0;
    } else {
        while (arg) {
            arg = process.argv[++n];
            if (!arg) {
                err(enterStringFileError);
                return enterStringFileError;
            }
            if (grupArg === 1 && arg) { // имя фаила может быть как у ключа?
                if (keys1.indexOf(arg) !== -1) {
                    if (keys2.indexOf(arg) !== -1) {
                        keys2.splice(keys2.indexOf(arg), 1);
                        if (arg === '-n') {
                            nFlag = process.argv[++n];
                            if (nFlag === undefined) {
                                err(enterNaturalNumError, arg);
                                return enterNaturalNumError;
                            }
                            if (!Number.isInteger(+nFlag)) {
                                err(useNaturalNumError, nFlag);
                                return useNaturalNumError;
                            }
                            if (+nFlag < 1) {
                                err(useNaturalNumError, nFlag);
                                return useNaturalNumError;
                            }
                        } else if (arg === '-t') {
                            tFlag = 1;
                        }
                    } else {
                        err(duplicateKeyError, arg);
                        return duplicateKeyError;
                    }
                } else {
                    grupArg = 2;
                    arg2 = process.argv[++n];
                    if (!arg2) {
                        err(enterSubstringFileError);
                        return enterSubstringFileError;
                    }
                }
            }
            if (grupArg === 2 && arg && arg2) {
                if (!checkFile(arg) && !checkFile(arg2)) {
                    string = fs.readFileSync(arg, "utf8");
                    subString = fs.readFileSync(arg2, "utf8");
                    break;
                } else {
                    return enterSubstringFileError;
                }
            }
        }
    }
    boyerMoore(string, subString);
    return 0;
}

const fs = require("fs"),
    {performance} = require("perf_hooks"),

    duplicateKeyError = 1,
    enterStringFileError = 2,
    enterSubstringFileError = 3,
    enterNaturalNumError = 4,
    existFileError = 5,
    useNaturalNumError = 6,
    emptyFileError = 7,

    messageCall = 1,
    helpCall = 2,
    keys1 = ['-n', '-t'];

let keys2 = ['-n', '-t'],
    n = 1, // индекс аргумента командной строки
    arg = process.argv[n], // первый аргумент - исполняемый фаил
    fName = fileName(),
    arg2,
    string,
    subString,
    result = '',
    grupArg = 1, // 1 - ключи, 2 - фаилы
    nFlag = -1,
    tFlag = 0;
checkArg();