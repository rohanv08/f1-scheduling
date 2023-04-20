import React from 'react';

const MatchRow = ({ match, switchToGame }) => {
    const { whiteName, blackName, whiteRating, blackRating, result, date } = match;

    const whiteLastName = whiteName.split(' ').slice(-1);
    const blackLastName = blackName.split(' ').slice(-1);

    return (
        <tr onClick={switchToGame}>
            <td><span className={result === 1 ? "text-decoration-underline" : ""}>{whiteLastName}</span> <em>({whiteRating})</em></td>
            <td><span className={result === 2 ? "text-decoration-underline" : ""}>{blackLastName}</span> <em>({blackRating})</em></td>
            <td>{date.split('T')[0]}</td>
        </tr>
    )
}

export default MatchRow;