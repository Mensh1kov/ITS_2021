let intervalID,
    live,
    height,
    width;
function drawWorld() {
    let result = "<tbody>";
    for(let i=0; i < live.length; i++){
        result += "<tr>";
        for(let j=0; j < live[i].length; j++){
            result += drawCell(live[i][j]);
        }
        result += "</tr>";
    }
    result += "</tbody>";
    return result;
}
function refreshWorld() {
    let table = document.getElementById("world");
    table.innerHTML = drawWorld();
}
function newWorld() {
    stop();
    height = parseInt(document.getElementById("height").value);
    width = parseInt(document.getElementById("width").value);
    live = initGeneration();
    refreshWorld();
}
function initGeneration() {
    let live = new Array(height);
    for (let i = 0; i < height; i++) {
        live[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            live[i][j] = {
                x: j,
                y: i,
                isAlive: false
            }
        }
    }
    return live;
}
function drawCell(cell) {
    let cl = '';
    if (cell.isAlive) {
        cl = ' class="alive"'
    }
    return '<td><div' + cl +' x=' + cell.x + ' y=' + cell.y + ' onclick="changeCell(this);">&nbsp;</div></td>';
}
function changeGeneration(x, y) {
    live[y][x].isAlive = !live[y][x].isAlive;
}
function changeCell(elem) {
    changeGeneration(parseInt(elem.getAttribute("x")), parseInt(elem.getAttribute("y")));
    refreshWorld();
}
function go() {
    stop();
    intervalID = setInterval('next()', 100);
}
function next() {
    newGeneration();
    refreshWorld();
}
function stop() {
    clearInterval(intervalID);
}
function infinity(x, y) {
    x = x % width;
    y = y % height;
    if (x < 0)
        x = width - 1;
    if (y < 0)
        y = height - 1;
    return [x, y];
}
function willLive(x, y) {
    let countAlive = 0,
        old_y = y,
        old_x = x,
        position;
    for (let i = 0; i < 3; i++) {
        i !== 0 ? y++ : y;
        x = old_x;
        for (let j = 0; j < 3; j++) {
            j !== 0 ? x++ : x;
            if (i === 1 && j === 1)
                continue;
            position = infinity(x, y);
            if (live[position[1]][position[0]].isAlive) {
                countAlive++;
                if (countAlive > 3)
                    return false;
            }
        }
    }
    if (live[old_y + 1][old_x + 1].isAlive && (countAlive === 2 || countAlive === 3))
        return true;
    return countAlive === 3;
}
function newGeneration() {
    let newLive = initGeneration();
    for (let y = 0; y < live.length; y++){
        for (let x = 0; x < live[y].length; x++){
            newLive[y][x] = {
                x: x,
                y: y,
                isAlive: willLive(x - 1, y - 1)
            };
        }
    }
    live = newLive;
}
function random() {
    let count = Math.random() * (height * width);
    for (let i = 0; i < count; i++) {
        let x = Math.floor(Math.random() * width);
        let y = Math.floor(Math.random() * height);
        live[y][x].isAlive = true;
    }
    refreshWorld();
}