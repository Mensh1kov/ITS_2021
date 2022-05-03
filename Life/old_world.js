let intervalID;
let live = []
function getGeneration() {
	let table = document.getElementById("world");
	console.log(table)
	// for (let i = 0; i < table.offsetHeight)
	return arr;
}
function drawWorld() {
	let result = "<tbody>";
	let arr = getGeneration();
	for(var i=0; i<arr.length; i++){
		result += "<tr>";
		for(var j=0; j<arr[i].length; j++){
			result += drawCell(arr[i][j]);
		}
		result += "</tr>";
	}
	result += "</tbody>";
	return result;
}

function drawCell(cell) {
	let cl = '';
	if (cell.isAlive) {
		cl = ' class="alive"'
	}
	return '<td><div' + cl +' x=' + cell.x + ' y=' + cell.y + ' onclick="changeCell(this);">&nbsp;</div></td>';
}
function newWorld() {
	let height = parseInt(document.getElementById("height").value);
	let width = parseInt(document.getElementById("width").value);
	initGeneration(height, width);
	refreshWorld();
}
function initGeneration(height, width) {
	let table = document.getElementById("world");
	let result = "<tbody>";
	for(var i=0; i<height; i++){
		result += "<tr>";
		for(var j=0; j<width; j++){
			result += drawCell({
				x: j,
				y: i,
				isAlive: false
			});
		}
		result += "</tr>";
	}
	result += "</tbody>";
	table.innerHTML = result;
}
function refreshWorld() {
	let table = document.getElementById("world");
	table.innerHTML = drawWorld();
}

function next() {
	// newGeneration();
	refreshWorld();
}

function go() {
	stop();
	intervalID = setInterval('next()', 100);
}

function stop() {
	clearInterval(intervalID);
}

function random() {
	stop();
}
function changeGeneration(x, y) {
	let cell = {
		x: x,
		y: y,
		isAlive: true
	}
	// drawCell(cell);
}
function changeCell(elem) {
	changeGeneration(parseInt(elem.getAttribute("x")), parseInt(elem.getAttribute("y")));
	// refreshWorld();
}

