

// JavaScript is primarily used for implementing the logic and functionality of web applications.


// variables
let board;
let score = 0;
let rows = 4;
let columns = 4;


// Functions are callable programmed tasks.
function setGame() {

	// Initialize the 4x4 game board with all tiles set to 0.
	board = [
		[0, 2, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]; // Goal, we will use the backend board to add and move the tiles of the frontend board.

	for (let r=0; r<rows; r++) {
		for (let c=0; c<columns; c++) {

			let tile = document.createElement("div");
			tile.id = r.toString() + "-" + c.toString();
			let num = board[r][c];

			// updates the appearance and color of the tiles
			updateTile(tile, num);
			document.getElementById("board").append(tile);
		}
	}
}


// updates the appearance and the color of the tile
function updateTile(tile, num) {
	tile.innerText = "";
	tile.classList.value = "";
	tile.classList.add("tile");

	if (num > 0) {
		tile.innerText = num.toString();

		if (num <= 4096) {
			tile.classList.add("x" + num.toString());
		}
		else {
			tile.classList.add("x8192");
		}
	}
}


/**
 * The 'load' event set with an event handler.
 * The 'load' event is fired when the whole page is loaded including all dependent resources (css, js, images, etc.).
 */
window.onload = function() {
	setGame();
}


function handleSlide(e) {

	// displays what key is being pressed
	console.log(e.code);

	if (e.code == "ArrowLeft") {
		slideLeft();
	}
	else if (e.code == "ArrowRight") {
		slideRight();
	}
	else if (e.code == "ArrowUp") {
		slideUp();
	}
	else if (e.code == "ArrowDown") {
		slideDown();
	}
}


document.addEventListener("keydown", handleSlide);


function filterZero(row) {
	return row.filter(num => num != 0);
}


function slide(row) {
	row = filterZero(row);

	for (let i=0; i<row.length-1; i++) {
		if (row[i] == row[i+1]) {
			row[1] *= 2;
			row[i+1] = 0;
		}
	}

	while (row.length < columns) {
		row.push(0);
	}
}


function slideLeft() {
	for (let r=0; r<rows; r++) {
		let row = board[r];

		row = slide(row);
		board[r] = row;

		for (let c=0; c<columns; c++) {
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);
		}
	}
}

