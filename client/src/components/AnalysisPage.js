import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const AnalysisPage = props => {
    const finalSpaceCharacters = [
        {
          id: 'gary',
          name: 'Gary Goodspeed'
        },
        {
          id: 'cato',
          name: 'Little Cato'
        },
        {
          id: 'kvn',
          name: 'KVN'
        },
        {
          id: 'mooncake',
          name: 'Mooncake'
        },
        {
          id: 'quinn',
          name: 'Quinn Ergon'
        }
      ]
    
      const [characters, updateCharacters] = useState(finalSpaceCharacters);
    
      function handleOnDragEnd(result) {
        if (!result.destination) return;
    
        const items = Array.from(characters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
    
        updateCharacters(items);
      }  
    
    return (
          <table>
            <tr><td>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="characters">
                  {(provided) => (
                    <ol className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                      {characters.map(({id, name}, index) => {
                        return (
                          <Draggable key={id} draggableId={id} index={index}>
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
            </td>
            <td>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="characters">
                  {(provided) => (
                    <ol className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                      {characters.map(({id, name}, index) => {
                        return (
                          <Draggable key={id} draggableId={id} index={index}>
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
            </td></tr>
          </table>
      );    
};

export default AnalysisPage;