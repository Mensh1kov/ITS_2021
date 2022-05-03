function count (n) {
    let col = 0 //  количество определенных элементов в строке
    for (let j = 0; j < inputFileContent.length; j++) {
        if (n === inputFileContent[j]) {
            col++
        }
    }
    return col
}
function code() {
    let knot,             // узел
        i = 0,            // счетчик
        resultTable = '', // таблица кодов
        elements = [],    // элементы, которые существуют в строке
        colAndElement = [] // пары: [количество, элемент]

    while (i < inputFileContent.length) { // количество определенных символов в строке
        if (elements.indexOf(inputFileContent[i]) !== -1) {
            i++
        }
        else {
            elements.push(inputFileContent[i])
            colAndElement.push([count(inputFileContent[i]), inputFileContent[i]])
            i++
        }
    }
    colAndElement.sort()

    if (colAndElement.length === 1) // если строка состоит из одного и того же символа, то этот символ кодируем 0
        table[colAndElement[0][1]] = '0'

    while (colAndElement.length > 1) { // если строка состоит из двух и более различных символов, строим дерево
        let first = colAndElement[0][1],
            second = colAndElement[1][1]

        knot = [colAndElement[0][0] + colAndElement[1][0], first + second] // построение узла
        // формирование кодов символов
        if (first.length === 1) {
            table[first] = '0'
        }
        else {
            for (let l of first) {
                table[l] = '0' + table[l]
            }
        }
        if (second.length === 1) {
            table[second] = '1'
        }
        else {
            for (let j of second) {
                table[j] = '1' + table[j]
            }
        }
        colAndElement.splice(0, 2)
        colAndElement.push(knot)
        colAndElement.sort()
    }

    for (let j of inputFileContent) // создаем закодированную строку
        result += table[j]
    fs.writeFileSync(process.argv[5], result, "utf8")

    for (let f in table) { // создаем строку - таблицу кодов
        resultTable += `${f}-${table[f]}\n`
    }

    resultTable = resultTable.slice(0, -1) // убираю последний перевод на новую строку
    fs.writeFileSync(process.argv[4], resultTable, "utf8")
}
function decode() {
    let inputTable = fs.readFileSync(process.argv[4], "utf8"),
        key = '',
        symbol = '',
        symbolCode = ''
    for (let i = 0; i < inputTable.length;) { // формирую таблицу для декода
        symbol = inputTable[i++] // сам символ
        while (inputTable[++i] !== '\n' && i < inputTable.length) {
            symbolCode += inputTable[i] // код символа
        }
        table[symbolCode] = symbol
        symbolCode = ''
        i++
    }
    for (let j of inputFileContent) {
        key += j
        if (key in table) {
            result += table[key]
            key = ''
        }
    }
    if (key !== '')
        console.log("Decode error!!!")
    fs.writeFileSync(process.argv[5], result, "utf8")
}

const fs = require('fs')

let operation = process.argv[2], //операция code/decode
    inputFileContent, // данные из файла
    table = {}, // таблица кодов
    result = '' // результат работы программы

fs.access(process.argv[3], function(error) { // проверка на наличие фаила, данные из которого нужно закодировать/раскодировать
    if (error) {
        console.log(`File is not found: ${process.argv[3]}`)
    }
    else {
        inputFileContent = fs.readFileSync(process.argv[3], "utf8") // чтение из фаила
        switch (operation) {
            case 'code':
                code()
                break
            case 'decode':
                fs.access(process.argv[4], function(error) { // при декоде проверяем, существует ли фаил с таблицей кодов для символов
                    if (error) {
                        console.log(`File is not found: ${process.argv[4]}`)
                    } else
                        decode()
                })
                break
            default:
                console.log(`invalid syntax: ${operation}`)
        }
    }
})