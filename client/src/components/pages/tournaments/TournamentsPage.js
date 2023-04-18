import React from "react";
import {queryBackend} from './../../../fetcher'
import * as Bs from "react-bootstrap";
import SortableColumn from '../../SortableColumn';
import RangeSelector from "../../RangeSelector";
import { useNavigate } from "react-router-dom";
import {format} from "date-fns";


class TournamentsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tournamentResults: [],
            tournamentPageNumber: 0,
            tournamentPageSize: 10,
            event: undefined,
            city: undefined,
            minRating: undefined,
            maxRating: undefined,
            sortBy: undefined,
            order: undefined,
            before: '2008-01-01',
            after: '2006-01-01',
        };
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

    async updateResult(pageNum) {
        this.setState({
            tournamentPageNumber: 0,
        });
        const result = await queryBackend(`tournaments`, {
            result_pos: (pageNum - 1) * this.state.tournamentPageSize,
            result_size: this.state.tournamentPageSize,
            site: this.state.site_name,
            event: this.state.event_name,
            r_min: this.state.minRating,
            r_max: this.state.maxRating,
            before: this.state.before,
            after: this.state.after,
            sort_by: this.state.sortBy,
            order: this.state.order,
        });
        this.setState({
            tournamentResults: result,
            tournamentPageNumber: pageNum,
        });
    }

    jumpToTournament(event_id, site_id) {
        this.props.nav(`/tournaments/${event_id}/${site_id}`);
    }

    render() {
        return (<Bs.Container>
            <h3 className="text-center">Tournaments</h3>
            <Bs.Row>
            <Bs.Col className="col-4 g-3 align-items-center">
                <Bs.Row>
                <Bs.Col className="col-6 g-3 align-items-center">
                    <Bs.Form.Group className="mb-3">
                                <Bs.Form.Label>Event</Bs.Form.Label>
                                <Bs.Form.Control type="text" placeholder="World op" onChange={e =>
                                    this.setState({event_name: e.target.value})}/>
                        </Bs.Form.Group>
                </Bs.Col>
                <Bs.Col className="col-6 g-3 align-items-center">
                <Bs.Form.Group className="mb-3">
                            <Bs.Form.Label>Site</Bs.Form.Label>
                            <Bs.Form.Control type="text" placeholder="London" onChange={e =>
                                this.setState({site_name: e.target.value})}/>
                    </Bs.Form.Group>
                </Bs.Col>
                </Bs.Row>
                <label className="form-label">Date range</label>
            <div className="input-group input-group-sm mb-1">
                <input
                    type="date"
                    defaultValue='2006-01-01'
                    min='2006-01-01'
                    max='2008-01-01'
                    className="form-control form-control-sm"
                    onChange={e =>this.setState({after: e.target.value})}
                />
                <span className="input-group-text">-</span>
                <input
                    type="date"
                    defaultValue='2008-01-01'
                    min='2006-01-01'
                    max='2008-01-01'
                    className="form-control form-control-sm"
                    onChange={e =>this.setState({before: e.target.value})}
                />
            </div>
                <Bs.Form.Label>Rating</Bs.Form.Label>
                <RangeSelector
                        values={[this.state.minRating ?? 0, this.state.maxRating ?? 3000]}
                        setValues={([minRating, maxRating]) => this.setState({minRating, maxRating})}
                        bounds={[0, 3000]}
                />
                    <div className="d-grid">
                        <Bs.Button variant="primary" type="button" className="mt-3"
                                   onClick={() => this.updateResult(1)}>
                            Filter
                        </Bs.Button>
                    </div>
                </Bs.Col>
                <Bs.Col className="col-8">
                    <Bs.Table hover striped>
                        <thead>
                        <tr>
                            <this.column field="event">Event</this.column>
                            <this.column field="site">Site</this.column>
                            <this.column field="start">Start Date</this.column>
                            <this.column field="end">End Date</this.column>
                            <this.column field="avg_rating">Average Rating</this.column>
                            <this.column field="num_games">Games</this.column>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.tournamentPageNumber > 0 && this.state.tournamentResults.slice(0, this.state.tournamentPageSize)
                            .map((tournament, index) => {
                                return (
                                    <tr key={index} onClick={() => this.jumpToTournament(tournament.event_id, tournament.site_id)}>
                                        <td>{tournament.event}</td>
                                        <td>{tournament.site}</td>
                                        <td>{format(new Date(tournament.start), 'PP')}</td>
                                        <td>{format(new Date(tournament.end), 'PP')}</td>
                                        <td>{tournament.avg_rating}</td>
                                        <td>{tournament.num_games}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Bs.Table>
                    {this.state.tournamentPageNumber > 0 ?
                        <Bs.Pagination className="justify-content-end">
                            {this.state.tournamentPageNumber > 1 && <>
                                <Bs.Pagination.Item onClick={() => this.updateResult(this.state.tournamentPageNumber - 1)}>
                                    Previous</Bs.Pagination.Item>
                                <Bs.Pagination.Item onClick={() => this.updateResult(1)}>1</Bs.Pagination.Item>
                            </>}
                            {this.state.tournamentPageNumber > 2 &&
                                <Bs.Pagination.Ellipsis disabled></Bs.Pagination.Ellipsis>}
                            <Bs.Pagination.Item active>{this.state.tournamentPageNumber}</Bs.Pagination.Item>
                            {this.state.tournamentResults.length > this.state.tournamentPageSize && <>
                                <Bs.Pagination.Ellipsis disabled></Bs.Pagination.Ellipsis>
                                <Bs.Pagination.Item onClick={() => this.updateResult(this.state.tournamentPageNumber + 1)}>
                                    Next</Bs.Pagination.Item>
                            </>}
                        </Bs.Pagination> : <p>Loading&hellip;</p>
                    }
                </Bs.Col>
            </Bs.Row>
        </Bs.Container>);
    }

}

export default function (props) {
    let navigate = useNavigate();
    return <TournamentsPage nav={navigate}/>;
}
