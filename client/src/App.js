
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AnalysisPage from "./components/pages/analysis/AnalysisPage";
import MatchesPage from "./components/pages/matches/MatchesPage";
import PlayersPage from "./components/pages/players/PlayersPage";
import TournamentsPage from "./components/pages/tournaments/TournamentsPage";
import PlayerResultPage from "./components/pages/players/PlayerResultPage";
import MatchesSearchPage from "./components/pages/matches/MatchesSearchPage";
import TournamentResult from "./components/pages/tournaments/TournamentsResultPage";


const App = props => {
  return (
    <div className="vh-100">
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-3">
        <div className="container-fluid">
          <a className="navbar-brand d-none d-sm-block" href="#">Chess Analyzer</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav">
                <Link className="nav-link" to="/">Analysis</Link>
                <Link className="nav-link" to="/matches">Matches</Link>
                <Link className="nav-link" to="/players">Players</Link>
                <Link className="nav-link" to="/tournaments">Tournaments</Link>
            </div>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<AnalysisPage />} />
        <Route path="/matches" element={<MatchesSearchPage />} />
        <Route path="/matches/:id" element={<MatchesPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/players/:id" element={<PlayerResultPage />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/:event_id/:site_id" element={<TournamentResult />} />
      </Routes>
    </div>
  );
};

export default App;
