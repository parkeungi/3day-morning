import { useState } from 'react';
import { useTracker } from '../store/TrackerContext.jsx';
import { fromLocalInputValue, toLocalInputValue } from '../utils/time.js';
import styles from './AddFlightStripForm.module.css';

const TASK_TYPES = [
  { value: 'Departure', label: '출항' },
  { value: 'Arrival', label: '도착' },
  { value: 'Handoff', label: '관제이양' },
  { value: 'Coordination', label: '협조' },
  { value: 'Holding', label: '대기' },
];
const PRIORITIES = [
  { value: 'normal', label: '일반' },
  { value: 'caution', label: '주의' },
  { value: 'emergency', label: '비상' },
];

export default function AddFlightStripForm() {
  const { dispatch } = useTracker();
  const [callsign, setCallsign] = useState('');
  const [taskType, setTaskType] = useState(TASK_TYPES[0].value);
  const [targetLocal, setTargetLocal] = useState(() => {
    const d = new Date(Date.now() + 5 * 60 * 1000);
    return toLocalInputValue(d);
  });
  const [priority, setPriority] = useState('normal');

  const submit = (e) => {
    e.preventDefault();
    if (!callsign.trim()) return;
    dispatch({
      type: 'TASK_ADD',
      payload: {
        callsign: callsign.trim(),
        taskType,
        targetTime: fromLocalInputValue(targetLocal),
        priority,
      },
    });
    setCallsign('');
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <input
        className={styles.callsign}
        placeholder="콜사인 (예: KAL123)"
        value={callsign}
        onChange={(e) => setCallsign(e.target.value.toUpperCase())}
        maxLength={10}
        title="항공기 호출 부호. 영문 + 숫자 (10자 이내)"
      />
      <select
        value={taskType}
        onChange={(e) => setTaskType(e.target.value)}
        title="처리할 업무 유형"
        className={styles.type}
      >
        {TASK_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <input
        type="datetime-local"
        value={targetLocal}
        onChange={(e) => setTargetLocal(e.target.value)}
        title="목표 처리 시각 (현지 시각)"
        className={styles.time}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        title="우선순위 — 비상은 빨강, 주의는 주황으로 강조"
        className={styles.prio}
        data-prio={priority}
      >
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
      <button type="submit" className={styles.add} disabled={!callsign.trim()}>
        + 추가
      </button>
    </form>
  );
}
