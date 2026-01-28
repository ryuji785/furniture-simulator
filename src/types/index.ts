export type ItemCategory = 'furniture' | 'appliance';

export type FurnitureType =
  | 'single-bed'
  | 'semi-double-bed'
  | '2seat-sofa'
  | 'desk'
  | 'table'
  | 'tv-stand'
  | 'bookshelf'
  | 'color-box'
  | 'microwave-rack';

export type ApplianceType = 'refrigerator' | 'microwave' | 'toaster';

export type ItemType = FurnitureType | ApplianceType;

export type RoomType = 'living-room' | 'bedroom' | 'kitchen' | 'bathroom' | 'hallway' | 'closet' | 'dining-room';

export interface ItemDefinition {
  id: ItemType;
  name: string;
  category: ItemCategory;
  widthCm: number;
  depthCm: number;
  supportsAppliances?: boolean;
}

export interface PlacedItem {
  id: string;
  type: ItemType;
  roomId: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
}

export interface Room {
  id: string;
  name: string;
  roomType: RoomType;
  tsubo?: number;
  widthCm: number;
  depthCm: number;
  xCm: number;
  yCm: number;
  color?: string;
}

export interface FloorPlan {
  id: string;
  name: string;
  rooms: Room[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomAdjacency {
  roomId1: string;
  roomId2: string;
  sharedWallType: 'horizontal' | 'vertical';
  doorPosition?: { xCm: number; yCm: number };
}

export interface ValidationError {
  type: 'out-of-bounds' | 'overlap' | 'passage-too-narrow' | 'appliance-floating' | 'appliance-out-of-furniture';
  message: string;
}
