import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, rectIntersection } from '@dnd-kit/core';

// DraggableItem 组件
const DraggableItem = ({ id, initialPosition, color, isOver, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: `translate3d(${(transform?.x || 0)}px, ${(transform?.y || 0)}px, 0)`,
    width: 100,
    height: 100,
    backgroundColor: isOver ? 'yellow' : color, // 碰撞時變色
    position: 'absolute',
    zIndex: isDragging ? 10 : 1, // 拖動時 zIndex 提升
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {id}
    </div>
  );
};

// DroppableArea 组件
const DroppableArea = ({ id, initialPosition, color, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const style = {
    width: 100,
    height: 100,
    backgroundColor: isOver ? 'gray' : color, // 当物件拖到这里时显示影子
    position: 'absolute',
    top: initialPosition.y,
    left: initialPosition.x,
    opacity: 0.3, // 影子效果的透明度
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

const App = () => {
  const [items, setItems] = useState([
    { id: 'item1', initialPosition: { x: 50, y: 200 }, color: 'lightblue' },
    { id: 'item2', initialPosition: { x: 300, y: 200 }, color: 'lightcoral' },
  ]);
  const [overlappingItem, setOverlappingItem] = useState(null); // 用来追踪碰撞物件

  const handleDragOver = (event) => {
    const { active, over } = event;

    // 檢測拖動物件是否與其他物件相交
    if (over && active.id !== over.id) {
      setOverlappingItem(over.id); // 紀錄相交的物件 ID
    } else {
      setOverlappingItem(null); // 沒有相交時清空
    }
  };

  const handleDragEnd = (event) => {
    // 处理拖动结束后的逻辑（例如更新位置等）
    console.log('Drag ended:', event);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver} collisionDetection={rectIntersection}>
      {items.map((item) => (
        <DroppableArea key={item.id} id={item.id} initialPosition={item.initialPosition} color={item.color}>
          <DraggableItem
            key={item.id}
            id={item.id}
            initialPosition={item.initialPosition}
            color={item.color}
            isOver={overlappingItem === item.id} // 判斷是否發生碰撞
            isDragging={item.id === overlappingItem} // 被抓取狀態
          />
        </DroppableArea>
      ))}
      
      {/* 碰撞提示 */}
      {overlappingItem && <div style={{ position: 'absolute', top: 350 }}>Overlay detected with {overlappingItem}!</div>}
    </DndContext>
  );
};

export default App;
