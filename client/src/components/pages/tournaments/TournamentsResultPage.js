import React from "react";
import {queryBackend} from './../../../fetcher'
import {useNavigate, useParams} from "react-router-dom";
import * as Bs from 'react-bootstrap';
import Pagination from "../../Pagination";
import {format} from "date-fns";

class TournamentResult extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.setState({
            standingPageNumber: 0,
            standingPageSize: 10,
            standings: [],
            matchPageNumber: 0,
            matchPageSize: 10,
            matches: [],
            tournament: await queryBackend(`tournaments/${this.props.params.event_id}/${this.props.params.site_id}`)
        }, () => {
            this.updateStandings(1);
            this.updateMatches(1);
        });
    }

    async updateStandings(standingPageNumber) {
        this.setState({
            standingPageNumber: 0,
        });
        const standings = await queryBackend(
            `tournaments/${this.props.params.event_id}/${this.props.params.site_id}/standings`, {
                result_pos: (standingPageNumber - 1) * this.state.standingPageSize,
                result_size: this.state.standingPageSize,
            });
        this.setState({standings, standingPageNumber});
    }

    async updateMatches(matchPageNumber) {
        this.setState({
            matchPageNumber: 0,
        });
        const matches = await queryBackend(
            `tournaments/${this.props.params.event_id}/${this.props.params.site_id}/matches`, {
                result_pos: (matchPageNumber - 1) * this.state.standingPageSize,
                result_size: this.state.standingPageSize,
            });
        this.setState({matches, matchPageNumber});
    }

    jumpToPlayer(id) {
        this.props.nav(`/players/${id}`);
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
                <Bs.Card className="mb-3">
                    <Bs.Card.Body>
                        <Bs.Card.Title as="h5">{this.state.tournament.event}</Bs.Card.Title>
                        <Bs.Card.Subtitle as="h6" className="mb-2">{this.state.tournament.site}
                            <img className="flagi"
                                 src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${
                                     this.state.tournament.country.toUpperCase()}.svg`}/></Bs.Card.Subtitle>
                        <Bs.Card.Subtitle as="h6" className="mb-2">{this.state.tournament.num_games} Games with an
                            average rating of {this.state.tournament.avg_rating}</Bs.Card.Subtitle>
                        <Bs.Card.Text>
                            Started on {format(new Date(this.state.tournament.start), 'PP')} and ended
                            on {format(new Date(this.state.tournament.end), 'PP')}
                        </Bs.Card.Text>
                    </Bs.Card.Body>
                </Bs.Card>
                <Bs.Row>
                    <Bs.Col className="col-7">
                        <h4>Matches</h4>
                        <Bs.Table hover striped responsive>
                            <thead>
                            <tr>
                                <th>White</th>
                                <th>Black</th>
                                <th>Moves</th>
                                <th>Result</th>
                                <th>Round</th>
                                <th>Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.matchPageNumber > 0 && this.state.matches.slice(0, this.state.matchPageSize)
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
                                            <td>{match.round}</td>
                                            <td>{format(new Date(match.date), 'PP')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Bs.Table>
                        <Pagination
                            pageNumber={this.state.matchPageNumber}
                            hasNext={this.state.matches.length > this.state.matchPageSize}
                            updateResult={this.updateMatches.bind(this)}
                        />
                    </Bs.Col>
                    <Bs.Col className="col-5">
                        <h4>Standings</h4>
                        <Bs.Table hover striped>
                            <thead>
                            <tr>
                                <th>Player</th>
                                <th>Rating</th>
                                <th>Score</th>
                                <th>Won</th>
                                <th>Lost</th>
                                <th>Tied</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.standingPageNumber > 0 && this.state.standings.slice(0, this.state.standingPageSize)
                                .map((player, index) => {
                                    return (
                                        <tr key={index} onClick={() => this.jumpToPlayer(player.id)}>
                                            <td>{player.name}</td>
                                            <td>{player.rating}</td>
                                            <td>{player.score}</td>
                                            <td>{player.win}</td>
                                            <td>{player.lose}</td>
                                            <td>{player.draw}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Bs.Table>
                        <Pagination
                            pageNumber={this.state.standingPageNumber}
                            hasNext={this.state.standings.length > this.state.standingPageSize}
                            updateResult={this.updateStandings.bind(this)}
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
    return <TournamentResult params={params} nav={nav}/>
}
