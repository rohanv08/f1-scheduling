import React, { useState, useEffect } from 'react';
import MatchesFilters from './MatchesFilters';
import MatchRow from './MatchRow';
import { getMatches } from '../../../matchFetcher';

const MatchesView = ({ switchToGame, currPosition }) => {

    const [matches, setMatches] = useState([]);

    const [filtersVisible, setFiltersVisible] = useState(true);
    const [filterState, setFilterState] = useState({ resultPos: 0, resultNum: 10, whiteName: '', blackName: '', whiteRatingRange: [30, 3000], blackRatingRange: [30, 3000], dateRange: ['2006-01-01', '2008-01-01'] });

    useEffect(() => {
        getMatches(filterState).then(matches => {
            if (matches) {
                setMatches(matches);
            } else {
                setMatches([]);
            }
        });
    }, [filterState]);

    return (
        <div className="container-fluid mx-auto d-flex flex-column h-100 p-0">
            <div className="d-flex flex-column border flex-fill h-50">
                <div className="overflow-auto flex-fill">
                    <table className="table table-sm table-hover">
                        <thead>
                            <tr>
                                <td>W</td>
                                <td>B</td>
                                <td>Date</td>
                            </tr>
                        </thead>
                        <tbody>
                            {matches.map((match, index) => (
                                <MatchRow key={match.id} match={match} switchToGame={() => console.log('switched')} />
                            ))}
                        </tbody>
                    </table>
                </div>
                <nav>
                    <ul className="pagination pagination-sm mb-0 justify-content-end me-1 mb-1">
                        <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                        <li className="page-item"><a className="page-link" href="#">1</a></li>
                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                        <li className="page-item"><a className="page-link" href="#">Next</a></li>
                    </ul>
                </nav>
            </div>
            <div
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={() => setFiltersVisible(!filtersVisible)}
            >Filters {filtersVisible ? '-' : '+'}</div>
            {filtersVisible && (
                <MatchesFilters filterState={filterState} setFilterState={setFilterState} />
            )}
        </div>
    )
}

export default MatchesView;