import { useMemo } from 'react';
import { useTracker } from '../store/TrackerContext.jsx';
import {
  diffMs,
  formatDuration,
  formatUTCShort,
  nowISO,
} from '../utils/time.js';
import styles from './DailyReportModal.module.css';

export default function DailyReportModal({ open, onClose }) {
  const { state } = useTracker();

  const stats = useMemo(() => {
    const { clockIn, clockOut, totalTraffic } = state.shift;
    const totalDuty = diffMs(clockIn, clockOut || nowISO());
    const sectorBreakdown = state.sectorLogs.map((l) => ({
      ...l,
      duration: diffMs(l.loginTime, l.logoutTime || nowISO()),
    }));
    const completed = state.tasks.filter((t) => t.status === 'done').length;
    const pending = state.tasks.filter((t) => t.status !== 'done').length;
    return {
      clockIn,
      clockOut,
      totalTraffic,
      totalDuty,
      sectorBreakdown,
      completed,
      pending,
    };
  }, [state]);

  if (!open) return null;

  const handleCopy = () => {
    const lines = [
      '=== ATC Daily Report ===',
      `Clock In : ${formatUTCShort(stats.clockIn)}`,
      `Clock Out: ${formatUTCShort(stats.clockOut)}`,
      `On Duty  : ${formatDuration(stats.totalDuty)}`,
      `Traffic  : ${stats.totalTraffic} aircraft`,
      `Tasks    : ${stats.completed} done / ${stats.pending} pending`,
      '',
      '-- Sector Log --',
      ...stats.sectorBreakdown.map(
        (l) =>
          `${formatUTCShort(l.loginTime)} → ${formatUTCShort(l.logoutTime)}  ${l.sectorName} / ${l.role}  (${formatDuration(l.duration)})`,
      ),
      '',
      '-- Remarks --',
      ...state.remarks
        .slice()
        .reverse()
        .map((r) => `${formatUTCShort(r.timestamp)}  ${r.content}`),
    ];
    navigator.clipboard?.writeText(lines.join('\n'));
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>Daily Duty Report</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <section className={styles.summaryGrid}>
          <Stat label="Clock In" value={formatUTCShort(stats.clockIn)} />
          <Stat label="Clock Out" value={formatUTCShort(stats.clockOut)} />
          <Stat label="On Duty" value={formatDuration(stats.totalDuty)} />
          <Stat
            label="Total Traffic"
            value={stats.totalTraffic}
            tone="accent"
          />
          <Stat label="Tasks Done" value={stats.completed} tone="accent" />
          <Stat label="Tasks Open" value={stats.pending} tone="warn" />
        </section>

        <section className={styles.section}>
          <h3>Sector Log ({stats.sectorBreakdown.length})</h3>
          {stats.sectorBreakdown.length === 0 ? (
            <p className={styles.empty}>섹터 이력 없음</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Sector</th>
                  <th>Role</th>
                  <th>In</th>
                  <th>Out</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {stats.sectorBreakdown.map((l) => (
                  <tr key={l.id}>
                    <td>{l.sectorName}</td>
                    <td>{l.role}</td>
                    <td>{formatUTCShort(l.loginTime)}</td>
                    <td>{formatUTCShort(l.logoutTime)}</td>
                    <td>{formatDuration(l.duration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className={styles.section}>
          <h3>Remarks ({state.remarks.length})</h3>
          {state.remarks.length === 0 ? (
            <p className={styles.empty}>기록된 특이사항 없음</p>
          ) : (
            <ul className={styles.remarkList}>
              {state.remarks
                .slice()
                .reverse()
                .map((r) => (
                  <li key={r.id}>
                    <span className={styles.remarkTime}>
                      {formatUTCShort(r.timestamp)}
                    </span>
                    <span>{r.content}</span>
                  </li>
                ))}
            </ul>
          )}
        </section>

        <footer className={styles.footer}>
          <button onClick={handleCopy}>Copy as Text</button>
          <button className={styles.primary} onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className={`${styles.stat} ${tone ? styles[`tone_${tone}`] : ''}`}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}
