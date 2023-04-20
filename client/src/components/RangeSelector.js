import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const RangeSelector = ({ values, setValues, bounds }) => (
    <div className="d-block align-middle">
        <div className="input-group input-group-sm mb-1">
            <input
                type="number"
                className="form-control"
                value={values[0]}
                placeholder={bounds[0]}
                min={bounds[0]}
                max={bounds[1]}
                // onChange={e => setValues([e.target.value, values[1]])}
                readOnly
            />
            <span className="input-group-text">-</span>
            <input
                type="number"
                className="form-control"
                value={values[1]}
                placeholder={bounds[1]}
                min={bounds[0]}
                max={bounds[1]}
                // onChange={e => setValues([values[0], e.target.value])}
                readOnly
            />
        </div>
        <div className="mx-4 mt-2">
            <Slider
                range
                allowCross={false}
                min={bounds[0]}
                max={bounds[1]}
                defaultValue={values}
                onAfterChange={values => setValues(values)}
            />
        </div>
    </div>
)

export default RangeSelector;