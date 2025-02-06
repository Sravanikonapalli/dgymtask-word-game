import { useEffect } from "react";
import '../styles/Keyboard.css'
function Keyboard({ gameOver, letters, letterCallback, enterCallback, backspaceCallback }) {
    const keyArrangement = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];
    useEffect(() => {
        const handleKeydown = (event) => {
          if (gameOver) return;
    
          const key = event.key.toUpperCase();
    
          if (key === "ENTER") {
            enterCallback();
          } else if (key === "BACKSPACE") {
            backspaceCallback();
          } else if (key.match(/[A-Z]/)) {
            letterCallback(key);
          }
        };
    
        window.addEventListener("keydown", handleKeydown);
    
        return () => {
          window.removeEventListener("keydown", handleKeydown);
        };
      }, [letterCallback, enterCallback, backspaceCallback, gameOver]);
      const getLetterState = (letter) => {
      const letterObj = letters.find(l => l.letter === letter);
      return letterObj ? letterObj.keyboardClassName : '';
    };
  
    return (
      <div className="keyboard">
        {keyArrangement.map((row, rowIndex) => (
          <div key={`row_${rowIndex}`} className="row">
            {row.map((letter, colIndex) => (
              <button
                key={`cell_${rowIndex}_${colIndex}`}
                className={`key ${getLetterState(letter)}`}
                onClick={() => letterCallback(letter)}
                disabled={gameOver}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
        <div className="row">
          <button className="key action-btn" onClick={enterCallback} disabled={gameOver}>ENTER</button>
          <button className="key action-btn" onClick={backspaceCallback} disabled={gameOver}>BACKSPACE</button>
        </div>
      </div>
    );
  }
  
  export default Keyboard;
  


