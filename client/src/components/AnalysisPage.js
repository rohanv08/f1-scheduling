import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Select from 'react-select';
import countries from '../data/teams.json';
import circuits from '../data/circuits.json';
import meta from '../data/meta.json';
import { Button} from 'react-bootstrap';



const AnalysisPage = props => {  
    const [characters, updateCharacters] = useState(circuits);
    const [label, updateLabel] = useState(0);
    const [preferences, updatePreferences] = useState(meta);
    const [start, updateStart] = useState(15);
    const [race, updateRace] = useState(10);
  
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
      this.forceUpdate();
    }

    function handleChange(e){
      updateLabel(e.value)
    }
           
    
    return (
      <div className="container">
        <center><Button
          variant="primary" type="button"
          onClick={() => {console.log("Button Clicked!");
          }} >Submit to Solver!</Button></center><br></br>

        Start Week: <input name="start"
          value={start}
          type="number" step="1" min = "1" max = "52"
          onChange = {(e) => updateStart(e.target["value"])}/>
        &nbsp; Number of Races: <input name="races"
          value={race}
          type="number" step="1" min = "1" max = "52"
          onChange = {(e) => updateRace(e.target["value"])}/>

            <Select options={countries} onChange={handleChange} defaultValue={countries[label]}/>
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
      );    
};

export default AnalysisPage;