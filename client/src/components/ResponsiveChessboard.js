import React from "react";
import { Chessboard } from "kokopu-react";

const ResponsiveChessboard = props => {
    const limits = props.limits ? props.limits : [
        { width: 576, squareSize: 36 },
        { width: 768, squareSize: 48 },
        { width: 992, squareSize: 48 },
        { width: 1200, squareSize: 56 },
        { width: 1400, squareSize: 64 },
    ];

    return (
        <Chessboard
            {...props}
            squareSize={props.maxSize ? props.maxSize : 72}
            smallScreenLimits={limits}
            onPiecePlayed={() => undefined}
        />
    );
};

export default ResponsiveChessboard;