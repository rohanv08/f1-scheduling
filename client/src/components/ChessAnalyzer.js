import React, { useState } from "react";
import { Position } from "kokopu";

/*
* This component is used to maintain a chess board state
* and a display that may temporarily differ from the actual state,
* for example, when the user is exploring potential moves
*
* chessboard: (position, move, playMove) => component that displays the chess board
* children: (analyzer, board) => component that displays the analysis, including
*   the board and the analysis
*/
const ChessAnalyzer = props => {
    const { chessboard, children, defaultMovesList } = props;

    const startPos = new Position('start');
    const startMovesList = [];
    if (defaultMovesList) {
        let skip = false;
        defaultMovesList.forEach((move, i) => {
            if (!skip) {
                if (i % 2 === 0) {
                    startMovesList.push({ whitePosition: new Position(startPos), white: move });
                } else {
                    startMovesList[startMovesList.length - 1].black = move;
                    startMovesList[startMovesList.length - 1].blackPosition = new Position(startPos);
                }
            }
            try {
                if (!startPos.play(move)) {
                    skip = true;
                }
            } catch (e) {
                skip = true;
            }
        });
    }

    const [currPosition, setCurrPosition] = useState(new Position(startPos));
    const [movesList, setMovesList] = useState(startMovesList);

    const [display, setDisplay] = useState({ position: currPosition, move: null });

    const updateDisplay = (move, position) => {
        if (!position) {
            position = currPosition;
        }
        try {
            position.notation(move);
            setDisplay({position, move});
        } catch (error) {
            setDisplay({position: currPosition, move: null});
        }
    }

    const clearDisplay = () => {
        setDisplay({position: currPosition, move: null});
    }

    const playMove = move => {
        try {
            const turn = currPosition.turn();
            const oldPosition = new Position(currPosition);
            if (!currPosition.play(move)) {
                return;
            }

            if (turn === 'w') {
                setMovesList(movesList.concat({white: move, whitePosition: oldPosition, black: '', blackPosition: null}));
            } else {
                const lastMove = movesList[movesList.length - 1];
                const newMovesList = movesList.slice(0, movesList.length - 1).concat({...lastMove, black: move, blackPosition: oldPosition});
                setMovesList(newMovesList);
            }
            setCurrPosition(new Position(currPosition));
            clearDisplay();
        } catch (error) {
            console.log(error);
        }
    }

    const switchToMove = (index, isWhite, noUpdate) => {
        try {
            if (isWhite) {
                const move = movesList[index];
                if (!move.white) {
                    return;
                }
                const position = new Position(move.whitePosition);

                position.play(move.white);
                const newPosition = new Position(position);

                setCurrPosition(newPosition);
                if (!noUpdate) {
                    setDisplay({ position: newPosition, move: null });
                    setMovesList(movesList.splice(0, index + 1).map((m, i) => {
                        if (i === index) {
                            return {...m, black: '', blackPosition: null};
                        } else {
                            return m;
                        }
                    }));
                }
            } else {
                const move = movesList[index];
                if (!move.black) {
                    return;
                }
                const position = new Position(move.blackPosition);

                position.play(move.black);
                const newPosition = new Position(position);

                setCurrPosition(newPosition);
                if (!noUpdate) {
                    setDisplay({ position: newPosition, move: null });
                    setMovesList(movesList.splice(0, index + 1));
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const reset = () => {
        const position = new Position('start');
        setCurrPosition(position);
        setMovesList([]);
        setDisplay({ position: position, move: null });
    }

    const analyzer = {
        currPosition,
        movesList,
        display,
        setCurrPosition,
        setMovesList,
        playMove,
        switchToMove,
        reset,
        updateDisplay,
        clearDisplay,
    }

    const positionedBoard = chessboard(display.position, display.move, playMove);

    return children(analyzer, positionedBoard);
};

export default ChessAnalyzer;