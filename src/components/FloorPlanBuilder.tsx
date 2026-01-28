import { useState } from 'react';
import type { Room, FloorPlan, RoomType } from '../types';
import { calculateSingleRoomDimensions } from '../utils/roomCalculations';
import styles from './FloorPlanBuilder.module.css';

interface FloorPlanBuilderProps {
  onComplete: (floorPlan: FloorPlan) => void;
}

const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: 'living-room', label: 'リビング' },
  { value: 'bedroom', label: '寝室' },
  { value: 'kitchen', label: 'キッチン' },
  { value: 'bathroom', label: 'バスルーム' },
  { value: 'hallway', label: '廊下' },
  { value: 'closet', label: 'クローゼット' },
  { value: 'dining-room', label: 'ダイニング' },
];

const ROOM_COLORS: string[] = ['#fdd4a5', '#c5e8b7', '#b4d7ff', '#ffc9c9', '#e8d5f2', '#f5f5dc', '#ffe4e1'];

export function FloorPlanBuilder({ onComplete }: FloorPlanBuilderProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [step, setStep] = useState<'add' | 'layout' | 'preview'>(rooms.length > 0 ? 'layout' : 'add');
  const [newRoom, setNewRoom] = useState<{
    name: string;
    roomType: RoomType;
    tsubo: number;
    color: string;
  }>({
    name: 'リビング',
    roomType: 'living-room',
    tsubo: 10,
    color: ROOM_COLORS[0],
  });

  const handleAddRoom = () => {
    if (!newRoom.name.trim()) return;

    const dimensions = calculateSingleRoomDimensions(newRoom.tsubo);
    const newRoomObj: Room = {
      id: `room-${Date.now()}`,
      name: newRoom.name,
      roomType: newRoom.roomType,
      tsubo: newRoom.tsubo,
      widthCm: dimensions.widthCm,
      depthCm: dimensions.depthCm,
      xCm: rooms.length === 0 ? 0 : (rooms[rooms.length - 1].xCm + rooms[rooms.length - 1].widthCm + 50),
      yCm: 0,
      color: newRoom.color,
    };

    const updatedRooms = [...rooms, newRoomObj];
    setRooms(updatedRooms);
    setNewRoom({
      name: '',
      roomType: 'bedroom',
      tsubo: 6,
      color: ROOM_COLORS[(updatedRooms.length) % ROOM_COLORS.length],
    });

    if (updatedRooms.length >= 2) {
      setStep('layout');
    }
  };

  const handleRemoveRoom = (id: string) => {
    const updated = rooms.filter((r) => r.id !== id);
    setRooms(updated);
    if (updated.length === 0) {
      setStep('add');
    }
  };

  const handleUpdateRoomPosition = (id: string, xCm: number, yCm: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === id ? { ...room, xCm: Math.max(0, xCm), yCm: Math.max(0, yCm) } : room
      )
    );
  };

  const handleComplete = () => {
    const floorPlan: FloorPlan = {
      id: `plan-${Date.now()}`,
      name: '私の間取り',
      rooms,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onComplete(floorPlan);
  };

  const totalWidth = rooms.length > 0 ? Math.max(...rooms.map((r) => r.xCm + r.widthCm)) : 0;
  const totalHeight = rooms.length > 0 ? Math.max(...rooms.map((r) => r.yCm + r.depthCm)) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>間取りビルダー</h1>
      </div>

      {step === 'add' && (
        <div className={styles.addRoomPanel}>
          <h2>新しい部屋を追加</h2>
          <div className={styles.formGroup}>
            <label>部屋の名前</label>
            <input
              type="text"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              placeholder="例：リビング"
            />
          </div>

          <div className={styles.formGroup}>
            <label>部屋のタイプ</label>
            <select
              value={newRoom.roomType}
              onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value as RoomType })}
            >
              {ROOM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>
              広さ（帖） {newRoom.tsubo}帖
            </label>
            <input
              type="range"
              min="2"
              max="30"
              value={newRoom.tsubo}
              onChange={(e) => setNewRoom({ ...newRoom, tsubo: Number(e.target.value) })}
              className={styles.slider}
            />
          </div>

          <div className={styles.formGroup}>
            <label>色</label>
            <div className={styles.colorPicker}>
              {ROOM_COLORS.map((color) => (
                <button
                  key={color}
                  className={`${styles.colorOption} ${newRoom.color === color ? styles.selected : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewRoom({ ...newRoom, color })}
                />
              ))}
            </div>
          </div>

          <div className={styles.buttons}>
            <button className={styles.addBtn} onClick={handleAddRoom}>
              この部屋を追加
            </button>
          </div>

          {rooms.length > 0 && (
            <div className={styles.roomList}>
              <h3>追加済みの部屋（{rooms.length}個）</h3>
              <ul>
                {rooms.map((room) => (
                  <li key={room.id}>
                    <span style={{ backgroundColor: room.color }} className={styles.roomDot}></span>
                    {room.name} ({room.tsubo}帖)
                    <button className={styles.removeBtn} onClick={() => handleRemoveRoom(room.id)}>
                      削除
                    </button>
                  </li>
                ))}
              </ul>
              {rooms.length >= 2 && (
                <button className={styles.nextBtn} onClick={() => setStep('layout')}>
                  レイアウト編集へ
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {step === 'layout' && (
        <div className={styles.layoutPanel}>
          <h2>部屋の配置を調整</h2>
          <div className={styles.canvasContainer}>
            <svg
              viewBox={`-20 -20 ${totalWidth + 40} ${totalHeight + 40}`}
              className={styles.layoutCanvas}
            >
              {rooms.map((room) => (
                <g key={room.id} className={styles.roomGroup}>
                  <rect
                    x={room.xCm}
                    y={room.yCm}
                    width={room.widthCm}
                    height={room.depthCm}
                    fill={room.color}
                    stroke="#333"
                    strokeWidth="2"
                  />
                  <text
                    x={room.xCm + room.widthCm / 2}
                    y={room.yCm + room.depthCm / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill="#333"
                    pointerEvents="none"
                  >
                    {room.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className={styles.positionControls}>
            {rooms.map((room) => (
              <div key={room.id} className={styles.roomControl}>
                <h4>{room.name}</h4>
                <div className={styles.controlGrid}>
                  <label>
                    X: {room.xCm}cm
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="10"
                      value={room.xCm}
                      onChange={(e) => handleUpdateRoomPosition(room.id, Number(e.target.value), room.yCm)}
                    />
                  </label>
                  <label>
                    Y: {room.yCm}cm
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="10"
                      value={room.yCm}
                      onChange={(e) => handleUpdateRoomPosition(room.id, room.xCm, Number(e.target.value))}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.buttons}>
            <button className={styles.backBtn} onClick={() => setStep('add')}>
              戻る
            </button>
            <button className={styles.nextBtn} onClick={() => setStep('preview')}>
              確認へ
            </button>
          </div>
        </div>
      )}

      {step === 'preview' && (
        <div className={styles.previewPanel}>
          <h2>間取りプレビュー</h2>
          <div className={styles.previewCanvas}>
            <svg viewBox={`-20 -20 ${totalWidth + 40} ${totalHeight + 40}`} className={styles.layoutCanvas}>
              {rooms.map((room) => (
                <g key={room.id}>
                  <rect
                    x={room.xCm}
                    y={room.yCm}
                    width={room.widthCm}
                    height={room.depthCm}
                    fill={room.color}
                    stroke="#333"
                    strokeWidth="2"
                  />
                  <text
                    x={room.xCm + room.widthCm / 2}
                    y={room.yCm + 25}
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight="bold"
                    fill="#333"
                  >
                    {room.name}
                  </text>
                  <text
                    x={room.xCm + room.widthCm / 2}
                    y={room.yCm + room.depthCm - 15}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#666"
                  >
                    {room.tsubo}帖 ({room.widthCm}cm x {room.depthCm}cm)
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className={styles.summary}>
            <h3>間取り情報</h3>
            <p>総部屋数: {rooms.length}個</p>
            <p>総広さ: {rooms.reduce((sum, r) => sum + (r.tsubo || 0), 0)}帖</p>
            <ul>
              {rooms.map((room) => (
                <li key={room.id}>
                  {room.name}: {room.tsubo}帖
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.buttons}>
            <button className={styles.backBtn} onClick={() => setStep('layout')}>
              戻る
            </button>
            <button className={styles.completeBtn} onClick={handleComplete}>
              この間取りで開始
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
