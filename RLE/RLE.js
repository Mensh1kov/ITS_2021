// чтобы запустить программу, вводим в консоль: node name.js code/decode jump/escape in.txt out.txt

function codeEscape() { //кодирует строку методом escape
    for (let i = 0; i < readFile.length; i++) {
        symbol = readFile[i]
        if (symbol === readFile[i + 1]) {
            count++ //количество подряд идущих символов
            if (count === limitEscape) {
                str = escapeSymbol + String.fromCharCode(count) + symbol
                enter(str)
                count = 1
                i++
            }
        }
        else if ((count > 3) || (symbol === escapeSymbol)) {
            str = escapeSymbol + String.fromCharCode(count) + symbol
            enter(str)
            count = 1
        }
        else if (count > 0) {
            str = symbol
            for (let j = 1; j < count; j++) {
                str += symbol
            }
            enter(str)
            count = 1
        }
    }
}
function decodeEscape() { //декодирует строку, закодированную методом кодирования escape
    let i = 0 // счетчик
    while (i < readFile.length) {
        if (readFile[i] === escapeSymbol) {
            str = readFile[i + 2]
            for (let j = 1; j < readFile[i + 1].charCodeAt(0); j++)  {
                str += readFile[i + 2]
            }
            enter(str)
            i += 3
        }
        else {
            str = readFile[i]
            enter(str)
            i += 1
        }
    }
}
function codeJump() {
    for (let i = 0; i < readFile.length; i++) {
        symbol = readFile[i]
        if (symbol === readFile[i + 1]) {
            count++
            if (incompressibleString !== undefined) {
                str = String.fromCharCode(incompressibleString.length + limitJump - 1) + incompressibleString
                enter(str)
                incompressibleString = undefined
            }
            if (count === limitJump) {
                str = String.fromCharCode(count - 1) + symbol
                enter(str)
                count = 1
            }
        }
        else if (count > 1) {
            str = String.fromCharCode(count) + symbol
            enter(str)
            count = 1
        }
        else if (count === 1 && incompressibleString === undefined)
            incompressibleString = readFile[i]
        else
            incompressibleString += readFile[i]
        if (incompressibleString !== undefined && incompressibleString.length === limitJump) {
            str = String.fromCharCode(incompressibleString.length + limitJump - 1) + incompressibleString
            enter(str)
            incompressibleString = undefined
        }
        if (incompressibleString !== undefined && i === (readFile.length - 1)) {
            str = String.fromCharCode(incompressibleString.length + limitJump - 1) + incompressibleString
            enter(str)
        }
    }
}
function decodeJump() {
    for (let i = 0; i < readFile.length;) {
        if (readFile[i].charCodeAt(0) < limitJump) {
            str = readFile[i + 1]
            for (let j = 1; j < readFile[i].charCodeAt(0); j++) {
                str += readFile[i + 1]
            }
            enter(str)
            i += 2
        }
        else if (readFile[i].charCodeAt(0) >= limitJump) {
            let z,       // счетчик
                iOld = i // сохраняем старое значение i
            str = readFile[++i]
            i++
            for (z = 1; z < readFile[iOld].charCodeAt(0) - limitJump + 1; z++) {
                str += readFile[i++]
            }
            enter(str)
        }
    }
}
function enter (whatToEnterInFile) {
    if (result === undefined)
        result = whatToEnterInFile
    else
        result += whatToEnterInFile
    return result
}

const fs = require('fs'),
    escapeSymbol = '#', //экранирующий символ
    limitEscape = 255,  //лимит счетчика (чтобы поместился в байт) в Escape
    limitJump = 128     //лимит счетчика для несжимаемой строки в Jump (для сжимаемой он составляет 127)

let count = 1, //количество подряд идущих символов
    symbol, //рассматриваемый символ
    readFile, //данные из фаила
    str, //закодированные части строки
    result, //итог работы кодирования/декодирования
    method = process.argv[3], //метод кодирования jump/escape
    operation = process.argv[2], //операция code/decode
    incompressibleString = undefined // несжимаемая строка

fs.access(process.argv[4], function(error){
    if (error) {
        console.log(`File is not found: ${process.argv[4]}`)
    }
    else {
        readFile = fs.readFileSync(process.argv[4], "utf8")
        if (method === 'jump') {
            if (operation === 'code')
                codeJump()
            else if (operation === 'decode')
                decodeJump()
            else
                console.log(`invalid syntax: ${operation}`)
        }
        else if (method === 'escape') {
            if (operation === 'code')
                codeEscape()
            else if (operation === 'decode')
                decodeEscape()
            else
                console.log(`invalid syntax: ${operation}`)
        }
        else
            console.log(`invalid syntax: ${method}`)
        if (result !== undefined) {
            fs.writeFileSync(process.argv[5], result, "utf8") //запись результата работы программы в фаил
        }
    }
})