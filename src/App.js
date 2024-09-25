import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, rectIntersection } from '@dnd-kit/core';

const Draggable = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
    width: 100,
    height: 100,
    backgroundColor: 'lightblue',
    position: 'absolute',
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {id}
    </div>
  );
};

const Droppable = ({ id }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  const style = {
    width: 100,
    height: 100,
    backgroundColor: 'lightcoral',
    position: 'absolute',
    top: 200,
  };

  return <div ref={setNodeRef} style={style} />;
};

const App = () => {
  const [signal, setSignal] = useState(false);

  const handleDragOver = (event) => {
    const { over } = event;

    if (over && over.id === 'b') {
      // 如果a碰到b，觸發碰撞信號
      setSignal(true);
    } else {
      setSignal(false);
    }
  };

  return (
    <DndContext collisionDetection={rectIntersection} onDragOver={handleDragOver}>
      <Draggable id="a" />
      <Droppable id="b" />
      {signal && <div>Collision detected!</div>}
    </DndContext>
  );
};

export default App;
