import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Select from 'react-select';
import teams from '../data/teams.json';
import circuits from '../data/circuits.json';
import meta from '../data/meta.json';
import solution from '../data/solution.json';
import { Button} from 'react-bootstrap';
import {fetchWithTimeout} from '../fetchWithTimeout'
import config from '../config.json'
import LoadingSpinner from "./LoadingSpinner";

const server = `http://${config.server_host}:${config.server_port}/`

const AnalysisPage = props => {  
    const [characters, updateCharacters] = useState(circuits);
    const [label, updateLabel] = useState(0);
    const [preferences, updatePreferences] = useState(meta);
    const [start, updateStart] = useState(10);
    const [race, updateRace] = useState(10);
    const [sol, updateSol] = useState(solution);
    const [isLoading, setIsLoading] = useState(false);

    function handleOnDragEnd(result) {
      if (!result.destination) return;
  
      const total = Array.from(characters)
      const items = Array.from(characters[label]);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      
      total[label] = items
      updateCharacters(total);
    }


    function handlePrefChange(e, trackName) {
      const { name, value } = e.target
      if (name === "lat"){
        if (value > 90) {
          callPreferences(trackName, name, 90);
        }
        else if (value < -90) {
          callPreferences(trackName, name, -90);
        }
        callPreferences(trackName, name, value);
      } else if (name == "lng") {
        if (value > 180) {
          callPreferences(trackName, name, 180);
        }
        else if (value < -180) {
          callPreferences(trackName, name, -180);
        }
        callPreferences(trackName, name, value);
      } else {
        if (value > 10) {
          callPreferences(trackName, name, 10);
        }
        else if (value < 1) {
          callPreferences(trackName, name, 1);
        }
        callPreferences(trackName, name, value);
      }
    }

    function buttonHandler(json){
      updateSol(json); 
      setIsLoading(false);
    }

    function sendToSolver () {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "tt_preferences": characters,
            "at_preferences": preferences,
            "teams": teams,
            "start_week": start,
            "number_of_races": race
          }),
          timeout: 800000
        }
        setIsLoading(true);
        fetch(server + 'submit', requestOptions).then((response) => response.json())
        .then((json) => {buttonHandler(json)}).catch(() => {
          console.log("Unable to fetch user list");
          updateSol(solution);
          setIsLoading(false);
       });
 

    }
  

    function callPreferences(trackName, name, value) {
      if (name === "pref"){
        const tempMeta = {...preferences};
        tempMeta[trackName][name] = Number.parseInt(value, 10)
        updatePreferences(tempMeta);
      } else {
        const tempMeta = {...preferences};
        tempMeta[trackName][name] = value
        updatePreferences(tempMeta);  
      }
      forceUpdate();
    }

    function handleChange(e){
      updateLabel(e.value)
    }
    
    const renderUser = (
      <div className="container" style={{display: "flex"}}>
        <div className="horizontal" style = {{paddingRight: "30px"}}>        
          <center><Button
            variant="primary" type="button"
            onClick={() => sendToSolver()} 
            disabled={isLoading}>Submit to Solver!</Button></center><br></br>

          Start Week: <input name="start"
            value={start}
            type="number" step="1" min = "1" max = "52"
            onChange = {(e) => updateStart(e.target["value"])}/>
          &nbsp; Number of Races: <input name="races"
            value={race}
            type="number" step="1" min = "0" max = {51-start}
            onChange = {(e) => updateRace(e.target["value"])}/>

              <Select options={teams} onChange={handleChange} defaultValue={teams[label]}/>
              <br></br>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="characters">
                  {(provided) => (
                    <table cellPadding={5} className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                      <thead align = 'center'><tr><th>Index</th><th>Track</th><th>Latitude</th><th>Longitude</th><th>Audience Preferences</th></tr></thead>
                      <tbody>
                      {characters[label].map((name, index) => {
                        return (
                          <Draggable key={name} draggableId={name} index={index}>
                            {(provided) => (
                              <tr align = 'center'><td>{index+1}</td>
                              <td ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  {name}
                              </td>
                              <td>
                                <input name="lat"
                                  value={preferences[name]["lat"]}
                                  type="number" step="0.0001" min = "-90" max = "90"
                                  onChange = {(e) => handlePrefChange(e, name)}/>
                              </td>
                              <td>
                                <input name="lng"
                                  value={preferences[name]["lng"]}
                                  type="number" step="0.0001" min = "-180" max = "180"
                                  onChange = {(e) => handlePrefChange(e, name)}/>
                              </td>
                              <td>
                                <input name="pref"
                                  value={preferences[name]["pref"]}
                                  type="number" step="1" min = "1" max = "10"
                                  onChange = {(e) => handlePrefChange(e, name)}/>
                              </td>                            
                              </tr>
                            )}
                          </Draggable>
                        );
                      })}
                      </tbody>
                      {provided.placeholder}
                    </table>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            <div className="horizontal">
              <h1>Solver Result</h1>
              <p>Model Score of {sol["Score"]}</p>
              <table cellPadding={5}>
                <thead align = 'center'>
                  <tr>
                  <th>Week</th>
                  <th>Track</th>
                  <th>Weather (Celsius)</th>
                  <th>Distance (Miles)</th>
                  </tr>
                </thead><tbody>
                  {Object.keys(sol).map((row) => {
                    if ((row !== "Score") && (Object.keys(sol[row]).length !== 0)){
                      return (
                      <tr key = {row} align = 'center'>
                      <td>{row}</td>
                      <td>{sol[row].track}</td>
                      <td>{Number(sol[row].weather).toFixed(2)}</td>
                      <td>{Number(sol[row].distance).toFixed(0)}</td>
                    </tr>);
                    }
                  })}
                </tbody>
              </table>        
            </div>
          </div>
        );
    return ( <div className="App">
    {isLoading ? <LoadingSpinner /> : renderUser}
  </div>
);
};

export default AnalysisPage;