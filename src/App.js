import React, { useState } from "react";
import './App.css'; // Optional for adding styles

const DragAndDrop = () => {
  const [dragging, setDragging] = useState(false);
  const [droppedItem, setDroppedItem] = useState(null);

  // Start dragging
  const handleDragStart = (e) => {
    setDragging(true);
    e.dataTransfer.setData("text/plain", e.target.id); // Set drag data
  };

  // Drag over the drop area
  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedData = e.dataTransfer.getData("text/plain");
    setDroppedItem(droppedData); // Store the dropped data (item id in this case)
    setDragging(false);
  };

  return (
    <div className="drag-drop-container">
      {/* Draggable items */}
      <div 
        id="drag1"
        className="draggable-item"
        draggable="true"
        onDragStart={handleDragStart}
        style={{ backgroundColor: dragging ? "lightgreen" : "lightblue" }}
      >
        Drag Me!
      </div>

      {/* Drop target */}
      <div
        className="drop-zone"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ border: dragging ? "3px dashed green" : "3px dashed gray" }}
      >
        Drop Here
      </div>

      {/* Display the dropped item */}
      {droppedItem && (
        <div className="dropped-message">
          You dropped: {droppedItem}
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;
