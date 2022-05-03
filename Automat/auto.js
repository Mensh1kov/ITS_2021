function fileName() {
    let name = process.argv[1];
    name = name.split("\\");
    return name[name.length - 1];
}
function err(codeErr, val) {
    switch (codeErr) {
        case 1:
            console.log("Ошибка запуска программы:\n" +
                `   не используйте один и тот же ключ несколько раз: "${val}"\n`);
            err(7);
            return;
        case 2:
            console.log("Вы не ввели фаил со строкой!\n");
            err(7);
            return;
        case 3:
            console.log("Вы не ввели фаил с подстрокой!\n");
            err(7);
            return;
        case 4:
            console.log("Ошибка запуска программы:\n" +
                `   "${val} " - вы не ввели натуральное число.`);
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
        case 'inf':
            console.log("Пример запуска:\n" +
                `   >node ${fName} [ключи] string_file substring_file\n` + // имя исп фаила?
                "\n" +
                "где string_file - файл со строкой,\n" +
                "substring_file - файл с подстрокой;\n" +
                "ключи - список ключей:\n" +
                "    -a - помимо списка вхождений вывести таблицу автомата;\n" +
                "    -n N, где N - произвольное натуральное число - вывести первые N вхождений;\n" +
                "    -t - вывести время работы алгоритма.");
            return;
    }
}
function res(r, t, a) {
    if (r.length === 0) {
        r = 'нет вхождений!';
    }
    console.log(`Индексы вхождений: ${r}`)
    if (aFlag) {
        console.log("Таблица переходов:");
        for (let i = 0; i < a.length; i++) {
            console.log(`Сост. ${i}:`, a[i]);
        }
    }
    if (tFlag) {
        console.log(`Время работы алгоритма: ${t.toFixed(3)}ms`);
    }
    return 0;
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
function automat(str, sub) {
    let subL = sub.length,
        k = 0,
        col = 0,
        prev,
        alph = [],
        move = new Array(subL + 1),
        time = performance.now();
    for (let i = 0; i < subL; i++) { // опред алфавит подстроки
        alph[sub.charAt(i)] = 0; // str[i] === str.charAt(i)?
    }
    for (let i = 0; i <= subL; i++) { // двумерный массив для таблицы переходов
        move[i] = {};
    }
    for (let i in alph) { // инициализация таблицы переходов
        move[0][i] = 0;
    }
    for (let i = 0; i < subL; i++) { // формирование таблицы переходов
        prev = move[i][sub.charAt(i)];
        move[i][sub.charAt(i)] = i + 1;
        for (let j in alph) {
            move[i + 1][j] = move[prev][j];
        }
    }
    for (let i = 0; i < str.length; i++) { // поиск подстроки в строке
        if (str.charAt(i) in move[k]) {
             k = move[k][str.charAt(i)];
        } else {
            k = 0;
        }
        if (k === subL) {
            col++;
            result += String(i - subL + 2) + ',';
        }
        if (col === Number(nFlag)) {
            break;
        }
    }
    time = performance.now() - time;
    result = result.slice(0, result.length - 1);
    res(result, time, move);
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
                err(2);
                return 2;
            }
            if (grupArg === 1 && arg) {
                if (keys1.indexOf(arg) !== -1) {
                    if (keys2.indexOf(arg) !== -1) {
                        keys2.splice(keys2.indexOf(arg), 1);
                        if (arg === '-a') {
                            aFlag = 1;
                        } else if (arg === '-n') {
                            nFlag = process.argv[++n];
                            if (nFlag === undefined) {
                                err(4, arg);
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
                    arg2 = process.argv[++n];
                    if (!arg2) {
                        err(3);
                        return 2;
                    }
                }
            }
            if (grupArg === 2 && arg && arg2) {
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
    automat(string, subString);
    return 0;
}

const fs = require("fs"),
    {performance} = require('perf_hooks'),
    keys1 = ['-a', '-n', '-t'];

let keys2 = ['-a', '-n', '-t'],
    n = 1, // индекс аргумента командной строки
    arg = process.argv[n], // первый аргумент - исполняемый фаил
    fName = fileName(),
    arg2,
    string,
    subString,
    result = '',
    grupArg = 1, // 1 - ключи, 2 - фаилы
    aFlag = 0,
    nFlag = -1,
    tFlag = 0;
checkArg();