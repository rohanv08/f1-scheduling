import React, { useState, useEffect } from "react";

import AnalysisFilters from "./pages/analysis/AnalysisFilters";
import WhiteDrawBlackRatio from "./WhiteDrawBlackRatio";

import {getMovesNext, getMovesTop} from "../matchFetcher";
import {format} from "date-fns";
import * as Bs from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const BestMovesView = props => {
    const { currPosition, playMove, displayMove, clearDisplayedMove } = props;

    const [filtersVisible, setFiltersVisible] = useState(true);
    const [filterState, setFilterState] = useState({whiteRatingRange: [30, 3000], blackRatingRange: [30, 3000], dateRange: ['2006-01-01', '2008-01-01']});
    const nav = useNavigate();
    const [mode, setMode] = useState(false);
    const [moves, setMoves] = useState([]);
    const [games, setGames] = useState([]);

    useEffect(() => {
        getMovesNext({ currPosition, ...filterState }).then(nextMoves => {
            if (nextMoves) {
                setMoves(nextMoves);
            } else {
                setMoves([]);
            }
        });
    }, [currPosition, filterState]);

    useEffect(() => {
        getMovesTop({ currPosition, ...filterState }).then(topGames => {
            if (topGames) {
                setGames(topGames);
            } else {
                setGames([]);
            }
        });
    }, [currPosition, filterState]);

    return (
        <div className="container-fluid mx-auto d-flex flex-column h-100 p-0">
            <div className="btn-group" role="group">
                <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off"
                       checked={!mode} onClick={() => setMode(false)}/>
                <label className="btn btn-outline-primary" htmlFor="btnradio1">Next Moves</label>

                <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off"
                       checked={mode} onClick={() => setMode(true)}/>
                <label className="btn btn-outline-primary" htmlFor="btnradio2">Top Games</label>
            </div>
            <div className="overflow-auto border flex-fill">
                <table className="table table-sm table-hover" style={mode ? {display: 'none'} : {}}>
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
                <Bs.Table hover striped style={mode ? {} : {display: 'none'}}>
                    <thead>
                    <tr>
                        <td>White</td>
                        <td>Black</td>
                        <td>Result</td>
                        <td>Date</td>
                    </tr>
                    </thead>
                    <tbody>
                    {games.map((match, index) => {
                        return (
                            <tr key={index} onClick={() => nav(`/matches/${match.id}`)}>
                                <td>{match.result === 1 ? <b>{match.w_name}</b>
                                    : match.w_name} <i>({match.w_rating})</i>
                                </td>
                                <td>{match.result === 2 ? <b>{match.b_name}</b>
                                    : match.b_name} <i>({match.b_rating})</i>
                                </td>
                                <td>{[null, '1-0', '0-1', '½-½'][match.result]}</td>
                                <td>{format(new Date(match.date), 'PP')}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Bs.Table>
            </div>
            <div
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={() => setFiltersVisible(!filtersVisible)}
            >Filters {filtersVisible ? '-' : '+'}</div>
            {filtersVisible && (
                <AnalysisFilters filterState={filterState} setFilterState={setFilterState} />
            )}
        </div>
    )
};

export default BestMovesView;
