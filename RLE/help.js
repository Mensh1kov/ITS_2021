/*Программа кодирует и декодирует при помощи метода escape для запуска программы необходимо ввести
 node RLE.js escape encode in.txt out.txt - для кодирования
 node RLE.js escape decode in.txt out.txt - для декодирования
 */
const fs = require('fs'), escapeSymbol = '#'        //задаем постоянные переменные
let readFile, n = 1, sign, end, max = 255, result = '', way = process.argv[2], action = process.argv[3] //задаем конечные переменные
const coding = function code() {                //функция для кодирования
    for (let i = 0; i < readFile.length; i++) { //количество повторяющихся символов
        sign = readFile[i]
        if (sign === readFile[i + 1]) {
            n++
            if (n === max) {
                end = escapeSymbol + String.fromCharCode(n) + sign
                output(end)
                n = 1
                i++
            }
        }
        else if ((n > 3) || (sign === escapeSymbol)) {
            end = escapeSymbol + String.fromCharCode(n) + sign
            output(end)
            n = 1
        }
        else if (n > 0) {
            end = sign
            for (let j = 1; j < n; j++) {
                end += sign
            }
            output(end)
            n = 1
        }
    }
}
const decoding = function decode() {                // функция декодирующая текст
    let i = 0
    while (i < readFile.length) {
        if (readFile[i] === escapeSymbol) {
            end = readFile[i + 2]
            for (let j = 1; j < readFile[i + 1].charCodeAt(0); j++)  {
                end += readFile[i + 2]
            }
            output(end)
            i += 3
        }
        else {
            end = readFile[i]
            output(end)
            i += 1
        }
    }
}
function output (final) {               //функция составляющая конечную строку
    result += final
    /*return result*/
}
fs.access(process.argv[4], function(error) { // проверка на наличие фаила
    if (error) {
        console.log(`File is not found: ${process.argv[4]}`)
    }
    else {
        readFile = fs.readFileSync(process.argv[4], "utf8")
        if (way === 'escape') {             // считываем данные из терминала и выполняем задание
            if (action === 'encode')
                coding()
            else if (action === 'decode')
                decoding()
            else
                console.log('invalid property')
        }
        if (result !== '') {             //записываем конечный код в файл
            fs.writeFileSync(process.argv[5], result, "utf8")
        }
    }
})