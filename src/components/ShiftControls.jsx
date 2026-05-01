import { useTracker } from '../store/TrackerContext.jsx';
import styles from './ShiftControls.module.css';

export default function ShiftControls({ onClockOut }) {
  const { state, dispatch } = useTracker();
  const { clockIn, clockOut } = state.shift;
  const onShift = !!clockIn && !clockOut;

  const handleClockOut = () => {
    if (!onShift) return;
    dispatch({ type: 'CLOCK_OUT' });
    onClockOut?.();
  };

  return (
    <div className={styles.wrap}>
      {!onShift ? (
        <button
          className={styles.primary}
          onClick={() => dispatch({ type: 'CLOCK_IN' })}
          title="근무를 시작합니다 (Clock In)"
        >
          ▶ 출근하기
        </button>
      ) : (
        <button
          className={styles.danger}
          onClick={handleClockOut}
          title="근무를 종료하고 일일 리포트를 확인합니다"
        >
          ■ 퇴근하기
        </button>
      )}
      {clockOut && (
        <button
          className={styles.ghost}
          onClick={() => {
            if (
              confirm('오늘 데이터를 초기화하고 새 근무를 시작합니다. 진행할까요?')
            ) {
              dispatch({ type: 'RESET_DAY' });
            }
          }}
          title="모든 기록을 초기화하고 새 근무 사이클을 시작합니다"
        >
          새 근무 시작
        </button>
      )}
    </div>
  );
}
