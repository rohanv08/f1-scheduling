import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Select from 'react-select';
import countries from '../data/teams.json';
import circuits from '../data/circuits.json';



const AnalysisPage = props => {  
    const [characters, updateCharacters] = useState(circuits);
    const [label, updateLabel] = useState(0);
  
    function handleOnDragEnd(result) {
      if (!result.destination) return;
  
      const total = Array.from(characters)
      const items = Array.from(characters[label]);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      
      total[label] = items
      updateCharacters(total);
    }
          
    function handleChange(e){
      updateLabel(e.value)
      }
           
    
    return (
      <div className="container">
            <Select options={countries} onChange={handleChange} defaultValue={countries[label]}/>
            <br></br>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="characters">
                {(provided) => (
                  <ol className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                    {characters[label].map((name, index) => {
                      return (
                        <Draggable key={name} draggableId={name} index={index}>
                          {(provided) => (
                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <p>
                                { name }
                              </p>
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ol>
                )}
              </Droppable>
            </DragDropContext>
          </div>
      );    
};

export default AnalysisPage;