import { useMemo } from 'react';
import { useTracker } from '../store/TrackerContext.jsx';
import FlightStripCard from './FlightStripCard.jsx';
import styles from './FlightStripBoard.module.css';

function sortKey(t) {
  if (t.targetTime) return new Date(t.targetTime).getTime();
  return new Date(t.createdAt).getTime() + 1e13;
}

export default function FlightStripBoard() {
  const { state, dispatch } = useTracker();

  const { todoList, doneList } = useMemo(() => {
    const sorted = [...state.tasks].sort((a, b) => sortKey(a) - sortKey(b));
    return {
      todoList: sorted.filter((t) => t.status !== 'done'),
      doneList: sorted
        .filter((t) => t.status === 'done')
        .sort(
          (a, b) =>
            new Date(b.completedAt || b.createdAt).getTime() -
            new Date(a.completedAt || a.createdAt).getTime(),
        ),
    };
  }, [state.tasks]);

  const pendingCount = todoList.filter((t) => t.status === 'pending').length;
  const inProgressCount = todoList.filter(
    (t) => t.status === 'in_progress',
  ).length;
  const traffic = state.shift.totalTraffic;

  return (
    <div className={styles.split}>
      <Lane
        tone="todo"
        title="📌 해야 할 일"
        subtitle="대기 + 진행 중인 항공기 스트립"
        rightSlot={
          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles.badge_pending}`}>
              대기 <strong>{pendingCount}</strong>
            </span>
            <span className={`${styles.badge} ${styles.badge_progress}`}>
              진행 <strong>{inProgressCount}</strong>
            </span>
          </div>
        }
        emptyMessage="처리할 항공기 스트립이 없습니다. 위 폼에서 추가하세요."
        items={todoList}
      />
      <Lane
        tone="done"
        title="✅ 완료한 일"
        subtitle="처리한 스트립과 누적 관제량"
        rightSlot={
          <div className={styles.trafficChip} title="누적 관제량 (수동 보정)">
            <span className={styles.trafficLabel}>관제량</span>
            <button
              type="button"
              className={styles.trafficBtn}
              onClick={() => dispatch({ type: 'TRAFFIC_DECREMENT' })}
              aria-label="관제량 감소"
            >
              −
            </button>
            <strong className={styles.trafficVal}>
              {String(traffic).padStart(3, '0')}
            </strong>
            <button
              type="button"
              className={styles.trafficBtn}
              onClick={() => dispatch({ type: 'TRAFFIC_INCREMENT' })}
              aria-label="관제량 증가"
            >
              +
            </button>
          </div>
        }
        emptyMessage="아직 완료된 스트립이 없습니다."
        items={doneList}
      />
    </div>
  );
}

function Lane({ tone, title, subtitle, rightSlot, emptyMessage, items }) {
  return (
    <section className={`${styles.lane} ${styles[`lane_${tone}`]}`}>
      <header className={styles.laneHead}>
        <div className={styles.titleBlock}>
          <h3 className={styles.laneTitle}>{title}</h3>
          <p className={styles.laneSub}>{subtitle}</p>
        </div>
        {rightSlot}
      </header>

      <div className={styles.laneBody}>
        {items.length === 0 ? (
          <div className={styles.empty}>{emptyMessage}</div>
        ) : (
          <div className={styles.list}>
            {items.map((task) => (
              <FlightStripCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
