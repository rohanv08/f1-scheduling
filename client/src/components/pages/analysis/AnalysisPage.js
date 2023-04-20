import React from 'react';
import ChessAnalyzer from '../../ChessAnalyzer';
import ResponsiveChessboard from '../../ResponsiveChessboard';
import MoveView from '../../MoveView';
import BestMovesView from '../../BestMovesView';

const AnalysisPage = props => {
    return (
        <ChessAnalyzer
            chessboard={(position, move, playMove) => (
                    <ResponsiveChessboard
                        interactionMode={'playMoves'}
                        position={position}
                        move={move}
                        moveArrowVisible={true}
                        onMovePlayed={playMove}
                    />
            )}
        >
            {(analyzer, board) =>
                <div className="container d-flex" style={{height: "85%"}}>
                    <div className="row mx-auto flex-fill">
                        <div className="col-sm-12 col-md-8 h-100 text-center">
                            {board}
                        </div>
                        <div className="col-md-4 h-100 d-none d-md-block px-0">
                            <div className="h-25 mb-3">
                                <MoveView reset={analyzer.reset} switchToMove={(index, isWhite) => analyzer.switchToMove(index, isWhite, false)} displayMove={analyzer.updateDisplay} clearDisplayedMove={analyzer.clearDisplay} movesList={analyzer.movesList} />
                            </div>
                            <div className="h-75">
                                <BestMovesView currPosition={analyzer.currPosition} playMove={analyzer.playMove} displayMove={analyzer.updateDisplay} clearDisplayedMove={analyzer.clearDisplay} />
                            </div>
                        </div>
                    </div>
                </div>
            }
                
        </ChessAnalyzer>
    )

};

export default AnalysisPage;