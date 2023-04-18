import React from 'react';
import RangeSelector from '../../RangeSelector';

const AnalysisFilters = ({ filterState, setFilterState }) => (
    <form className="p-1 overflow-auto mh-75">
        <div className="form-group mt-3">
            <label className="form-label">White rating range</label>
            <RangeSelector
                values={filterState.whiteRatingRange}
                setValues={values => setFilterState({...filterState, whiteRatingRange: values})}
                bounds={[0, 3000]}
            />
        </div>
        <div className="form-group mt-2">
            <label className="form-label">Black rating range</label>
            <RangeSelector
                values={filterState.blackRatingRange}
                setValues={values => setFilterState({...filterState, blackRatingRange: values})}
                bounds={[0, 3000]}
            />
        </div>
        <hr />
        <div className="form-group mt-3">
            <label className="form-label">Date range</label>
            <div className="input-group input-group-sm mb-1">
                <input
                    type="date"
                    value={filterState.dateRange[0]}
                    className="form-control form-control-sm"
                    onChange={e => setFilterState({...filterState, dateRange: [e.target.value, filterState.dateRange[1]]})}
                />
                <span className="input-group-text">-</span>
                <input
                    type="date"
                    value={filterState.dateRange[1]}
                    className="form-control form-control-sm"
                    onChange={e => setFilterState({...filterState, dateRange: [filterState.dateRange[0], e.target.value]})}
                />
            </div>
        </div>
        <hr />
    </form>
);

export default AnalysisFilters;