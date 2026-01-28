import { useState } from 'react';
import type { ItemCategory, ItemType } from '../types';
import { FURNITURE_ITEMS, APPLIANCE_ITEMS } from '../constants/items';
import styles from './ItemList.module.css';

interface ItemListProps {
  onAddItem: (itemType: ItemType) => void;
}

export function ItemList({ onAddItem }: ItemListProps) {
  const [activeTab, setActiveTab] = useState<ItemCategory>('furniture');

  const items = activeTab === 'furniture' ? FURNITURE_ITEMS : APPLIANCE_ITEMS;

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'furniture' ? styles.active : ''}`}
          onClick={() => setActiveTab('furniture')}
        >
          家具
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'appliance' ? styles.active : ''}`}
          onClick={() => setActiveTab('appliance')}
        >
          家電
        </button>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <button
            key={item.id}
            className={styles.itemButton}
            onClick={() => onAddItem(item.id)}
          >
            <div className={styles.itemName}>{item.name}</div>
            <div className={styles.itemSize}>
              {item.widthCm}×{item.depthCm}cm
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
