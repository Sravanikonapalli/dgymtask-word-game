import '../styles/GameBoard.css';
function GameBoard({ rows }) {
    return (
      <div className="game-board">
        {rows.map((row, rowIndex) => (
          <div key={`row_${rowIndex}`} className="row">
            {row.map((cell, colIndex) => (
              <button
                key={`cell_${rowIndex}_${colIndex}`}
                className={`cell ${cell.state.buttonClassName}`}
                disabled
              >
                <strong>{cell.letter || '_'}</strong>
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  }
  
  export default GameBoard;
  