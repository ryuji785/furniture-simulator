import type { ItemDefinition } from '../types';

export const GRID_SIZE = 10;
export const MIN_PASSAGE_WIDTH = 60;

export const ITEM_DEFINITIONS: ItemDefinition[] = [
  {
    id: 'single-bed',
    name: 'シングルベッド',
    category: 'furniture',
    widthCm: 100,
    depthCm: 200,
  },
  {
    id: 'semi-double-bed',
    name: 'セミダブルベッド',
    category: 'furniture',
    widthCm: 120,
    depthCm: 200,
  },
  {
    id: '2seat-sofa',
    name: '2人掛けソファ',
    category: 'furniture',
    widthCm: 150,
    depthCm: 80,
  },
  {
    id: 'desk',
    name: 'デスク',
    category: 'furniture',
    widthCm: 120,
    depthCm: 60,
  },
  {
    id: 'table',
    name: 'テーブル',
    category: 'furniture',
    widthCm: 120,
    depthCm: 75,
  },
  {
    id: 'tv-stand',
    name: 'テレビボード',
    category: 'furniture',
    widthCm: 120,
    depthCm: 40,
    supportsAppliances: true,
  },
  {
    id: 'bookshelf',
    name: '本棚',
    category: 'furniture',
    widthCm: 60,
    depthCm: 30,
  },
  {
    id: 'color-box',
    name: 'カラーボックス',
    category: 'furniture',
    widthCm: 42,
    depthCm: 29,
  },
  {
    id: 'microwave-rack',
    name: 'レンジラック',
    category: 'furniture',
    widthCm: 60,
    depthCm: 45,
    supportsAppliances: true,
  },
  {
    id: 'refrigerator',
    name: '冷蔵庫',
    category: 'appliance',
    widthCm: 60,
    depthCm: 65,
  },
  {
    id: 'microwave',
    name: '電子レンジ',
    category: 'appliance',
    widthCm: 50,
    depthCm: 40,
  },
  {
    id: 'toaster',
    name: 'オーブントースター',
    category: 'appliance',
    widthCm: 35,
    depthCm: 35,
  },
];

export const FURNITURE_ITEMS = ITEM_DEFINITIONS.filter(
  (item) => item.category === 'furniture'
);

export const APPLIANCE_ITEMS = ITEM_DEFINITIONS.filter(
  (item) => item.category === 'appliance'
);
