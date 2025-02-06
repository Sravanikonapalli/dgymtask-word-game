import { useState, useEffect } from "react";
import { useWordleGame } from "../gamelogic/GameStateManager"; 
import { getRandomWord } from "../gamelogic/WordRepository"; 
import GameBoard from "./GameBoard";
import Keyboard from "./Keyboard";
import '../styles/WordleMainComponent.css'
import { TfiFaceSad } from "react-icons/tfi";
import { CiDark } from "react-icons/ci";

function WordleMainComponent({ toggleDarkMode }) {
  const { gameState, letterPressed, enterPressed, backspacePressed, setGameState } = useWordleGame();  
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [gameMessage, setGameMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);  

  const reset = () => {
    setGameState({
      chosenWord: getRandomWord(), 
      rows: Array(6).fill(Array(5).fill({
        letter: null,
        state: {
          value: 0,
          buttonClassName: 'btn-primary',
          keyboardClassName: 'btn-light'
        }
      })), 
      letters: Array(26).fill({
        value: 0,
        buttonClassName: 'btn-primary',
        keyboardClassName: 'btn-light'
      }), 
      currentRow: 0, 
      currentCol: 0, 
      gameOver: false, 
    });
    setRemainingAttempts(6);
    setGameMessage("");
  };

  const letterCallback = (letter) => {
    letterPressed(letter);  
  };

  const enterCallback = () => {
    const currentRow = gameState.rows[gameState.currentRow];
  
    if (remainingAttempts > 0 && currentRow.length === 5) {
      enterPressed();  
      setRemainingAttempts(prevAttempts => prevAttempts - 1);
  
      const guessedWord = currentRow.map(letterObj => {
        return letterObj.letter; 
      }).join("");
  
      if (guessedWord === gameState.chosenWord) {
        setGameMessage("Yuhuh! You won the game!");
        window.alert("Congrats! You won the game. Want to play again? Click RESET.");
      }
    }
  };
  
  const backspaceCallback = () => {
    backspacePressed();  
  };

  useEffect(() => {
    if (remainingAttempts === 0 && gameMessage === "") {
      setGameMessage(
        <span>
          You lost! <TfiFaceSad size={23}/> The correct word was: {gameState.chosenWord}{" "}
        </span>
      );
    }
  }, [remainingAttempts, gameState.chosenWord, gameMessage]);

  const toggleHelp = () => setShowHelp(!showHelp);

  return (
    <>
      <div className="header">
        <h1>W O R D L E</h1>
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          <CiDark size={30}/>
        </button>
      </div>
      <p>Find the 5 letter word in 6 attempts.</p>
      <p>
        {remainingAttempts > 0 ? `You have ${remainingAttempts} attempts left` : "No more attempts left"}
      </p>

      <div className="buttons">
        <button className="button help-btn" onClick={toggleHelp}>HELP</button>
        <button className="button new-game-btn" onClick={reset}>NEW GAME</button>
        <button className="btn btn-warning button" onClick={reset}>RESET</button>
      </div>
      <br />
      <GameBoard rows={gameState.rows} />
      <br />

      {gameMessage && (
        <div className="text-center text-light">
          <h4 style={{ color: typeof gameMessage === 'string' && gameMessage.includes("won") ? "green" : "red" }}>
            {gameMessage}
          </h4>
        </div>
      )}

      <Keyboard
        gameOver={gameState.gameOver} letters={gameState.letters}
        letterCallback={letterCallback} enterCallback={enterCallback} backspaceCallback={backspaceCallback}
      />

      {showHelp && (
        <div className="modal show popup" style={{ display: "block", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog" style={{ maxWidth: "500px", margin: "auto", marginTop: "100px" }}>
            <div className="modal-content" style={{ backgroundColor: "white" }}>
                <h5 className="modal-title">How to Play Wordle</h5>
                <hr/>
              <div className="modal-body">
                <h3>Rules:</h3>
                <ul>
                  <li>Guess the 5-letter word in 6 attempts.</li>
                  <li>After each guess, the letters will change color based on correctness:</li>
                  <ul>
                    <li><strong>Green</strong> indicates the letter is in the correct position.</li>
                    <li><strong>Yellow</strong> indicates the letter is in the word, but in the wrong position.</li>
                    <li><strong>Gray</strong> indicates the letter is not in the word at all.</li>
                  </ul>
                  <li>Use the virtual keyboard to make guesses.</li>
                  <li>If you guess the word correctly, you win! If you use all attempts, you lose.</li>
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary close-btn" onClick={toggleHelp}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WordleMainComponent;
