import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  rectIntersection,
} from "@dnd-kit/core";
import "./styles.css"; // Ensure you have a CSS file for styles

// Define the valid drop relationships
const validDropGroups = {
  item1: ["item2"],  // item1 can drop only on item2
  item2: ["item1", "item3"], // item2 can drop on item1 or item3
  item3: ["item2"],  // item3 can drop only on item2
};

// Helper function to check if drop is valid based on item type
const isValidDrop = (draggedId, droppableId) => {
  const draggedGroup = draggedId.split('-')[0];
  const droppableGroup = droppableId.split('-')[0];

  // Check if the droppableGroup is in the array of valid drops for the draggedGroup
  return validDropGroups[draggedGroup]?.includes(droppableGroup);
};

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
    // Vertical layout for item1-*
    { id: "item1-1", color: "lightblue", position: { x: 50, y: 50 }, zIndex: 1 },
    { id: "item1-2", color: "lightblue", position: { x: 50, y: 200 }, zIndex: 1 },

    // Vertical layout for item2-*
    { id: "item2-1", color: "lightcoral", position: { x: 300, y: 50 }, zIndex: 1 },
    { id: "item2-2", color: "lightcoral", position: { x: 300, y: 200 }, zIndex: 1 },

    // Vertical layout for item3-*
    { id: "item3-1", color: "lightgreen", position: { x: 500, y: 50 }, zIndex: 1 },
    { id: "item3-2", color: "lightgreen", position: { x: 500, y: 200 }, zIndex: 1 },
  ];

  const [items, setItems] = useState(initialPositions);
  const [overlappingItem, setOverlappingItem] = useState(null);
  const [draggingItem, setDraggingItem] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmedPair, setConfirmedPair] = useState({ from: null, to: null });
  const [linkMessage, setLinkMessage] = useState(""); // For showing the link message

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id && isValidDrop(active.id, over.id)) {
      setOverlappingItem(over.id);
    } else {
      setOverlappingItem(null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && isValidDrop(active.id, over.id)) {
      setConfirmedPair({ from: active.id, to: over.id });
      setShowConfirm(true);
    } else {
      resetDragStates();
    }
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

  const resetDragStates = () => {
    const resetItems = items.map((item) => ({ ...item, zIndex: 1 }));
    setItems(resetItems);
    setOverlappingItem(null);
    setDraggingItem(null);
    setShowConfirm(false);
  };

  const handleConfirm = (confirm) => {
    if (confirm) {
      // If confirmed, swap the positions of the two items
      const updatedItems = items.map((item) => {
        if (item.id === confirmedPair.from) {
          return { ...item, position: items.find((el) => el.id === confirmedPair.to).position };
        } else if (item.id === confirmedPair.to) {
          return { ...item, position: items.find((el) => el.id === confirmedPair.from).position };
        }
        return item;
      });
      setItems(updatedItems);
      setLinkMessage(`${confirmedPair.from} is linked with ${confirmedPair.to}`); // Show success message
    }
    resetDragStates(); // Reset states after confirmation or cancellation
  };

  return (
    <div>
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
      </DndContext>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <p>
              Confirm linking {confirmedPair.from} with {confirmedPair.to}?
            </p>
            <button onClick={() => handleConfirm(true)}>Yes</button>
            <button onClick={() => handleConfirm(false)}>No</button>
          </div>
        </div>
      )}

      {/* Link success message */}
      {linkMessage && <div className="link-message">{linkMessage}</div>}
    </div>
  );
};

export default App;
