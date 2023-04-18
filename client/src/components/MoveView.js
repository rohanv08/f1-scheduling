import React from "react";

const MoveView = props => {
    const { reset, switchToMove, displayMove, clearDisplayedMove, movesList } = props;

    return (
        <div className="container-fluid mx-auto d-flex flex-column h-100 p-0">
            <div className="overflow-auto border flex-fill">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>White</td>
                            <td>Black</td>
                        </tr>
                    </thead>
                    <tbody>
                        {movesList.map((move, index) => (
                            <tr key={index}>
                                <td className="rowHead">
                                    {index + 1}
                                </td>
                                <td className="hoverable"
                                    onClick={() => switchToMove(index, true)}
                                    onMouseEnter={() => displayMove(move.white, move.whitePosition)}
                                    onMouseLeave={clearDisplayedMove}
                                >
                                    <em>{move.white}</em>
                                </td>
                                <td className="hoverable"
                                    onClick={() => switchToMove(index, false)}
                                    onMouseEnter={() => displayMove(move.black, move.blackPosition)}
                                    onMouseLeave={clearDisplayedMove}
                                >
                                    <em>{move.black}</em>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {reset && <button className="btn btn-sm btn-outline-danger w-100 mt-auto" onClick={reset}>Reset</button>}
        </div>
    )
};

export default MoveView;