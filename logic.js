

// JavaScript is primarily used for implementing the logic and functionality of web applications.


// variables
let board;
let score = 0;
let rows = 4;
let columns = 4;

// boolean true/false of scores
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;


// used for mobile (touch) input; (x, y) coordinates
let startX = 0;
let startY = 0;


/** setGame()
 * A function sets the game board to have tiles, and these tiles should have corressponding
 * colors based on their values and this is through the help of updateTile() function
 */
function setGame() {

	// Initialize the 4x4 game board with all tiles set to 0.
	board = [
		[0, 0, 0, 0],
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

	// call to generate random 2s
	setTwo();
	setTwo();
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
 * The 'load' event is fired when the whole page is loaded including all dependent resources
 * (css, js, images, etc.).
 */
window.onload = function() {
	setGame();
}


/** handleSlide()
 * A function responsible for the logic whenever arrow keys are pressed.
 */
function handleSlide(e) {

	// displays what key is being pressed
	console.log(e.code);

	// disables the default behaviour of browser on key-events
	e.preventDefault();

	if (e.code=="ArrowLeft" && canMoveLeft()==true) {
		slideLeft();
		setTwo();
	}
	else if (e.code=="ArrowRight" && canMoveRight()==true) {
		slideRight();
		setTwo();
	}
	else if (e.code=="ArrowUp" && canMoveUp()==true) {
		slideUp();
		setTwo();
	}
	else if (e.code=="ArrowDown" && canMoveDown()==true) {
		slideDown();
		setTwo();
	}

	// dom score
	document.getElementById('score').innerText = score;

	checkWin();

	if (hasLost() == true) {
		setTimeout(() => {
			alert("Game Over!");
			restartGame();
			alert("Click any arrow key to restart.");
		})
	}
}
document.addEventListener("keydown", handleSlide);


function filterZero(row) {
	return row.filter(num => num != 0);
}
function slide(row) {
	row = filterZero(row);
	for (let i=0; i<row.length-1; i++){
		if (row[i] == row[i+1]) {
			row[i] *= 2;
			row[i+1] = 0;

			// updates the score
			score += row[i];
		}
	}
	while(row.length < columns){
		row.push(0);
	}
	return row;
}


function slideLeft() {
	// A loop repeats a programmed task
	for (let r=0; r<rows; r++) {
		let row = board[r];

		// copy row, for animation
		let originalRow = row.slice();

		row = slide(row);
		board[r] = row;
		for (let c = 0; c<columns; c++) {
			let tile= document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if(originalRow[c]!==num && num!==0){
				// If the current tile is not equal to the the original tile, let's apply animation

				tile.style.animation = "slide-from-right 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)

			}
		}
	}
}
function slideRight()  {
	for (let r=0; r<rows; r++) {
		let row = board[r];

		// copy row, for animation
		let originalRow = row.slice();

		// the .reverse() method reverses the functionality of the slideLeft() - the code is originally from slideLeft().
		row.reverse();
		row = slide(row);
		row.reverse();

		board[r] = row;
		for (let c = 0; c<columns; c++) {
			let tile= document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if (originalRow[c]!==num && num!==0) {
				// If the current tile is not equal to the the original tile, let's apply animation

				tile.style.animation = "slide-from-left 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)

			}
		}
	}
}
function slideUp() {
	for (let c=0; c<columns; c++) {
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		
		// copy column, for animation
		let originalcol = col.slice();
		
		col = slide(col);

		// apply animation
		let changedIndeces = [];
		for (let r=0; r<rows; r++) {
			board[r][c] = col[r];
			if (originalcol !== col[r]) {
				changedIndeces.push(r);
			}
		}

		for (let r=0; r<rows; r++) {
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			// apply animation
			if (changedIndeces.includes(r) && num!==0) {
				// If the current tile is not equal to the the original tile, let's apply animation

				tile.style.animation = "slide-from-bottom 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)

			}
		}
	}
}
function slideDown () {
		for (let c=0; c<columns; c++) {
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		
		// copy column, for animation
		let originalcol = col.slice();

		// reverse() reverses the functionality of slideUp(), which will be used for the functionality of slideDown()
		col.reverse();
		col = slide(col);
		col.reverse();

		// apply animation
		let changedIndeces = [];
		for (let r=0; r<rows; r++) {
			board[r][c] = col[r];
			if (originalcol !== col[r]) {
				changedIndeces.push(r);
			}
		}

		for (let r=0; r<rows; r++) {
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			// apply animation
			if (changedIndeces.includes(r) && num!==0) {
				// If the current tile is not equal to the the original tile, let's apply animation

				tile.style.animation = "slide-from-top 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)

			}
		}
	}
}


function hasEmptyTile() {
	for (let r=0; r<rows; r++) {
		for (let c=0; c<columns; c++) {
			// when a tile is empty
			if (board[r][c] == 0) {
				return true;
			}
		}
	}
	// when a tile is not empty
	return false;
}
function setTwo() {
	if (hasEmptyTile() == false) {
		return;
	}

	// generate a new tile
	let found = false;
	while(!found){
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] == 0){
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}

	}
}


