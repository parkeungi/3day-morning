import { useState } from 'react';
import { TrackerProvider } from './store/TrackerContext.jsx';
import DualClock from './components/DualClock.jsx';
import StatusBar from './components/StatusBar.jsx';
import ShiftControls from './components/ShiftControls.jsx';
import SectorLoginForm from './components/SectorLoginForm.jsx';
import RemarkInput from './components/RemarkInput.jsx';
import AddFlightStripForm from './components/AddFlightStripForm.jsx';
import FlightStripBoard from './components/FlightStripBoard.jsx';
import BottomTabs from './components/BottomTabs.jsx';
import DailyReportModal from './components/DailyReportModal.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Footer from './components/Footer.jsx';
import styles from './App.module.css';

export default function App() {
  return (
    <TrackerProvider>
      <Shell />
    </TrackerProvider>
  );
}

function Shell() {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.logo}>◆</span>
          <h1 className={styles.title}>ATC Duty &amp; Task Tracker</h1>
          <span className={styles.version}>v0.3</span>
        </div>
        <div className={styles.topRight}>
          <ThemeToggle />
          <button
            className={styles.reportBtn}
            onClick={() => setReportOpen(true)}
            title="현재까지의 근무 일지를 확인합니다"
          >
            📋 일일 리포트
          </button>
          <DualClock />
        </div>
      </header>

      <div className={styles.content}>
        <StatusBar />

        <main className={styles.main}>
          <aside className={styles.dock} aria-label="빠른 작업">
            <DockBlock title="근무" subtitle="출/퇴근">
              <ShiftControls onClockOut={() => setReportOpen(true)} />
            </DockBlock>

            <DockBlock title="섹터 착석" subtitle="구역과 역할 선택 후 착석">
              <SectorLoginForm />
            </DockBlock>

            <DockBlock
              title="특이사항 입력"
              subtitle="이벤트 발생 즉시 기록 (UTC 자동 첨부)"
            >
              <RemarkInput />
            </DockBlock>
          </aside>

          <section className={styles.work}>
            <div className={styles.workHead}>
              <h2 className={styles.workTitle}>항공기 스트립 작업대</h2>
              <p className={styles.workHint}>
                새 스트립을 추가하면 좌측(해야 할 일)에 배치되고, 완료 시 우측(완료한 일)으로 이동하며 관제량이 +1 증가합니다.
              </p>
            </div>
            <AddFlightStripForm />
            <FlightStripBoard />
          </section>
        </main>

        <BottomTabs />
      </div>

      <Footer />

      <DailyReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
}

function DockBlock({ title, subtitle, children }) {
  return (
    <div className={styles.dockBlock}>
      <div className={styles.dockHead}>
        <h3 className={styles.dockTitle}>{title}</h3>
        {subtitle && <span className={styles.dockSub}>{subtitle}</span>}
      </div>
      <div className={styles.dockBody}>{children}</div>
    </div>
  );
}
