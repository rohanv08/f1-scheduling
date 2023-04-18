import config from './config.json'
import { Position } from 'kokopu';
require("babel-polyfill");

const getMovesNext = async ({ currPosition, whiteRatingRange, blackRatingRange, dateRange }) => {
    const position = currPosition.fen().split(' ')[0];
    const turn = currPosition.turn();
    const [wMin, wMax] = whiteRatingRange;
    const [bMin, bMax] = blackRatingRange;
    const [dMin, dMax] = dateRange;

    const res = await fetch(`http://${config.server_host}:${config.server_port}/moves/next?position=${position}&turn=${turn}&w_min=${wMin}&w_max=${wMax}&b_min=${bMin}&b_max=${bMax}&after=${dMin}&before=${dMax}`, {
        method: 'GET',
    })
    if (res.status !== 200) {
        return null
    }

    return (await res.json())
        // sort by number of wins
        .sort((a, b) => turn === 'w' ? b.white - a.white : b.black - a.black)
        // collect at most numResults legal moves
        .reduce((acc, move) => {
            if (new Position(currPosition).play(move.move)) {
                return acc.concat(move);
            } else {
                return acc;
            }
        }, [])
        // map to frontend schema
        .map(({move, white, black, draw}) => {
        const sum = Number(white) + Number(black) + Number(draw);
        return {
            code: move,
            games: sum,
            whiteWin: Math.round(100 * white / sum),
            blackWin: Math.round(100 * black / sum),
            draw: Math.round(100 * draw / sum),
        }
    })
}

const getMovesTop = async ({ currPosition, whiteRatingRange, blackRatingRange, dateRange }) => {
    const position = currPosition.fen().split(' ')[0];
    const turn = currPosition.turn();
    const [wMin, wMax] = whiteRatingRange;
    const [bMin, bMax] = blackRatingRange;
    const [dMin, dMax] = dateRange;

    const res = await fetch(`http://${config.server_host}:${config.server_port}/moves/top?position=${position}&turn=${turn}&w_min=${wMin}&w_max=${wMax}&b_min=${bMin}&b_max=${bMax}&after=${dMin}&before=${dMax}`, {
        method: 'GET',
    })
    if (res.status !== 200) {
        return null
    }

    return await res.json();
}

const getMatches = async ({ resultPos, resultNum, whiteName, blackName, whiteRatingRange, blackRatingRange, dateRange }) => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/matches?result_pos=${resultPos}&result_size=${resultNum}&w_name=${whiteName}&b_name=${blackName}&w_min=${whiteRatingRange[0]}&w_max=${whiteRatingRange[1]}&b_min=${blackRatingRange[0]}&b_max=${blackRatingRange[1]}&after=${dateRange[0]}&before=${dateRange[1]}`, {
        method: 'GET',
    })

    if (res.status !== 200) {
        return null
    }

    return (await res.json())
        // map to frontend schema
        .map(({id, date, moves, w_name, b_name, w_rating, b_rating, result}) => {
            return {
                id,
                date,
                moves,
                whiteName: w_name,
                blackName: b_name,
                whiteRating: w_rating,
                blackRating: b_rating,
                result
            }
         });
}

const getMatchById = async (id) => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/matches/${id}`, {
        method: 'GET',
    });

    if (res.status !== 200) {
        return null;
    }

    const match = await res.json();

    const formattedMoves = [];

    const position = new Position('start')
    match.moves.forEach((code, i) => {
        if (i % 2 === 0) {
            formattedMoves.push({ white: code, whitePosition: new Position(position) });
        } else {
            formattedMoves[formattedMoves.length - 1].black = code;
            formattedMoves[formattedMoves.length - 1].blackPosition = new Position(position);
        }
        position.play(code);
    });

    match.moves = formattedMoves;

    return match;
}

export {
    getMovesNext,
    getMovesTop,
    getMatches,
    getMatchById,
}
