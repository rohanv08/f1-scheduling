import React from 'react';
import RangeSelector from '../../RangeSelector';

const MatchesFilters = ({ filterState, setFilterState }) => (
    <form className="p-1 overflow-auto mh-75">
        <div className="form-group mt-3">
            <label className="form-label">White player name</label>
            <input type="text" className="form-control form-control-sm" onChange={e => setFilterState({...filterState, whiteName: e.target.value})} />
        </div>
        <div className="form-group mt-3">
            <label className="form-label">Black player name</label>
            <input type="text" className="form-control form-control-sm" onChange={e => setFilterState({...filterState, blackName: e.target.value})} />
        </div>
        <hr />
        <div className="form-group mt-3">
            <label className="form-label">White rating range</label>
            <RangeSelector
                values={filterState.whiteRatingRange ?? [0, 3000]}
                setValues={values => setFilterState({...filterState, whiteRatingRange: values})}
                bounds={[0, 3000]}
            />
        </div>
        <div className="form-group mt-2">
            <label className="form-label">Black rating range</label>
            <RangeSelector
                values={filterState.blackRatingRange ?? [0, 3000]}
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
                    defaultValue='2006-01-01'
                    min='2006-01-01'
                    max='2008-01-01'
                    className="form-control form-control-sm"
                    onChange={e => setFilterState({...filterState, dateRange: [
                        e.target.value, filterState.dateRange ? filterState.dateRange[1] : undefined]})}
                />
                <span className="input-group-text">-</span>
                <input
                    type="date"
                    defaultValue='2008-01-01'
                    min='2006-01-01'
                    max='2008-01-01'
                    className="form-control form-control-sm"
                    onChange={e => setFilterState({...filterState, dateRange: [
                            filterState.dateRange ? filterState.dateRange[0]: undefined, e.target.value]})}
                />
            </div>
        </div>
        <hr />
    </form>
);

export default MatchesFilters;
