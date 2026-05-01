import { useTracker } from '../store/TrackerContext.jsx';
import { formatUTCShort } from '../utils/time.js';
import styles from './RemarkTimeline.module.css';

export default function RemarkTimeline() {
  const { state, dispatch } = useTracker();
  const remarks = state.remarks;

  if (remarks.length === 0) {
    return <div className={styles.empty}>기록된 특이사항 없음</div>;
  }

  return (
    <ul className={styles.list}>
      {remarks.map((r) => (
        <li key={r.id} className={styles.item}>
          <span className={styles.time}>{formatUTCShort(r.timestamp)}</span>
          <span className={styles.dot}>•</span>
          <span className={styles.content}>{r.content}</span>
          <button
            className={styles.del}
            onClick={() =>
              dispatch({ type: 'REMARK_DELETE', payload: { id: r.id } })
            }
            aria-label="Delete remark"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
