
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AnalysisPage from "./components/AnalysisPage";

const App = props => {
  return (
    <div className="vh-100">
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-3">
        <div className="container-fluid">
          <a className="navbar-brand d-none d-sm-block" href="#">Formula 1 Scheduling</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* <div className="navbar-nav">
                <Link className="nav-link" to="/">Inputs</Link>
            </div> */}
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<AnalysisPage />} />
      </Routes>
    </div>
  );
};

export default App;
