import { useEffect, useRef, useState } from 'react'
import './App.css'
import Popup from './components/Popup';

function App() {

	const [board, setBoard] = useState([
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0]
	]);

	const [selectedCell, setSelectedCell] = useState(null);
	const [blankCellIndices, setBlankCellIndices] = useState([]);
	const [seconds, setSeconds] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [theme, setTheme] = useState("light");
	const [stopGame, setStopGame] = useState(false);

	const generateSudokuGrid = () => {
		let grid = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0]
		];
		if (fillGrid(grid)) {
			return grid;
		} else {
			// If the grid couldn't be filled, return null (unsolvable Sudoku)
			return null;
		}
	}

	const fillGrid = (grid) => {
		// Loop through each cell
		let n = [1, 2, 3, 4, 5, 6, 7, 8, 9]
		shuffle(n);
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				// If cell is empty
				if (grid[row][col] === 0) {
					// Try placing numbers 1-9
					shuffle(n);
					for (let num = 0; num < n.length; num++) {
						// Check if the number is valid in this cell
						if (isValid(grid, row, col, n[num])) {
							// Place the number
							grid[row][col] = n[num];

							// Recursively fill the rest of the grid
							if (fillGrid(grid)) {
								return true;
							}

							// If recursion fails, backtrack
							grid[row][col] = 0;
						}
					}

					// If no number works, return false
					return false;
				}
			}
		}
		// Grid filled successfully
		return true;
	}

	// Function to shuffle an array (Fisher-Yates shuffle)
	function shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	}

	const isValid = (grid, row, col, num) => {
		// Check if the number is not already in the row or column
		for (let i = 0; i < 9; i++) {
			if (grid[row][i] === num || grid[i][col] === num) {
				return false;
			}
		}
		// Check if the number is not already in the 3x3 subgrid
		for (let i = row - row % 3; i < (row - row % 3) + 3; i++) {
			for (let j = col - col % 3; j < (col - col % 3) + 3; j++) {
				if (grid[i][j] === num)
					return false;
			}
		}
		return true;
	}

	const wasBlankCell = (i, j) => {
		if (blankCellIndices.find((r) => r.row === i && r.col === j)) {
			return true;
		}
		else {
			return false;
		}
	}

	const changeValue = (value) => {
		if (selectedCell && wasBlankCell(selectedCell.i, selectedCell.j)) {
			if (value === "") {
				let temp = board.map((r, i) => {
					return r.map((s, j) => {
						return i === selectedCell.i && j === selectedCell.j ? value : s
					})
				})
				setBoard(temp);
			}
			else if (isValid(board, selectedCell.i, selectedCell.j, value)) {
				console.log(typeof value)
				let temp = board.map((r, i) => {
					return r.map((s, j) => {
						return i === selectedCell.i && j === selectedCell.j ? value : s
					})
				})
				setBoard(temp);
			}
		}
	}

	useEffect(() => {
		// setting theme
		if (!localStorage.getItem("theme"))
			localStorage.setItem("theme", "light");
		setTheme(localStorage.getItem("theme"));
		document.body.setAttribute("data-theme", localStorage.getItem("theme"))


		// generating sudoku grid
		localStorage.setItem("grid", JSON.stringify(generateSudokuGrid()));
		let tempBoard = JSON.parse(localStorage.getItem("grid"));
		let tempBlankCellIndices = [];
		let numberOfRandomBlankCells = Math.floor(Math.random() * 70);
		for (let i = 1; i <= numberOfRandomBlankCells; i++) {
			let row = Math.floor(Math.random() * (tempBoard.length));
			let col = Math.floor(Math.random() * (tempBoard[0].length));
			tempBoard[row][col] = "";
			tempBlankCellIndices.push({ row, col });
		}
		setBoard(tempBoard);
		setBlankCellIndices(tempBlankCellIndices);

	}, [])

	useEffect(() => {
		if (!stopGame) {
			let interval = setInterval(() => {
				// setSeconds(seconds + 1);
				if (seconds + 1 === 60) {
					setSeconds(0);
					setMinutes(minutes + 1);
				}
				else {
					setSeconds(seconds + 1);
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [seconds, minutes])

	useEffect(() => {
		let flag = true;
		const answer = JSON.parse(localStorage.getItem("grid"));
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (board[i][j] !== answer[i][j]) {
					flag = false;
					break;
				}
			}
			if (flag === false)
				break
		}
		if (flag === true) {
			console.log("finished in : ", minutes, seconds);
			setStopGame(true);
		}
	}, [board])

	const toggleTheme = () => {
		if (theme === "light") {
			document.body.setAttribute("data-theme", "dark");
			localStorage.setItem("theme", "dark");
			setTheme("dark");
		}
		else {
			document.body.setAttribute("data-theme", "light");
			localStorage.setItem("theme", "light");
			setTheme("light");
		}
	}

	const handleKeyDown = (event) => {
		let keyPressed = event.key;
		console.log(keyPressed);
		if (parseInt(keyPressed)) {
			changeValue(parseInt(keyPressed));
		}
		else if (keyPressed === "Backspace") {
			changeValue("");
		}
	}

	return (
		<>
			<Popup open={stopGame} setOpen={setStopGame} minutes={minutes} seconds={seconds} />
			<div className='container'>
				<h2>Sudoku</h2>
				<button className='toggle-theme' onClick={() => toggleTheme()}>{theme === "light" ? "Dark" : "Light"}</button>
				<p>Time: {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>

				<div className="sudoku-container">
					<div className="sudoku-grid" tabIndex={0} onKeyDown={handleKeyDown}>
						{board.map((r, i) => {
							return r.map((s, j) => {
								return (
									<div id={`cell${i}${j}`} key={`${i}${j}`} onClick={() => setSelectedCell({ i, j })} style={wasBlankCell(selectedCell?.i, selectedCell?.j) && selectedCell?.i === i && selectedCell?.j === j ? { background: "yellow", color: "black" } : !wasBlankCell(i, j) ? { background: "var(--disabled-bg-color)" } : null}>{s}</div>
								)
							})
						})}
					</div>

					<div className='numberpad'>
						<div onClick={() => changeValue(1)}>1</div>
						<div onClick={() => changeValue(2)}>2</div>
						<div onClick={() => changeValue(3)}>3</div>
						<div onClick={() => changeValue(4)}>4</div>
						<div onClick={() => changeValue(5)}>5</div>
						<div onClick={() => changeValue(6)}>6</div>
						<div onClick={() => changeValue(7)}>7</div>
						<div onClick={() => changeValue(8)}>8</div>
						<div onClick={() => changeValue(9)}>9</div>
						<div onClick={() => changeValue("")}>X</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default App
