import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  let winningSquares = [];
  if (winner) {
    status = 'Winner: ' + squares[winner[0]];
    winningSquares = winner;
  } else if (squares.every((square) => square !== null)) {
    status = 'It\'s a draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function renderSquare(i) {
    const isWinningSquare = winningSquares && winningSquares.includes(i);
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        className={isWinningSquare ? 'winning-square' : 'square'}
      />
    );
  }

  // Create the rows and columns using loops
  const rows = [];
  for (let row = 0; row < 3; row++) {
    const cols = [];
    for (let col = 0; col < 3; col++) {
      cols.push(renderSquare(row * 3 + col));
    }
    rows.push(<div key={row} className="board-row">{cols}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);


  function handleSortToggle() {
    setIsAscending((prevIsAscending) => !prevIsAscending);

    if (isAscending) {
      // If we are switching from ascending to descending,
      // we need to update the currentMove to reflect the correct move index.
      setCurrentMove(history.length - 1 - currentMove);
    } else {
      // If we are switching from descending to ascending,
      // we need to update the currentMove to the maximum available move.
      setCurrentMove(history.length - 1);
    }
  }


  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = isAscending
    ? history.map((squares, move) => {
      const step = move === 0 ? "game start" : `step ${move}`;
      return (
        <li key={move}>
          {move === currentMove && move > 0 ? (
            <span>You are at {step}</span>
          ) : (
            <button onClick={() => jumpTo(move)}>Go to {step}</button>
          )}
        </li>
      );
    })
    : history.slice().reverse().map((squares, move) => {
      const step = move === history.length - 1 ? "game start" : `step ${history.length - 1 - move}`;
      return (
        <li key={move}>
          {move === currentMove && move < history.length - 1 ? (
            <span>You are at {step}</span>
          ) : (
            <button onClick={() => jumpTo(history.length - 1 - move)}>Go to {step}</button>
          )}
        </li>
      );
    });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <button onClick={handleSortToggle}>
            {isAscending ? "Sort Descending" : "Sort Ascending"}
          </button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // Return the winning squares instead of the winning value
      return [a, b, c];
    }
  }
  return null;
}