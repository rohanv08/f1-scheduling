import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import MatchesFilters from "./MatchesFilters";
import * as Bs from "react-bootstrap";
import Pagination from "../../Pagination";
import SortableColumn from "../../SortableColumn";
import {queryBackend} from "../../../fetcher";
import {format} from "date-fns";

class MatchesSearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 0,
            pageSize: 10,
            matches: [],
        }
        this.column = SortableColumn.bind(this);
    }

    componentDidMount() {
        this.updateResult(1);
    }

    async updateSort(sortBy, order) {
        if (order === undefined)
            sortBy = undefined;
        this.setState({sortBy, order}, () => {
            this.updateResult(1);
        });
    }

    async updateResult(pageNumber) {
        const {whiteName, blackName, whiteRatingRange, blackRatingRange, dateRange} = this.props.filterState;
        this.setState({pageNumber: 0});
        const matches = await queryBackend(`matches`, {
            result_pos: (pageNumber - 1) * this.state.pageSize,
            result_size: this.state.pageSize,
            w_name: whiteName,
            b_name: blackName,
            w_min: whiteRatingRange ? whiteRatingRange[0] : undefined,
            w_max: whiteRatingRange ? whiteRatingRange[1] : undefined,
            b_min: blackRatingRange ? blackRatingRange[0] : undefined,
            b_max: blackRatingRange ? blackRatingRange[1] : undefined,
            after: dateRange ? dateRange[0] : undefined,
            before: dateRange ? dateRange[1] : undefined,
            sort_by: this.state.sortBy,
            order: this.state.order,
        });
        this.setState({matches, pageNumber});
    }

    jumpToMatch(id) {
        this.props.nav(`/matches/${id}`);
    }

    render() {
        return <Bs.Container className="mt-5">
            <h3 className="text-center">Matches</h3>
            <Bs.Row>
                <Bs.Col className="col-4 g-3 align-items-center">
                    <MatchesFilters
                        filterState={this.props.filterState}
                        setFilterState={this.props.setFilterState}/>
                    <div className="d-grid">
                        <Bs.Button variant="primary" type="button" onClick={() => this.updateResult(1)}>
                            Filter
                        </Bs.Button>
                    </div>
                </Bs.Col>
                <Bs.Col className="col-8">
                    <Bs.Table hover striped>
                        <thead>
                        <tr>
                            <this.column field="w_name">White</this.column>
                            <this.column field="w_rating">W Rating</this.column>
                            <this.column field="b_name">Black</this.column>
                            <this.column field="b_rating">B Rating</this.column>
                            <th>Result</th>
                            <this.column field="date">Date</this.column>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.pageNumber > 0 && this.state.matches.slice(0, this.state.pageSize)
                            .map((match, index) => {
                                return (
                                    <tr key={index} onClick={() => this.jumpToMatch(match.id)}>
                                        <td>{match.w_name}</td>
                                        <td>{match.w_rating}</td>
                                        <td>{match.b_name}</td>
                                        <td>{match.b_rating}</td>
                                        <td>{[null, '1-0', '0-1', '½-½'][match.result]}</td>
                                        <td>{format(new Date(match.date), 'PP')}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Bs.Table>
                    <Pagination
                        pageNumber={this.state.pageNumber}
                        hasNext={this.state.matches.length > this.state.pageSize}
                        updateResult={this.updateResult.bind(this)}
                    />
                </Bs.Col>
            </Bs.Row>
        </Bs.Container>;
    }
}

export default function () {
    let navigate = useNavigate();
    const [filterState, setFilterState] = useState({});
    return <MatchesSearchPage nav={navigate} filterState={filterState} setFilterState={setFilterState}/>;
}
