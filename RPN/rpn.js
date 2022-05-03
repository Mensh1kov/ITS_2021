function err(codeErr) {
    switch (codeErr) {
        case inputErr:
            console.log('Ошибка запуска программы:\n' +
                        '   некорректный ввод данных!');
            return;
    }
}
function checkData(data) {
    let k = 0;

    if (data.length === 0)
        return false;

    for (let i = 0; i < data.length; i++) {
        if (data[i] === '^' && data[i + 2] === '^')
            return false;
        if (k < 0)
            return false;
        switch (data[i]) {
            case '(':
                k++;
                break;
            case ')':
                k--;
                break;
        }
    }
    return k === 0;
}
function toRPN(data) {
    let n = 0,
        arg = data[n++],
        i = 0,
        stack = [],
        result = '';

    while (arg) { // иду по компонентам
        if (oper[arg]) { // если операция
            if (!stack[i]) { // если стек путой
                stack[i] = arg; // просто кладу операцию
            } else if (oper[arg] <= oper[stack[i]] && arg !== '(') { // если операция младше или равна и это не "("
                while (oper[arg] <= oper[stack[i]]) { // вытесняю операции
                    if (stack[i] !== '(') { // если arg === ')' то выталкивать нужно все до "("
                        result += stack[i--] + ' ';
                        stack.pop();
                    } else { // а саму "(" просто убираем из стека
                        stack.pop();
                        i !== 0 ? i-- : i; // чтобы не уйти в
                        break;
                    }
                }
                if (arg !== ')') // в стек ")" не кладем
                    stack[++i] = arg;
            } else { // если операция по старше последней в стеке или это "("
                stack[++i] = arg; // то просто кладем в стек
            }
        } else { // если это операнд, то его сразу пишем в строку
            result += arg + ' ';
        }
        arg = data[n++];
    }
    while (stack[i]) // оставшиеся в стеке операции записываем в строку
        result += stack[i--] + ' ';
    return result;
}
function value(data) {
    data = data.split(' ');
    let stack = [],
        i = -1,
        n = 0,
        arg = data[n++];

    while (arg) {
        if (oper[arg]) {
            switch (arg) {
                case '+':
                    stack[--i] = stack[i] + stack[i + 1];
                    break;
                case '-':
                    stack[--i] = stack[i] - stack[i + 1];
                    break;
                case '*':
                    stack[--i] = stack[i] * stack[i + 1];
                    break;
                case '/':
                    stack[--i] = stack[i] / stack[i + 1];
                    break;
                case '^':
                    stack[--i] = Math.pow(stack[i], stack[i + 1]);
                    break;
            }
            stack.pop();
        } else {
            stack[++i] = Number(arg);
        }
        arg = data[n++];
    }
    if (stack.length === 1 && !isNaN(stack[0]))
        return stack[0];
    else
        return 'некорректный ввод данных!'
}
const readline = require('readline'),
    {stdin: input, stdout: output} = require('process'),
    rl = readline.createInterface({input, output}),
    oper = {'+': 2, '-': 2, '*': 3, '/': 3, '^': 4, '(': 1, ')': 1},
    inputErr = 1;

let inputDataBefor,
    inputDataAfter = [];

rl.question('Инфиксная: ', (data) => {
    inputDataBefor = data.split(' ');
    rl.close();
    let j = 0;
    for (let i = 0; i < inputDataBefor.length; i++) { // избавляюсь от ''
        if (inputDataBefor[i] !== '')
            inputDataAfter[j++] = inputDataBefor[i];
    }
    if (!checkData(inputDataAfter))
        err(inputErr);
    else {
        let a = toRPN(inputDataAfter),
            b = value(a);
        console.log('Постфиксная:', a);
        console.log('Значение выражения:', b);
    }
});