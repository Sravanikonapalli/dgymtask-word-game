import { useState } from "react";
import { getRandomWord } from "./WordRepository";

const NUM_ROWS = 6;
const NUM_COLS = 5;

const CELL_STATE = {
    default: {
        value: 0,
        buttonClassName: 'btn-primary',
        keyboardClassName: 'btn-light'
    },
    incorrectLetter: {
        value: 1,
        buttonClassName: 'btn-secondary',
        keyboardClassName: 'btn-secondary',
    },
    correctLetter: {
        value: 2,
        buttonClassName: 'btn-warning',
        keyboardClassName: 'btn-warning',
    },
    correctPos: {
        value: 3,
        buttonClassName: 'btn-success',
        keyboardClassName: 'btn-success',
    }
};

// Initial Cell State Function
function initialCellState() {
    return {
        letter: null,
        state: CELL_STATE.default
    };
}

// Custom Hook for Game State
export function useWordleGame() {
    const [gameState, setGameState] = useState({
        chosenWord: getRandomWord(),
        rows: Array(NUM_ROWS).fill(Array(NUM_COLS).fill(initialCellState())),
        letters: Array(26).fill(CELL_STATE.default),
        currentRow: 0,
        currentCol: 0,
        gameOver: false,
    });

    // Letter Pressed Logic
    const letterPressed = (letter) => {
        if (gameState.gameOver || gameState.currentCol === NUM_COLS) return;

        const newRows = JSON.parse(JSON.stringify(gameState.rows));
        newRows[gameState.currentRow][gameState.currentCol] = {
            ...newRows[gameState.currentRow][gameState.currentCol],
            letter: letter
        };

        setGameState({
            ...gameState,
            rows: newRows,
            currentCol: gameState.currentCol + 1
        });
    };

    // Enter Pressed Logic
    const enterPressed = () => {
        if (gameState.gameOver || gameState.currentCol !== NUM_COLS) return;

        const newRows = JSON.parse(JSON.stringify(gameState.rows));
        const newLetters = JSON.parse(JSON.stringify(gameState.letters));

        let allCorrect = true;
        const currRowArr = newRows[gameState.currentRow];

        for (let i = 0; i < NUM_COLS; i++) {
            if (gameState.chosenWord.charAt(i) === currRowArr[i].letter) {
                currRowArr[i].state = CELL_STATE.correctPos;
            } else if (gameState.chosenWord.indexOf(currRowArr[i].letter) !== -1) {
                currRowArr[i].state = CELL_STATE.correctLetter;
                allCorrect = false;
            } else {
                currRowArr[i].state = CELL_STATE.incorrectLetter;
                allCorrect = false;
            }

            if (currRowArr[i].state.value > newLetters[getIndexOfLetter(currRowArr[i].letter)].value) {
                newLetters[getIndexOfLetter(currRowArr[i].letter)] = currRowArr[i].state;
            }
        }

        setGameState({
            ...gameState,
            rows: newRows,
            letters: newLetters,
            currentRow: gameState.currentRow + 1,
            currentCol: 0,
            gameOver: allCorrect || gameState.currentRow === NUM_ROWS - 1,
        });
    };

    // Backspace Pressed Logic
    const backspacePressed = () => {
        if (gameState.gameOver || gameState.currentCol === 0) return;

        const newRows = JSON.parse(JSON.stringify(gameState.rows));
        newRows[gameState.currentRow][gameState.currentCol - 1] = initialCellState();

        setGameState({
            ...gameState,
            rows: newRows,
            currentCol: gameState.currentCol - 1
        });
    };

    return {
        gameState,
        setGameState, 
        letterPressed,
        enterPressed,
        backspacePressed
    };
}

// Utility function to get the index of a letter
export function getIndexOfLetter(letter) {
    return letter.charCodeAt(0) - 'A'.charCodeAt(0);
}
