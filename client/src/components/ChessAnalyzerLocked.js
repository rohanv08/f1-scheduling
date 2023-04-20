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
const ChessAnalyzerLocked = props => {
    const { chessboard, children, fixedMovesList } = props;

    const [currPosition, setCurrPosition] = useState(new Position('start'));

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

    const switchToMove = (index, isWhite) => {
        try {
            if (isWhite) {
                const move = fixedMovesList[index];
                if (!move.white) {
                    return;
                }
                const position = new Position(move.whitePosition);

                position.play(move.white);
                const newPosition = new Position(position);

                setCurrPosition(newPosition);
                setDisplay({ position: newPosition, move: null });
            } else {
                const move = fixedMovesList[index];
                if (!move.black) {
                    return;
                }
                const position = new Position(move.blackPosition);

                position.play(move.black);
                const newPosition = new Position(position);

                setCurrPosition(newPosition);
                setDisplay({ position: newPosition, move: null });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const analyzer = {
        currPosition,
        display,
        setCurrPosition,
        switchToMove,
        updateDisplay,
        clearDisplay,
    }

    const positionedBoard = chessboard(display.position, display.move, () => {});

    return children(analyzer, positionedBoard);
};

export default ChessAnalyzerLocked;