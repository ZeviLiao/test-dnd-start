import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, rectIntersection } from '@dnd-kit/core';
import './styles.css'; // 假设您有一个 CSS 文件用于样式

// DraggableItem 组件
const DraggableItem = ({ id, color, isOver, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: `translate3d(${(transform?.x || 0)}px, ${(transform?.y || 0)}px, 0)`,
    zIndex: isDragging ? 10 : 1, // 拖动时 z-index 为最高
    backgroundColor: isOver ? 'yellow' : color,
    border: isDragging ? '2px solid blue' : 'none', // 拖动时边框
    cursor: 'grab', // 添加手形光标
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
const DroppableArea = ({ id, children, position, isOver, isDragging }) => {
  const { setNodeRef } = useDroppable({ id });

  const style = {
    position: 'absolute',
    top: position.y,
    left: position.x,
    width: '100px',
    height: '100px',
    backgroundColor: isOver ? 'rgba(128,128,128,0.5)' : 'transparent', // 显示影子
    border: isOver ? '2px dashed gray' : 'none', // 被碰到时的边框
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
      {/* 添加影子元素 */}
      {isDragging && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(128, 128, 128, 0.3)', // 影子的颜色和透明度
            border: '2px dashed gray', // 影子的边框
            pointerEvents: 'none', // 使影子不干扰鼠标事件
          }}
        />
      )}
    </div>
  );
};

const App = () => {
  const [items] = useState([
    { id: 'item1', color: 'lightblue', position: { x: 50, y: 200 } }, // 左侧物体
    { id: 'item2', color: 'lightcoral', position: { x: 300, y: 200 } }, // 右侧物体
  ]);

  const [overlappingItem, setOverlappingItem] = useState(null);
  const [draggingItem, setDraggingItem] = useState(null); // 新增状态记录当前拖动的物体

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
    setDraggingItem(null); // 清空正在拖动的物体
  };

  const handleDragStart = (event) => {
    setDraggingItem(event.active.id); // 记录正在拖动的物体
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDragStart={handleDragStart} collisionDetection={rectIntersection}>
      {/* 渲染 DroppableArea 和 DraggableItem */}
      {items.map((item) => (
        <DroppableArea key={item.id} id={item.id} position={item.position} isOver={overlappingItem === item.id} isDragging={draggingItem === item.id}>
          <DraggableItem
            id={item.id}
            color={item.color}
            isOver={overlappingItem === item.id}
            isDragging={draggingItem === item.id}
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
