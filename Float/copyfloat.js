function checkNum(suspect) {
    if (suspect === '') {
        return false;
    }
    return !isNaN(suspect);
}
function orderToBin(order) {
    order = (order + 127).toString(2);
    while (order.length !== 8) {
        order = '0' + order;
    }
    return order + ' ';
} // перевод порядка в 2-ю систему
function toBinary(num) {
    let result = '',
        whole = '',
        fract = '',
        n;
    num = num.split('.');
    if (num[0][0] === '-') {
        result += '-';
        n = -1 * Number(num[0]);
    } else {
        n = Number(num[0]);
    }
    if (n === 0)
        whole = '0';
    while (n !== 0) {
        whole = String(n % 2) + whole;
        n = Math.floor(n / 2);
    }
    if (num[1]) {
        n = Number('0.' + num[1]);
        let k = 128;
        while (n && k) {
            n = n * 2;
            fract += String(Math.floor(n));
            n = String(n).split('.');
            n = Number('0.' + n[1]);
            k--;
        }
    }
    if (fract)
        result += whole + '.' + fract;
    else
        result += whole;
    return result;
}
function float(num) { // num в 2-м виде
    let result = '',
        order = 0,
        i = 0,
        numL = num.length,
        start = 1;

    if (num[0] === '-') { // анализ знака
        result += "1 ";
        i++;
        // start = 2;
    } else {
        result += "0 "
    }

    if (num[i] === '0') { // если первое число 0, значит нет цел части
        order--;
        i += 2;
        while (num[i] !== '1') { // ищем самую левую 1
            order--;
            i++;
            if (order === -shift) { // ушли в денормаль
                i--;
                break
            }
        }
    } else { // если цел часть есть
        while (num[i + 1] !== '.' && i < numL - 1) { // анализ порядка
            order++;
            if (order === shift + 1) { // ушли в бесконечность
                if (num[0] === '-') {
                    return minusInfinity;
                }
                return plusInfinity;
            }
            i++;
        }
    }
    if (order < 0)
        start += i; // мантису начинаем с той самой ед
    else if (num[0] === '-')
        start++;

    result += orderToBin(order);

    while (num[start] && result.length !== 34) {
        if (num[start] !== '.')
            result += num[start++];
        else
            start++;
    }
    while (result.length !== 34) {
        result += '0';
    }
    return result;
}
function translate(num) {
    let segments = num.split(' '), // делю на составляющие
        result = 0,
        sym = num[0] === '1' ? -1 : 1, // знак +/-
        order = parseInt(segments[1], 2) - shift,
        mantissa = "1" + segments[2],
        number = '', // сначала переведу обратно в двоичное представ, а потом в десятичное
        mas;

    switch (order) {
        case shift + 1: // беконечность
            if (segments[2].indexOf('1') === -1)
                return Infinity * sym;
            return NaN // или не число
        case -shift: // денормаль или 0
            if (segments[2].indexOf('1') === -1) {
                return 0 * sym;
            } else
                number = "0." + "0".repeat(shift - 1) + segments[2];
            break;
        default:
            if (order < 0) {
                number = "0." + "0".repeat(Math.abs(order) - 1) + mantissa;
            } else {
                let i = 0;
                while (mantissa.charAt(i)) {
                    number += mantissa.charAt(i++);
                    if (i > order) {
                        number += '.';
                        break;
                    }
                }
                while (mantissa.charAt(i)) { // забираем все из мантиссы
                    number += mantissa.charAt(i++);
                }
                while (i <= order) { // остальное нули
                    number += '0';
                    i++;
                }
            }
    }
    segments = number.split('.'); // отдельно перевожу целую и дроб части
    for (let k = 0; k <= 1; k++) {
        if (segments[k]) { // дробной части может не быть
            let c, sum = 0, masL; // считаю методом Горнера
            if (k === 0) {
                mas = segments[0].split('');
                masL = mas.length;
                c = 2; // для целой части множитель 2
            } else {
                mas = segments[1].split('').reverse();
                masL = mas.length + 1;
                c = 0.5; // для дробной 0.5
            }
            if (mas.length > 1)
                sum = c * Number(mas[0]);
            for (let i = 1; i < masL - 1; i++) {
                sum = c * (Number(mas[i]) + sum);
            }
            if (k === 0)
                sum += Number(mas[mas.length - 1]);

            result += sum;
        }
    }
    return result * sym;
}
function summa(mantissa1, mantissa2) {
    let result = '',
        s = 0;
    for (let i = 23; i >= 0; i--) {
        s += Number(mantissa1[i]) + Number(mantissa2[i]);
        switch (s) {
            case 0:
                result = '0' + result;
                s = 0;
                break;
            case 1:
                result = '1' + result;
                s = 0;
                break;
            case 2:
                result = '0' + result;
                s = 1;
                break;
            case 3:
                result = '1' + result;
                s = 1;
                break;
        }
    }
    return [result, s];
}
function difference(mantissa1, mantissa2) {
    let result = '',
        s = 0;
    for (let i = 23; i >= 0; i--) {
        s += Number(mantissa1[i]) - Number(mantissa2[i]);
        switch (s) {
            case 0:
                result = '0' + result;
                s = 0;
                break;
            case 1:
                result = '1' + result;
                s = 0;
                break;
            case -1:
                result = '1' + result;
                s = -1;
                break;
            case -2:
                result = '0' + result;
                s = -1;
                break;
        }
    }
    return [result, s];
}
function calculation(num1, num2) {
    let a = num1.split(' '),
        b = num2.split(' '),
        order1 = parseInt(a[1], 2) - shift, // порядки чисел
        order2 = parseInt(b[1], 2) - shift,
        order = Math.max(order1, order2), // порядок наибольшего числа
        mantissa,
        mantissa1, // мантисса наиб числа
        mantissa2,
        sym, // знак +/-, буду запоминать знак большего числа
        val,
        result = '';
    if (order1 > order2) {
        sym = num1[0];
        mantissa1 = '1' + a[2];
        mantissa2 = '0'.repeat(order1 - order2) + '1' + b[2];
    } else if (order1 < order2) {
        sym = num2[0];
        mantissa1 = '1' + b[2];
        mantissa2 = '0'.repeat(order2 - order1) + '1' + a[2];
    } else { // порядки равны, сравниваем мантиссы
        if (a[2] > b[2])
            sym = num1[0];
        else if (a[2] < b[2])
            sym = num2[0];
        else if (num1[0] === num2[0])
            sym = num1[0];
        else
            sym = '0'; // если они равны, разность будет 0
        if (order1 === -shift) { // если денормаль, то делаю так, чтобы решать так же, как и нормаль
            mantissa1 = (a[2] >= b[2] ? a[2] : b[2]) + '0'; // нужно ноль в конец добавить, а не в начало, это для того,
            mantissa2 = (a[2] <= b[2] ? a[2] : b[2]) + '0'; // чтобы в случае, если денормаль 0.10..0 + 0.10..0 перейти к нормаль
        } else {
            mantissa1 = '1' + (a[2] >= b[2] ? a[2] : b[2]); // с нормаль все ок, в начало ед
            mantissa2 = '1' + (a[2] <= b[2] ? a[2] : b[2]);
        }
    }
    if (Number(num1[0]) === Number(num2[0])) { // если знаки равны, то складываем
        val = summa(mantissa1, mantissa2);
        result = val[0];
        order += val[1];
    } else { // если разные, то из большего выч меньшее и сохраняем знак большего числа
        let i = 0, str = '';
        val = difference(mantissa1, mantissa2); // в результате может поменяться порядок
        result = val[0];
        while (result[i] !== '1') { // ищу самую левую 1
            if (order === -shift) // ушли в денормаль
                break
            order--;
            i++;
        }
        while (result[i])
            str += result[i++];
        while (str.length !== 24)
            str += '0';
        result = str;
    }
    if (order === -shift + 1 || order === shift + 1) // бесконечность и переход из денормаль в нормаль
        mantissa = '0'.repeat(23);
    else if (val[1] === 0 && order !== -shift) { // остались в том же порядке и это не денормаль
        mantissa = result.slice(1);
    } else {
        mantissa = result.slice(0, 23); //если остались в денормаль
    }
    return sym + ' ' + orderToBin(order) + mantissa;
}
function calc(num1, num2) {
    let a = num1.split(' '),
        b = num2.split(' ');

    if (a[1].indexOf('0') === -1 || b[1].indexOf('0') === -1) { // обработка бесконечностей
        if (a[1].indexOf('0') !== -1)
            return num2;
        if (b[1].indexOf('0') !== -1)
            return num1;
        if (num1[0] === num2[0])
            return num1;
        return NotANum
    }
    if (a[1].indexOf('1') === -1 || b[1].indexOf('1') === -1) { // обработка денормаль, если одно нормаль, другое нет
        if (a[1].indexOf('1') !== -1)
            return num1;
        if (b[1].indexOf('1') !== -1)
            return num2;
    }
    return calculation(num1, num2);
}