function checkWin() {
	for (let r=0; r<rows; r++) {
		for (let c=0; c<columns; c++) {
			if (board[r][c]>=2048 && !is2048Exist) {
				alert("You win! 2048");
				is2048Exist = true;
			}
			else if (board[r][c]>=4096 && !is4096Exist) {
				alert("You win! 4096");
				is4096Exist = true;
			}
			else if (board[r][c]>=8192 && !is8192Exist) {
				alert("You win! 8192");
				is8192Exist = true;
			}
		}
	}
}
function hasLost() {
	for (let r=0; r<rows; r++) {
		for (let c=0; c<columns; c++) {
			if (board[r][c] === 0 ) {
				return false;
			}

			const currentTile = board[r][c];

			if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
		}
	}
	return true;
}
function restartGame() {
	for (let r=0; r<rows; r++) {
		for (let c=0; c<columns; c++) {
			board[r][c] = 0;
			score = 0;
		}
	}

	setTwo();
}




// MOBILE FUNCTIONALITY


// captures the start of touch coordinates
document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
});
// calculate start to end touches information when touch input ends
document.addEventListener('touchend', (e) => {
	if (!e.target.className.includes("tile")) {
		return;
	}

	// difference of the start and end touch coordinates
	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	if (Math.abs(diffX) > Math.abs(diffY)) {
		if (diffX > 0) {
			slideLeft();
			setTwo();
		}
		else {
			slideRight();
			setTwo();
		}
	} else {
		if (diffY > 0) {
			slideUp();
			setTwo();
		}
		else {
			slideDown();
			setTwo();
		}
	}

	// update score
	document.getElementById('score').innerText = score;
	// Notify for game-won or game-lost
	checkWin();
	if (hasLost() == true) {
		setTimeout(() => {
			alert("Game Over!");
			restartGame();
			alert("Click any arrow key to restart.");
		})
	}
});
// runs when there is touch input movement ('touchend' and 'touchstart')
document.addEventListener('touchmove', (e) => {
	if (!e.target.className.includes("tile")) {
		return;
	}

	// prevents scrolling on moving-touch input
	e.preventDefault();
}, 
// necessary to make preventDefault work - { passive: false }
{ passive : false });


// conditions for moving tiles leftward
function canMoveLeft() {
	for (let r=0; r<rows; r++) {
		for (let c=1; c<columns; c++) {

			if (board[r][c] !== 0) {
				if (board[r][c-1]===0 || board[r][c-1]===board[r][c]) {
					return true;
				}
			}

		}
	}
	return false;
}
// conditions for moving tiles rightward
function canMoveRight() {
	for (let r=0; r<rows; r++) {
		for (let c=0; c<columns-1; c++) {

			if (board[r][c] !== 0) {
				if (board[r][c+1]===0 || board[r][c+1]===board[r][c]) {
					return true;
				}
			}

		}
	}
	return false;
}
// conditions for moving upward
function canMoveUp() {
	for (let c=0; c<columns; c++) {
		for (let r=1; r<rows; r++) {
			if (board[r][c] !== 0) {
				if (board[r-1][c]===0 || board[r-1][c]===board[r][c]) {
					return true;
				}
			}
		}
	}
	return false;
}
// conditions for moving downward
function canMoveDown() {
	for (let c=0; c<columns; c++) {
		for (let r=0; r<rows-1; r++) {

			if (board[r][c] !== 0) {
				if (board[r+1][c]===0 || board[r+1][c]===board[r][c]) {
					return true;
				}
			}

		}
	}
	return false;
}