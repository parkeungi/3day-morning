import { useEffect, useState } from 'react';
import { useTracker } from '../store/TrackerContext.jsx';
import { formatUTCShort } from '../utils/time.js';
import styles from './FlightStripCard.module.css';

const STATUS_FLOW = {
  pending: { next: 'in_progress', label: 'Start' },
  in_progress: { next: 'done', label: 'Complete' },
  done: { next: 'pending', label: 'Reopen' },
};

function urgencyLevel(targetTimeISO, status) {
  if (!targetTimeISO || status === 'done') return 'none';
  const remaining = new Date(targetTimeISO).getTime() - Date.now();
  if (remaining < 0) return 'over';
  if (remaining <= 60_000) return 'critical';
  if (remaining <= 5 * 60_000) return 'warn';
  return 'none';
}

function formatRemaining(ms) {
  const sign = ms < 0 ? '-' : '+';
  const abs = Math.abs(ms);
  const m = Math.floor(abs / 60000);
  const s = Math.floor((abs % 60000) / 1000);
  return `${sign}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function FlightStripCard({ task }) {
  const { dispatch } = useTracker();
  const [, setTick] = useState(0);

  useEffect(() => {
    if (task.status === 'done' || !task.targetTime) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [task.status, task.targetTime]);

  const urgency = urgencyLevel(task.targetTime, task.status);
  const remainingMs = task.targetTime
    ? new Date(task.targetTime).getTime() - Date.now()
    : null;

  const flow = STATUS_FLOW[task.status];

  return (
    <article
      className={[
        styles.card,
        styles[`status_${task.status}`],
        styles[`prio_${task.priority}`],
        styles[`urgency_${urgency}`],
      ].join(' ')}
    >
      <div className={styles.head}>
        <span className={styles.callsign}>{task.callsign}</span>
        <span className={styles.type}>{task.taskType}</span>
        {task.priority === 'emergency' && (
          <span className={styles.badge_emergency}>EMERGENCY</span>
        )}
        {task.priority === 'caution' && (
          <span className={styles.badge_caution}>CAUTION</span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.timeBlock}>
          <span className={styles.label}>TARGET</span>
          <span className={styles.time}>{formatUTCShort(task.targetTime)}</span>
        </div>
        {task.targetTime && task.status !== 'done' && (
          <div className={styles.timeBlock}>
            <span className={styles.label}>T</span>
            <span className={styles.remaining}>{formatRemaining(remainingMs)}</span>
          </div>
        )}
        {task.status === 'done' && task.completedAt && (
          <div className={styles.timeBlock}>
            <span className={styles.label}>DONE</span>
            <span className={styles.time}>{formatUTCShort(task.completedAt)}</span>
          </div>
        )}
        <div className={styles.statusPill}>{task.status.replace('_', ' ')}</div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.advance}
          onClick={() =>
            dispatch({
              type: 'TASK_SET_STATUS',
              payload: { id: task.id, status: flow.next },
            })
          }
        >
          {flow.label}
        </button>
        <button
          className={styles.delete}
          onClick={() =>
            dispatch({ type: 'TASK_DELETE', payload: { id: task.id } })
          }
          aria-label="Delete strip"
        >
          ✕
        </button>
      </div>
    </article>
  );
}
