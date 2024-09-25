import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, rectIntersection } from '@dnd-kit/core';
import './styles.css'; // 假设您有一个 CSS 文件用于样式

// DraggableItem 组件
const DraggableItem = ({ id, color, isOver, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: `translate3d(${(transform?.x || 0)}px, ${(transform?.y || 0)}px, 0)`,
    zIndex: isDragging ? 1 : 10, // 拖动时 z-index 为最低
    backgroundColor: isOver ? 'yellow' : color,
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

// DroppableArea 组件
const DroppableArea = ({ id, children, position, isOver }) => {
  const { setNodeRef } = useDroppable({ id });

  const style = {
    position: 'absolute',
    top: position.y,
    left: position.x,
    width: '100px',
    height: '100px',
    backgroundColor: isOver ? 'rgba(128,128,128,0.5)' : 'transparent', // 当物件拖到这里时显示影子
    border: isOver ? '2px dashed gray' : 'none', // 显示占位符边框
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

const App = () => {
  const [items] = useState([
    { id: 'item1', color: 'lightblue', position: { x: 50, y: 200 } }, // 左侧物体
    { id: 'item2', color: 'lightcoral', position: { x: 300, y: 200 } }, // 右侧物体
  ]);
  
  const [overlappingItem, setOverlappingItem] = useState(null);

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOverlappingItem(over.id);
    } else {
      setOverlappingItem(null);
    }
  };

  const handleDragEnd = (event) => {
    console.log('Drag ended:', event);
    setOverlappingItem(null); // 拖动结束后重置重叠状态
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver} collisionDetection={rectIntersection}>
      {/* 渲染 DroppableArea 和 DraggableItem */}
      {items.map((item) => (
        <DroppableArea key={item.id} id={item.id} position={item.position} isOver={overlappingItem === item.id}>
          <DraggableItem
            id={item.id}
            color={item.color}
            isOver={overlappingItem === item.id}
            isDragging={item.id === overlappingItem}
          />
        </DroppableArea>
      ))}

      {/* 碰撞提示 */}
      {overlappingItem && (
        <div className="overlay">
          Overlay detected with {overlappingItem}!
        </div>
      )}
    </DndContext>
  );
};

export default App;