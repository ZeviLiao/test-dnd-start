import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  rectIntersection,
} from "@dnd-kit/core";
import "./styles.css"; // Ensure you have a CSS file for styles

// DraggableItem component
const DraggableItem = ({ id, color, isOver, isDragging, zIndex }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
    backgroundColor: isDragging ? color : isOver ? "yellow" : color,
    border: isDragging ? "2px solid blue" : "none",
    cursor: isDragging ? "grabbing" : "grab",
    zIndex, // Use dynamic zIndex
    transition: !isDragging ? "transform 0.3s ease" : "none",
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="draggable-item"
      style={style}
    >
      {id}
    </div>
  );
};

// DroppableArea component
const DroppableArea = ({
  id,
  children,
  position,
  isOver,
  isDragging,
  zIndex,
}) => {
  const { setNodeRef } = useDroppable({ id });

  const style = {
    position: "absolute",
    top: position.y,
    left: position.x,
    width: "100px",
    height: "100px",
    backgroundColor: isOver ? "yellow" : "transparent", // Change to yellow when over
    border: isOver ? "2px dashed gray" : "none",
    zIndex, // Dynamic zIndex passed here
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
      {isDragging && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 255, 0, 0.2)", // Green placeholder
            border: "2px dashed green",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

const App = () => {
  const initialPositions = [
    { id: "item1", color: "lightblue", position: { x: 50, y: 200 }, zIndex: 1 },
    {
      id: "item2",
      color: "lightcoral",
      position: { x: 300, y: 200 },
      zIndex: 1,
    },
  ];

  const [items, setItems] = useState(initialPositions);
  const [overlappingItem, setOverlappingItem] = useState(null);
  const [draggingItem, setDraggingItem] = useState(null);

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOverlappingItem(over.id);
    } else {
      setOverlappingItem(null);
    }
  };

  const handleDragEnd = (event) => {
    // Reset zIndex after drag ends
    const updatedItems = items.map((item) => ({
      ...item,
      zIndex: 1, // Reset all items to default zIndex
    }));

    setItems(updatedItems);
    setOverlappingItem(null);
    setDraggingItem(null);
  };

  const handleDragStart = (event) => {
    setDraggingItem(event.active.id);

    // Update zIndex for the dragging item
    const updatedItems = items.map((item) => {
      if (item.id === event.active.id) {
        return { ...item, zIndex: 10 }; // Bring the dragged item to the top
      }
      return item;
    });

    setItems(updatedItems);
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      collisionDetection={rectIntersection}
    >
      {items.map((item) => (
        <DroppableArea
          key={item.id}
          id={item.id}
          position={item.position}
          isOver={overlappingItem === item.id}
          isDragging={draggingItem === item.id}
          zIndex={item.zIndex} // Dynamic zIndex passed here
        >
          <DraggableItem
            id={item.id}
            color={item.color}
            isOver={overlappingItem === item.id}
            isDragging={draggingItem === item.id}
            zIndex={item.zIndex} // Dynamic zIndex passed here
          />
        </DroppableArea>
      ))}

      {overlappingItem && (
        <div className="overlay">Overlay detected with {overlappingItem}!</div>
      )}
    </DndContext>
  );
};

export default App;
