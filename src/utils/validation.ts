import type { FloorPlan, PlacedItem, Room } from '../types';
import { MIN_PASSAGE_WIDTH, ITEM_DEFINITIONS } from '../constants/items';
import { getItemBounds, boundsOverlap, boundsInside } from './geometry';

export function findRoomById(floorPlan: FloorPlan, roomId: string): Room | null {
  return floorPlan.rooms.find((r) => r.id === roomId) || null;
}

export function isItemInRoom(item: PlacedItem, room: Room): boolean {
  const bounds = getItemBounds(item);
  const roomBounds = { left: 0, top: 0, right: room.widthCm, bottom: room.depthCm };
  return boundsInside(bounds, roomBounds);
}

export function checkItemOverlapInRoom(
  item: PlacedItem,
  otherItems: PlacedItem[],
  roomId: string
): boolean {
  const bounds = getItemBounds(item);
  const itemsInRoom = otherItems.filter((i) => i.roomId === roomId && i.id !== item.id);

  for (const other of itemsInRoom) {
    const otherBounds = getItemBounds(other);
    if (boundsOverlap(bounds, otherBounds)) {
      return true;
    }
  }

  return false;
}

export function isApplianceSupported(
  appliance: PlacedItem,
  supportingItem: PlacedItem
): boolean {
  const applianceDef = ITEM_DEFINITIONS.find((d) => d.id === appliance.type);
  const supportDef = ITEM_DEFINITIONS.find((d) => d.id === supportingItem.type);

  if (!applianceDef || !supportDef) return false;
  if (applianceDef.category !== 'appliance') return false;
  if (!supportDef.supportsAppliances) return false;

  if (appliance.roomId !== supportingItem.roomId) return false;

  const applianceBounds = getItemBounds(appliance);
  const supportBounds = getItemBounds(supportingItem);

  return boundsInside(applianceBounds, supportBounds);
}

export function checkApplianceFloating(
  appliance: PlacedItem,
  allItems: PlacedItem[]
): boolean {
  const applianceDef = ITEM_DEFINITIONS.find((d) => d.id === appliance.type);
  if (!applianceDef || applianceDef.category !== 'appliance') return false;

  if (appliance.type === 'refrigerator') {
    return false;
  }

  const supportItems = allItems.filter(
    (item) => item.roomId === appliance.roomId && item.id !== appliance.id && ITEM_DEFINITIONS.find((d) => d.id === item.type)?.supportsAppliances
  );

  for (const supportItem of supportItems) {
    if (isApplianceSupported(appliance, supportItem)) {
      return false;
    }
  }

  return true;
}

export function getMinPassageBetweenItems(
  item: PlacedItem,
  otherItems: PlacedItem[],
  roomWidth: number,
  roomHeight: number,
  roomId: string
): number {
  const bounds = getItemBounds(item);
  let minPassage = Math.min(
    bounds.left,
    roomWidth - bounds.right,
    bounds.top,
    roomHeight - bounds.bottom
  );

  const itemsInRoom = otherItems.filter((i) => i.roomId === roomId && i.id !== item.id);

  for (const other of itemsInRoom) {
    const otherBounds = getItemBounds(other);

    if (bounds.right < otherBounds.left) {
      minPassage = Math.min(minPassage, otherBounds.left - bounds.right);
    }
    if (bounds.left > otherBounds.right) {
      minPassage = Math.min(minPassage, bounds.left - otherBounds.right);
    }
    if (bounds.bottom < otherBounds.top) {
      minPassage = Math.min(minPassage, otherBounds.top - bounds.bottom);
    }
    if (bounds.top > otherBounds.bottom) {
      minPassage = Math.min(minPassage, bounds.top - otherBounds.bottom);
    }
  }

  return minPassage;
}

export function canPlaceItem(
  item: PlacedItem,
  room: Room,
  _floorPlan: FloorPlan,
  allItems: PlacedItem[]
): boolean {
  const otherItems = allItems.filter((i) => i.id !== item.id);

  if (!isItemInRoom(item, room)) {
    return false;
  }

  if (checkItemOverlapInRoom(item, otherItems, room.id)) {
    return false;
  }

  const def = ITEM_DEFINITIONS.find((d) => d.id === item.type);
  if (!def) return false;

  if (def.category === 'appliance') {
    if (item.type !== 'refrigerator' && checkApplianceFloating(item, allItems)) {
      return false;
    }
  }

  const minPassage = getMinPassageBetweenItems(
    item,
    otherItems,
    room.widthCm,
    room.depthCm,
    room.id
  );

  if (minPassage < MIN_PASSAGE_WIDTH) {
    return false;
  }

  return true;
}