const NotANum = "0 11111111 10000000000000000000000",
    plusInfinity = "0 11111111 00000000000000000000000",
    minusInfinity = "1 11111111 00000000000000000000000",
    shift = 127;

let input = process.argv[2],
    num1,
    num2,
    res;

if (!input) {
    console.log("Ошибка запуска программы:\n" +
        "   Вы не ввели данные!")
} else if (checkNum(input)) {  //если ввели одно число
    num1 = Number(input).toString(2);
    num1 = float(num1);
    console.log(num1);  // число в float
    console.log(translate(num1))
} else {
    let numbers = input.split(/[+-]/), // разделяю по +/-
        numbersL = numbers.length,
        firstSym = input.charAt(0);

    if ((firstSym === '+' || firstSym === '-') && numbersL === 3) { // если первый симв +/-, то просплит пуст строка
        if (checkNum(numbers[1]) && checkNum(numbers[2])) {
            num1 = Number(firstSym + numbers[1]).toString(2); // числа в двоич пердстав
            num2 = Number(input.charAt(numbers[1].length + 1) + numbers[2]).toString(2); // числа в двоич пердстав
            num1 = float(num1);
            num2 = float(num2);
            res = calc(num1, num2);
            console.log(res);
            console.log(translate(res));
        } else {
            console.log(NotANum);
            console.log(translate(NotANum));
        }
    } else if (numbersL === 2) {
        if (checkNum(numbers[0]) && checkNum(numbers[1])) {
            num1 = Number(numbers[0]).toString(2);
            num2 = Number(input.charAt(numbers[0].length) + numbers[1]).toString(2);
            num1 = float(num1);
            num2 = float(num2);
            res = calc(num1, num2);
            console.log(res)
            console.log(translate(res));
        } else {
            console.log(NotANum);
            console.log(translate(NotANum));

        }
    } else {
        console.log(NotANum);
        console.log(translate(NotANum));

    }
}
// console.log('-------------------------')
// num1 = float(Number(1.4587517013621346e-42).toString(2));
// num2 = float(Number(1.4587517013621346e-42).toString(2));
// console.log(num1)
// console.log(num2)
// num1 = calc(num1, num2);
// console.log(num1);
// console.log(translate(num1));