import React from "react";
import {queryBackend} from './../../../fetcher'
import * as Bs from "react-bootstrap";
import SortableColumn from '../../SortableColumn';
import RangeSelector from "../../RangeSelector";
import {useNavigate} from "react-router-dom"
import Pagination from "../../Pagination";

class PlayersPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            playerResults: [],
            playerPageNumber: 0,
            playerPageSize: 10,
            queryName: undefined,
            minRating: undefined,
            maxRating: undefined,
            sortBy: undefined,
            order: undefined,
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
            playerPageNumber: 0,
        });
        const result = await queryBackend(`players`, {
            result_pos: (pageNum - 1) * this.state.playerPageSize,
            result_size: this.state.playerPageSize,
            name: this.state.queryName,
            r_min: this.state.minRating,
            r_max: this.state.maxRating,
            sort_by: this.state.sortBy,
            order: this.state.order,
        });
        this.setState({
            playerResults: result,
            playerPageNumber: pageNum,
        });
    }

    jumpToPlayer(id) {
        this.props.nav(`/players/${id}`);
    }

    render() {
        return (<Bs.Container className="mt-5">
            <h3 className="text-center">Players</h3>
            <Bs.Row>
                <Bs.Col className="col-4 g-3 align-items-center">
                    <Bs.Form.Group className="mb-3">
                        <Bs.Form.Label>Name</Bs.Form.Label>
                        <Bs.Form.Control type="text" placeholder="Magnus" onChange={e =>
                            this.setState({queryName: e.target.value})} autocomplete="new-password"/>
                    </Bs.Form.Group>
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
                            <this.column field="name">Name</this.column>
                            <this.column field="win">Wins</this.column>
                            <this.column field="lose">Losses</this.column>
                            <this.column field="draw">Draws</this.column>
                            <this.column field="m_rating">Maximum Rating</this.column>
                            <this.column field="l_rating">Latest Rating</this.column>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.playerPageNumber > 0 && this.state.playerResults.slice(0, this.state.playerPageSize)
                            .map((player, index) => {
                                return (
                                    <tr key={index} onClick={() => this.jumpToPlayer(player.id)}>
                                        <td>{player.name}</td>
                                        <td>{player.win}</td>
                                        <td>{player.lose}</td>
                                        <td>{player.draw}</td>
                                        <td>{player.m_rating}</td>
                                        <td>{player.l_rating}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Bs.Table>
                    <Pagination
                        pageNumber={this.state.playerPageNumber}
                        hasNext={this.state.playerResults.length > this.state.playerPageSize}
                        updateResult={this.updateResult.bind(this)}
                    />
                </Bs.Col>
            </Bs.Row>
        </Bs.Container>);
    }
}

export default function (props) {
    let navigate = useNavigate();
    return <PlayersPage nav={navigate}/>;
}
