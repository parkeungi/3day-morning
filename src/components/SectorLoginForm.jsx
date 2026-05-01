import { useMemo, useState } from 'react';
import { useTracker } from '../store/TrackerContext.jsx';
import { formatUTCShort } from '../utils/time.js';
import styles from './SectorLoginForm.module.css';

const SECTOR_PRESETS = [
  'East Sector',
  'West Sector',
  'North Sector',
  'South Sector',
  'Approach',
  'Tower',
];
const ROLE_PRESETS = ['Radar', 'Coordinator', 'Tower', 'Ground', 'Supervisor'];

export default function SectorLoginForm() {
  const { state, dispatch } = useTracker();
  const [sectorName, setSectorName] = useState(SECTOR_PRESETS[0]);
  const [role, setRole] = useState(ROLE_PRESETS[0]);

  const onShift = !!state.shift.clockIn && !state.shift.clockOut;
  const active = useMemo(
    () => state.sectorLogs.find((l) => !l.logoutTime),
    [state.sectorLogs],
  );

  const handleLogin = () => {
    if (!onShift) return;
    dispatch({ type: 'SECTOR_LOGIN', payload: { sectorName, role } });
  };

  return (
    <div className={styles.form}>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>관제 구역</span>
          <div className={styles.selectWrap}>
            <select
              value={sectorName}
              onChange={(e) => setSectorName(e.target.value)}
              title="배정받은 관제 섹터를 선택하세요"
            >
              {SECTOR_PRESETS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>담당 업무</span>
          <div className={styles.selectWrap}>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              title="현재 수행할 역할을 선택하세요"
            >
              {ROLE_PRESETS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </label>
      </div>

      {active ? (
        <div className={styles.activeNote}>
          <span className={styles.dot} />
          현재 <strong>{active.sectorName}</strong> · {active.role} 착석 중
          <span className={styles.since}>
            ({formatUTCShort(active.loginTime)} 부터)
          </span>
        </div>
      ) : !onShift ? (
        <div className={styles.hint}>
          ⓘ 출근(Clock In) 후 섹터에 착석할 수 있습니다
        </div>
      ) : (
        <div className={styles.hint}>섹터 미착석 상태</div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.login}
          onClick={handleLogin}
          disabled={!onShift}
          title={
            active
              ? '현재 섹터에서 이석 후 새 섹터로 착석 처리합니다'
              : '선택한 섹터에 착석(Sign-on) 합니다'
          }
        >
          {active ? '↻ 교대 (Switch)' : '▶ 착석 (Sign-on)'}
        </button>
        <button
          type="button"
          className={styles.logout}
          onClick={() => dispatch({ type: 'SECTOR_LOGOUT' })}
          disabled={!active}
          title="현재 섹터에서 이석(Sign-off) 합니다"
        >
          ■ 이석
        </button>
      </div>
    </div>
  );
}
