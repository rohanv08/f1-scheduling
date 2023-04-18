import React from "react";

const WhiteDrawBlackRatio = props => {
    const { white, draw, black } = props;

    return (
        <div className="progress border">
            <div className="progress-bar text-black" role="progressbar" style={ { width: `${white}%`, backgroundColor: '#f0f0f0' } }>{white >= 10 ? `${white}%` : ''}</div>
            <div className="progress-bar" role="progressbar" style={ { width: `${draw}%`, backgroundColor: '#6d6d6d' } }>{draw >= 10 ? `${draw}%` : ''}</div>
            <div className="progress-bar" role="progressbar" style={ { width: `${black}%`, backgroundColor: '#202020' } }>{black >= 10 ? `${black}%` : ''}</div>
        </div>
    )
};

export default WhiteDrawBlackRatio;