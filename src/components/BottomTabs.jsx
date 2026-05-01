import { useState } from 'react';
import { useTracker } from '../store/TrackerContext.jsx';
import SectorHistory from './SectorHistory.jsx';
import RemarkTimeline from './RemarkTimeline.jsx';
import styles from './BottomTabs.module.css';

const TABS = [
  { id: 'remarks', label: '특이사항 로그', icon: '⚠' },
  { id: 'sectors', label: '섹터 이력', icon: '📍' },
];

export default function BottomTabs() {
  const { state } = useTracker();
  const [tab, setTab] = useState('remarks');
  const [collapsed, setCollapsed] = useState(false);

  const counts = {
    remarks: state.remarks.length,
    sectors: state.sectorLogs.length,
  };

  return (
    <section className={`${styles.wrap} ${collapsed ? styles.collapsed : ''}`}>
      <header className={styles.head}>
        <div className={styles.tabs} role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`${styles.tab} ${tab === t.id ? styles.active : ''}`}
              onClick={() => {
                setTab(t.id);
                setCollapsed(false);
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
              <span className={styles.count}>{counts[t.id]}</span>
            </button>
          ))}
        </div>
        <button
          className={styles.toggle}
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? '펼치기' : '접기'}
          aria-label={collapsed ? '펼치기' : '접기'}
        >
          {collapsed ? '▲ 펼치기' : '▼ 접기'}
        </button>
      </header>

      {!collapsed && (
        <div className={styles.body}>
          {tab === 'remarks' ? <RemarkTimeline /> : <SectorHistory />}
        </div>
      )}
    </section>
  );
}
