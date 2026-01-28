import { useState } from 'react';
import styles from './RoomSetup.module.css';

interface RoomSetupProps {
  onComplete: (ldkTsubo: number, westernTsubo: number) => void;
}

export function RoomSetup({ onComplete }: RoomSetupProps) {
  const [ldkTsubo, setLdkTsubo] = useState(10);
  const [westernTsubo, setWesternTsubo] = useState(6);

  const handleStart = () => {
    if (ldkTsubo >= 6 && ldkTsubo <= 20 && westernTsubo >= 4 && westernTsubo <= 12) {
      onComplete(ldkTsubo, westernTsubo);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>間取り設定</h1>

        <div className={styles.setting}>
          <label className={styles.label}>LDK</label>
          <div className={styles.inputGroup}>
            <input
              type="range"
              min="6"
              max="20"
              value={ldkTsubo}
              onChange={(e) => setLdkTsubo(Number(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.value}>{ldkTsubo}帖</span>
          </div>
        </div>

        <div className={styles.setting}>
          <label className={styles.label}>洋室</label>
          <div className={styles.inputGroup}>
            <input
              type="range"
              min="4"
              max="12"
              value={westernTsubo}
              onChange={(e) => setWesternTsubo(Number(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.value}>{westernTsubo}帖</span>
          </div>
        </div>

        <button className={styles.button} onClick={handleStart}>
          配置を始める
        </button>
      </div>
    </div>
  );
}
