import { useRef, useEffect, useState, useCallback } from 'react';
import type { FloorPlan, PlacedItem, Room } from '../types';
import { getItemSize, snapToGrid, getRoomBounds } from '../utils/geometry';
import { canPlaceItem, findRoomById } from '../utils/validation';
import { ITEM_DEFINITIONS } from '../constants/items';
import styles from './FloorPlanCanvas.module.css';

interface FloorPlanCanvasProps {
  floorPlan: FloorPlan;
  placedItems: PlacedItem[];
  selectedItem: PlacedItem | null;
  onItemSelect: (item: PlacedItem | null) => void;
  onItemMove: (itemId: string, roomId: string, x: number, y: number) => void;
  onItemRotate: (itemId: string) => void;
}

export function FloorPlanCanvas({
  floorPlan,
  placedItems,
  selectedItem,
  onItemSelect,
  onItemMove,
  onItemRotate,
}: FloorPlanCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState('0 0 800 600');
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const totalWidth = floorPlan.rooms.length > 0
    ? Math.max(...floorPlan.rooms.map((r) => r.xCm + r.widthCm))
    : 100;
  const totalHeight = floorPlan.rooms.length > 0
    ? Math.max(...floorPlan.rooms.map((r) => r.yCm + r.depthCm))
    : 100;

  useEffect(() => {
    const updateViewBox = () => {
      const padding = 40;
      setViewBox(
        `${-padding} ${-padding} ${totalWidth + padding * 2} ${totalHeight + padding * 2}`
      );
    };

    updateViewBox();
  }, [totalWidth, totalHeight]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, item: PlacedItem) => {
      e.stopPropagation();

      const svg = svgRef.current;
      if (!svg) return;

      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const screenCTM = svg.getScreenCTM();
      if (!screenCTM) return;

      const svgPt = pt.matrixTransform(screenCTM.inverse());
      const room = findRoomById(floorPlan, item.roomId);
      if (!room) return;

      dragOffsetRef.current = { x: svgPt.x - (room.xCm + item.x), y: svgPt.y - (room.yCm + item.y) };
      setDraggedItemId(item.id);
      onItemSelect(item);
    },
    [floorPlan, onItemSelect]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggedItemId || !svgRef.current) return;

      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const screenCTM = svg.getScreenCTM();
      if (!screenCTM) return;

      const svgPt = pt.matrixTransform(screenCTM.inverse());
      const draggedItem = placedItems.find((i) => i.id === draggedItemId);
      if (!draggedItem) return;

      const targetRoom = floorPlan.rooms.find((room) => {
        const bounds = getRoomBounds(room);
        return svgPt.x >= bounds.left && svgPt.x <= bounds.right &&
               svgPt.y >= bounds.top && svgPt.y <= bounds.bottom;
      });

      if (!targetRoom) return;

      const newX = snapToGrid(svgPt.x - targetRoom.xCm - dragOffsetRef.current.x);
      const newY = snapToGrid(svgPt.y - targetRoom.yCm - dragOffsetRef.current.y);

      const testItem = { ...draggedItem, x: newX, y: newY, roomId: targetRoom.id };
      if (canPlaceItem(testItem, targetRoom, floorPlan, placedItems)) {
        onItemMove(draggedItemId, targetRoom.id, newX, newY);
      }
    },
    [draggedItemId, floorPlan, placedItems, onItemMove]
  );

  const handlePointerUp = useCallback(() => {
    setDraggedItemId(null);
  }, []);

  const handleItemClick = (e: React.MouseEvent, item: PlacedItem) => {
    e.stopPropagation();
    if (!draggedItemId) {
      if (selectedItem?.id === item.id) {
        onItemRotate(item.id);
      } else {
        onItemSelect(item);
      }
    }
  };

  const handleCanvasClick = () => {
    onItemSelect(null);
  };

  const renderRoom = (room: Room) => {
    const def = ROOM_TYPE_COLORS[room.roomType] || '#fafafa';
    return (
      <g key={room.id}>
        <rect
          x={room.xCm}
          y={room.yCm}
          width={room.widthCm}
          height={room.depthCm}
          fill={room.color || def}
          stroke="#333"
          strokeWidth={2}
        />
        <text
          x={room.xCm + room.widthCm / 2}
          y={room.yCm + 25}
          textAnchor="middle"
          fontSize={14}
          fontWeight="bold"
          fill="#333"
          pointerEvents="none"
        >
          {room.name}
        </text>
        <text
          x={room.xCm + room.widthCm / 2}
          y={room.yCm + room.depthCm - 15}
          textAnchor="middle"
          fontSize={12}
          fill="#666"
          pointerEvents="none"
        >
          {room.tsubo ? `${room.tsubo}帖` : ''}
        </text>
      </g>
    );
  };

  const renderItem = (item: PlacedItem) => {
    const room = findRoomById(floorPlan, item.roomId);
    if (!room) return null;

    const def = ITEM_DEFINITIONS.find((d) => d.id === item.type);
    if (!def) return null;

    const size = getItemSize(item);
    const isSelected = selectedItem?.id === item.id;
    const color = def.category === 'furniture' ? '#d4a574' : '#4a90e2';
    const strokeColor = isSelected ? '#ff6b6b' : '#333';
    const strokeWidth = isSelected ? 3 : 1.5;

    const globalX = room.xCm + item.x;
    const globalY = room.yCm + item.y;

    return (
      <g
        key={item.id}
        className={styles.itemGroup}
        onPointerDown={(e) => handlePointerDown(e, item)}
        onClick={(e) => handleItemClick(e, item)}
      >
        <rect
          x={globalX}
          y={globalY}
          width={size.widthCm}
          height={size.depthCm}
          fill={color}
          fillOpacity={0.75}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          rx={2}
        />
        <text
          x={globalX + size.widthCm / 2}
          y={globalY + size.depthCm / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fontWeight="600"
          fill="#fff"
          pointerEvents="none"
        >
          {def.name}
        </text>
      </g>
    );
  };

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      className={styles.canvas}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleCanvasClick}
    >
      <defs>
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#f0f0f0" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect x={-100} y={-100} width={totalWidth + 200} height={totalHeight + 200} fill="url(#grid)" />

      {floorPlan.rooms.map((room) => renderRoom(room))}
      {placedItems.map((item) => renderItem(item))}
    </svg>
  );
}

const ROOM_TYPE_COLORS: Record<string, string> = {
  'living-room': '#fdd4a5',
  'bedroom': '#c5e8b7',
  'kitchen': '#b4d7ff',
  'bathroom': '#ffc9c9',
  'hallway': '#e8d5f2',
  'closet': '#f5f5dc',
  'dining-room': '#ffe4e1',
};
