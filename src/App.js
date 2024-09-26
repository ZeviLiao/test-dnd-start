import React, { useState } from "react";
import "./App.css"; // Optional for adding styles

const DragAndDrop = () => {
  const [lastDroppedMessage, setLastDroppedMessage] = useState(""); // Store the latest drop message

  // Start dragging
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id); // Set drag data
  };

  // Drag over the drop area
  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  // Handle drop event
  const handleDrop = (e, zone) => {
    e.preventDefault();
    const droppedData = e.dataTransfer.getData("text/plain");
    setLastDroppedMessage(`You dropped: ${droppedData} into ${zone}`); // Update the message
  };
  return (
    <>
      <div className="drag-drop-container">
        {/* Left side for draggable items */}
        <div className="drag-items">
          <div
            id="drag1"
            className="draggable-item"
            draggable="true"
            onDragStart={handleDragStart}
          >
            Drag Item 1
          </div>
          <div
            id="drag2"
            className="draggable-item"
            draggable="true"
            onDragStart={handleDragStart}
          >
            Drag Item 2
          </div>
          <div
            id="drag3"
            className="draggable-item"
            draggable="true"
            onDragStart={handleDragStart}
          >
            Drag Item 3
          </div>
        </div>

        {/* Right side for drop zones */}
        <div className="drop-zones">
          <div
            id="zone1"
            className="drop-zone"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "zone1")}
          >
            Drop Zone 1
          </div>
          <div
            id="zone2"
            className="drop-zone"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "zone2")}
          >
            Drop Zone 2
          </div>
          <div
            id="zone3"
            className="drop-zone"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "zone3")}
          >
            Drop Zone 3
          </div>
        </div>
      </div>
      <div className="dropped-message">{lastDroppedMessage}</div>
    </>
  );
};

export default DragAndDrop;
