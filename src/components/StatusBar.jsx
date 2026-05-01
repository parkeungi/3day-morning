import { useEffect, useMemo, useState } from 'react';
import { useTracker } from '../store/TrackerContext.jsx';
import {
  diffMs,
  formatDuration,
  formatUTCShort,
} from '../utils/time.js';
import styles from './StatusBar.module.css';

export default function StatusBar() {
  const { state } = useTracker();
  const { clockIn, clockOut, totalTraffic } = state.shift;
  const onShift = !!clockIn && !clockOut;

  const [, setTick] = useState(0);
  useEffect(() => {
    if (!onShift) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [onShift]);

  const elapsed = onShift ? diffMs(clockIn) : diffMs(clockIn, clockOut);
  const activeSector = useMemo(
    () => state.sectorLogs.find((l) => !l.logoutTime),
    [state.sectorLogs],
  );

  let shiftMode = 'off';
  if (clockIn && clockOut) shiftMode = 'closed';
  else if (onShift) shiftMode = 'on';

  return (
    <div className={styles.bar}>
      <div className={`${styles.cell} ${styles[`shift_${shiftMode}`]}`}>
        <span className={styles.dot} />
        <div className={styles.col}>
          <span className={styles.label}>근무 상태</span>
          <span className={styles.val}>
            {shiftMode === 'on' && (
              <>
                <strong>근무 중</strong>
                <span className={styles.muted}>
                  · {formatUTCShort(clockIn)} 부터 · {formatDuration(elapsed)}
                </span>
              </>
            )}
            {shiftMode === 'closed' && (
              <>
                <strong>근무 종료</strong>
                <span className={styles.muted}>
                  · {formatUTCShort(clockIn)} → {formatUTCShort(clockOut)} ·{' '}
                  {formatDuration(elapsed)}
                </span>
              </>
            )}
            {shiftMode === 'off' && (
              <>
                <strong>대기</strong>
                <span className={styles.muted}>
                  · 좌측에서 출근하기를 눌러 근무를 시작하세요
                </span>
              </>
            )}
          </span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.cell}>
        <span className={styles.icon}>📡</span>
        <div className={styles.col}>
          <span className={styles.label}>현재 섹터</span>
          <span className={styles.val}>
            {activeSector ? (
              <>
                <strong>{activeSector.sectorName}</strong>
                <span className={styles.muted}>· {activeSector.role}</span>
              </>
            ) : (
              <span className={styles.muted}>섹터 미착석</span>
            )}
          </span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={`${styles.cell} ${styles.trafficCell}`}>
        <span className={styles.icon}>✈</span>
        <div className={styles.col}>
          <span className={styles.label}>누적 관제량</span>
          <span className={styles.val}>
            <strong className={styles.trafficNum}>
              {String(totalTraffic).padStart(3, '0')}
            </strong>
            <span className={styles.muted}>aircraft</span>
          </span>
        </div>
      </div>
    </div>
  );
}
