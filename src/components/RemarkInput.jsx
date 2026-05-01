import { useEffect, useState } from 'react';
import { useTracker } from '../store/TrackerContext.jsx';
import { formatUTC } from '../utils/time.js';
import styles from './RemarkInput.module.css';

export default function RemarkInput() {
  const { dispatch } = useTracker();
  const [content, setContent] = useState('');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    dispatch({ type: 'REMARK_ADD', payload: { content } });
    setContent('');
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <span className={styles.timestamp}>{formatUTC(now)}</span>
      <input
        className={styles.input}
        placeholder="특이사항 입력 (예: VHF 송출 불량으로 예비 장비 전환)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={200}
        title="기록 시점의 UTC 시각이 자동으로 첨부됩니다"
      />
      <button
        type="submit"
        className={styles.submit}
        disabled={!content.trim()}
        title="현재 시각으로 특이사항을 기록합니다"
      >
        기록
      </button>
    </form>
  );
}
