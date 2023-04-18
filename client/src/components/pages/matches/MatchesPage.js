import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResponsiveChessboard from "../../ResponsiveChessboard";
import ChessAnalyzerLocked from "../../ChessAnalyzerLocked";
import MoveView from "../../MoveView";
import { getMatchById } from '../../../matchFetcher';
import {format} from 'date-fns';

const MatchesPage = (props) => {
    const [movesList, setMovesList] = useState([]);
    const [match, setMatch] = useState({ w_name: '', b_name: '', date: '', w_rating: 0, b_rating: 0, result: 0 });

    useEffect(() => {
        getMatchById(props.params.id).then(match => {
            setMovesList(match.moves);
            setMatch(match);
        });
    }, []);

    const limits = [
        { width: 576, squareSize: 48 },
        { width: 768, squareSize: 56 },
        { width: 992, squareSize: 56 },
        { width: 1200, squareSize: 64 },
        { width: 1400, squareSize: 72 },
    ];

    return (
        <ChessAnalyzerLocked
            fixedMovesList={movesList}
            chessboard={(position, move, playMove) => (
                    <ResponsiveChessboard
                        limits={limits}
                        interactionMode={undefined}
                        maxSize={84}
                        position={position}
                        move={move}
                        moveArrowVisible={true}
                        onMovePlayed={() => {}}
                    />
            )}
        >
            {(analyzer, board) =>
                <div className="container pt-3 d-flex" style={{height: '85%'}}>
                    <div className="row">
                        <div className="col-md-6 d-none d-md-block h-100">
                            <div className="container border text-center mb-3 p-1">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>{match.w_name}</th>
                                            <th>{match.b_name}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Rating</th>
                                            <td>{match.w_rating}</td>
                                            <td>{match.b_rating}</td>
                                        </tr>
                                        <tr onClick={() => props.nav(`/tournaments/${match.event_id}/${match.site_id}`)}>
                                            <th scope="row">Tournament</th>
                                            <td colSpan="2">{match.event}, {match.site}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Round</th>
                                            <td colSpan="2">{match.round}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Date</th>
                                            <td colSpan="2">{match.date ? format(new Date(match.date), 'PP') : undefined}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Result</th>
                                            <td colSpan="2">{match.result === 1 ? "1-0" : match.result === 2 ? "0-1" : "½-½"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="h-50">
                                <MoveView reset={null} switchToMove={analyzer.switchToMove} displayMove={analyzer.updateDisplay} clearDisplayedMove={analyzer.clearDisplay} movesList={movesList} />
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            {board}
                        </div>
                    </div>
                </div>
            }

        </ChessAnalyzerLocked>
    )
};

export default function() {
    const params = useParams();
    const nav = useNavigate();
    return <MatchesPage params={params} nav={nav} />;
}
