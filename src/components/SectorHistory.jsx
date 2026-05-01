import { useTracker } from '../store/TrackerContext.jsx';
import { diffMs, formatDuration, formatUTCShort, nowISO } from '../utils/time.js';
import styles from './SectorHistory.module.css';

export default function SectorHistory() {
  const { state } = useTracker();
  const logs = state.sectorLogs;

  if (logs.length === 0) {
    return <div className={styles.empty}>섹터 이력 없음</div>;
  }

  return (
    <ul className={styles.list}>
      {logs.map((log) => {
        const dur = diffMs(log.loginTime, log.logoutTime || nowISO());
        const live = !log.logoutTime;
        return (
          <li key={log.id} className={`${styles.item} ${live ? styles.live : ''}`}>
            <div className={styles.head}>
              <strong>{log.sectorName}</strong>
              <span className={styles.role}>{log.role}</span>
              {live && <span className={styles.liveTag}>● LIVE</span>}
            </div>
            <div className={styles.meta}>
              <span>{formatUTCShort(log.loginTime)}</span>
              <span className={styles.arrow}>→</span>
              <span>{log.logoutTime ? formatUTCShort(log.logoutTime) : '...'}</span>
              <span className={styles.dur}>{formatDuration(dur)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
