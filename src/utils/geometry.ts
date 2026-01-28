import type { ItemType, PlacedItem, Room } from '../types';
import { ITEM_DEFINITIONS, GRID_SIZE } from '../constants/items';

export interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Size {
  widthCm: number;
  depthCm: number;
}

export function getItemDefinition(type: ItemType) {
  return ITEM_DEFINITIONS.find((def) => def.id === type);
}

export function getItemSize(item: PlacedItem): Size {
  const def = getItemDefinition(item.type);
  if (!def) return { widthCm: 0, depthCm: 0 };

  if (item.rotation === 90 || item.rotation === 270) {
    return { widthCm: def.depthCm, depthCm: def.widthCm };
  }

  return { widthCm: def.widthCm, depthCm: def.depthCm };
}

export function getItemBounds(item: PlacedItem): Bounds {
  const size = getItemSize(item);
  return {
    left: item.x,
    top: item.y,
    right: item.x + size.widthCm,
    bottom: item.y + size.depthCm,
  };
}

export function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function boundsOverlap(bounds1: Bounds, bounds2: Bounds, margin: number = 0): boolean {
  return !(
    bounds1.right + margin <= bounds2.left ||
    bounds2.right + margin <= bounds1.left ||
    bounds1.bottom + margin <= bounds2.top ||
    bounds2.bottom + margin <= bounds1.top
  );
}

export function boundsInside(
  bounds: Bounds,
  container: Bounds,
  margin: number = 0
): boolean {
  return (
    bounds.left + margin >= container.left &&
    bounds.top + margin >= container.top &&
    bounds.right - margin <= container.right &&
    bounds.bottom - margin <= container.bottom
  );
}

export function boundsDistance(bounds1: Bounds, bounds2: Bounds): number {
  let dx = 0;
  let dy = 0;

  if (bounds1.right < bounds2.left) {
    dx = bounds2.left - bounds1.right;
  } else if (bounds2.right < bounds1.left) {
    dx = bounds1.left - bounds2.right;
  }

  if (bounds1.bottom < bounds2.top) {
    dy = bounds2.top - bounds1.bottom;
  } else if (bounds2.bottom < bounds1.top) {
    dy = bounds1.top - bounds2.bottom;
  }

  return Math.sqrt(dx * dx + dy * dy);
}

export function getRoomBounds(room: Room): Bounds {
  return {
    left: room.xCm,
    top: room.yCm,
    right: room.xCm + room.widthCm,
    bottom: room.yCm + room.depthCm,
  };
}

export function getItemGlobalBounds(item: PlacedItem, room: Room): Bounds {
  const size = getItemSize(item);
  return {
    left: room.xCm + item.x,
    top: room.yCm + item.y,
    right: room.xCm + item.x + size.widthCm,
    bottom: room.yCm + item.y + size.depthCm,
  };
}
