import { useState } from 'react';
import { FloorPlanBuilder } from './components/FloorPlanBuilder';
import { FloorPlanCanvas } from './components/FloorPlanCanvas';
import { ItemList } from './components/ItemList';
import type { FloorPlan, PlacedItem, ItemType } from './types';
import { canPlaceItem, findRoomById } from './utils/validation';
import { snapToGrid } from './utils/geometry';
import './App.css';

function App() {
  const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PlacedItem | null>(null);

  const handleFloorPlanComplete = (plan: FloorPlan) => {
    setFloorPlan(plan);
    setPlacedItems([]);
    setSelectedItem(null);
  };

  const handleAddItem = (itemType: ItemType) => {
    if (!floorPlan || floorPlan.rooms.length === 0) return;

    const firstRoom = floorPlan.rooms[0];
    const newItem: PlacedItem = {
      id: `${itemType}-${Date.now()}`,
      type: itemType,
      roomId: firstRoom.id,
      x: snapToGrid(50),
      y: snapToGrid(50),
      rotation: 0,
    };

    const newItems = [...placedItems, newItem];
    if (canPlaceItem(newItem, firstRoom, floorPlan, newItems)) {
      setPlacedItems(newItems);
      setSelectedItem(newItem);
    }
  };

  const handleItemMove = (itemId: string, roomId: string, x: number, y: number) => {
    if (!floorPlan) return;

    setPlacedItems((items) => {
      const movedItem = items.find((i) => i.id === itemId);
      if (!movedItem) return items;

      const targetRoom = findRoomById(floorPlan, roomId);
      if (!targetRoom) return items;

      const testItem = { ...movedItem, x, y, roomId };
      if (canPlaceItem(testItem, targetRoom, floorPlan, items)) {
        return items.map((i) => (i.id === itemId ? testItem : i));
      }

      return items;
    });
  };

  const handleItemRotate = (itemId: string) => {
    if (!floorPlan) return;

    setPlacedItems((items) => {
      const rotatedItem = items.find((i) => i.id === itemId);
      if (!rotatedItem) return items;

      const room = findRoomById(floorPlan, rotatedItem.roomId);
      if (!room) return items;

      const testItem = {
        ...rotatedItem,
        rotation: ((rotatedItem.rotation + 90) % 360) as 0 | 90 | 180 | 270,
      };

      if (canPlaceItem(testItem, room, floorPlan, items)) {
        return items.map((i) => (i.id === itemId ? testItem : i));
      }

      return items;
    });
  };

  const handleItemSelect = (item: PlacedItem | null) => {
    setSelectedItem(item);
  };

  const handleDeleteItem = () => {
    if (selectedItem) {
      setPlacedItems((items) => items.filter((i) => i.id !== selectedItem.id));
      setSelectedItem(null);
    }
  };

  const handleReset = () => {
    setFloorPlan(null);
    setPlacedItems([]);
    setSelectedItem(null);
  };

  if (!floorPlan) {
    return <FloorPlanBuilder onComplete={handleFloorPlanComplete} />;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>家具配置シミュレーション</h1>
        <div className="header-actions">
          {selectedItem && (
            <button className="deleteBtn" onClick={handleDeleteItem}>
              削除
            </button>
          )}
          <button className="resetBtn" onClick={handleReset}>
            間取り編集
          </button>
        </div>
      </header>

      <div className="canvas-container">
        <FloorPlanCanvas
          floorPlan={floorPlan}
          placedItems={placedItems}
          selectedItem={selectedItem}
          onItemSelect={handleItemSelect}
          onItemMove={handleItemMove}
          onItemRotate={handleItemRotate}
        />
      </div>

      <div className="item-list-container">
        <ItemList onAddItem={handleAddItem} />
      </div>
    </div>
  );
}

export default App;
