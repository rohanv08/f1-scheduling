import React from "react";
import {queryBackend} from './../../../fetcher'
import {useNavigate, useParams} from "react-router-dom";
import * as Bs from 'react-bootstrap';
import {Line} from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {format} from 'date-fns';
import {
    Chart as ChartJS,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
} from 'chart.js';
import Pagination from "../../Pagination";

ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
);

class PlayerResult extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.setState({
            pageNumber: 0,
            pageSize: 10,
            matches: [],
            ...await queryBackend(`players/${this.props.params.id}`)
        }, () => this.updateResult(1));
    }

    async updateResult(pageNumber) {
        this.setState({
            pageNumber: 0,
        });
        const matches = await queryBackend(`players/${this.props.params.id}/matches`, {
            result_pos: (pageNumber - 1) * this.state.pageSize,
            result_size: this.state.pageSize,
        });
        this.setState({matches, pageNumber});
    }

    jumpToMatch(id) {
        this.props.nav(`/matches/${id}`);
    }

    render() {
        if (this.state === null) {
            return (<Bs.Container>Loading&hellip;</Bs.Container>)
        }
        return (
            <Bs.Container className="text-center">
                <h2>{this.state.name}</h2>
                <h5>{`${this.state.win} Wins, ${this.state.lose} Losses, ${this.state.draw} Draws`}</h5>
                <Bs.Row>
                    <Bs.Col className='col-5'>
                        <h4>Rating Change</h4>
                        <Line data={
                            {
                                labels: this.state.ratings.map(a => a.date),
                                datasets: [
                                    {label: 'rating', data: this.state.ratings.map(a => a.rating)}
                                ],
                            }
                        } options={{
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {unit: 'month', tooltipFormat: 'PP'}
                                },
                                y: {
                                    ticks: {stepSize: 10}
                                }
                            }
                        }}/>
                    </Bs.Col>
                    <Bs.Col className='col-7'>
                        <h4>Matches</h4>
                        <Bs.Table hover striped>
                            <thead>
                            <tr>
                                <th>White</th>
                                <th>Black</th>
                                <th>Moves</th>
                                <th>Result</th>
                                <th>Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.pageNumber > 0 && this.state.matches.slice(0, this.state.pageSize)
                                .map((match, index) => {
                                    return (
                                        <tr key={index} onClick={() => this.jumpToMatch(match.id)}>
                                            <td>{match.result === 1 ? <b>{match.w_name}</b>
                                                : match.w_name} <i>({match.w_rating})</i>
                                            </td>
                                            <td>{match.result === 2 ? <b>{match.b_name}</b>
                                                : match.b_name} <i>({match.b_rating})</i>
                                            </td>
                                            <td>{match.moves}</td>
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
            </Bs.Container>
        )
    }

}

export default function () {
    const params = useParams();
    const nav = useNavigate();
    return <PlayerResult params={params} nav={nav}/>
}
