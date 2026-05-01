import { useEffect, useState } from 'react';
import { formatLocal, formatUTC, localTimezoneLabel } from '../utils/time.js';
import styles from './DualClock.module.css';

export default function DualClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tz = localTimezoneLabel();

  return (
    <div className={styles.clock}>
      <div className={styles.cell}>
        <span className={styles.label}>UTC</span>
        <span className={styles.time}>{formatUTC(now)}</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.cell}>
        <span className={styles.label}>{tz}</span>
        <span className={styles.time}>{formatLocal(now)}</span>
      </div>
    </div>
  );
}
