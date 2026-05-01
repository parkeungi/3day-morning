import { useTracker } from '../store/TrackerContext.jsx';
import styles from './TrafficCounter.module.css';

export default function TrafficCounter() {
  const { state, dispatch } = useTracker();
  const total = state.shift.totalTraffic;

  return (
    <div className={styles.wrap}>
      <div className={styles.display}>
        <span className={styles.value}>{String(total).padStart(3, '0')}</span>
        <span className={styles.unit}>aircraft</span>
      </div>
      <div className={styles.actions}>
        <button onClick={() => dispatch({ type: 'TRAFFIC_DECREMENT' })}>−</button>
        <button onClick={() => dispatch({ type: 'TRAFFIC_INCREMENT' })}>+</button>
      </div>
    </div>
  );
}
