import React, { useState, useEffect } from 'react';
import { getMovesTop } from '../../../matchFetcher';

const TopMovesView = ({ currPosition, playMove, displayMove, clearDisplayedMove }) => {
    const [moves, setMoves] = useState([]);

    useEffect(() => {
        getMovesTop(currPosition).then(nextMoves => {
            if (nextMoves) {
                setMoves(nextMoves);
            } else {
                setMoves([]);
            }
        });
    }, [currPosition]);

    return (
        <div className="container-fluid mx-auto d-flex flex-column h-100 p-0">
            <div className="overflow-auto border flex-fill">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <td>Move</td>
                            <td>Games</td>
                            <td>White / Draw / Black</td>
                        </tr>
                    </thead>
                    <tbody>
                        {moves.map((move, index) => (
                            <tr key={index}
                                onClick={() => playMove(move.code)}
                                onMouseEnter={() => displayMove(move.code)}
                                onMouseLeave={clearDisplayedMove}
                            >
                                <td>
                                    <em>{move.code}</em>
                                </td>
                                <td>
                                    {move.games}
                                </td>
                                <td className="align-middle">
                                        <WhiteDrawBlackRatio white={move.whiteWin} draw={move.draw} black={move.blackWin}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}