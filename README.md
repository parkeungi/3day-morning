# ATC Duty & Task Tracker

항공교통관제사(ATC)를 위한 통합 근무 워크스페이스. 출퇴근, 섹터 착석, Flight Strip 처리, 누적 관제량, 특이사항 로그를 한 화면에서 관리합니다.

> 단순 To-Do 앱이 아닌, **근무 일지(Duty Log) + 작업 트래커(Task Tracker)** 를 결합한 단일 페이지 워크스페이스입니다.

---

## 주요 기능

| 영역 | 내용 |
|---|---|
| **근무 (Shift)** | 출/퇴근 클럭, 누적 근무 시간 (UTC 기록) |
| **섹터 착석 (Sector Sign-on)** | 관제 구역·담당 역할 선택 후 착석/이석/교대. 섹터별 소요 시간 자동 누적 |
| **Flight Strip 작업대** | 콜사인 단위 처리 카드 — 대기 → 진행 → 완료 워크플로우 |
| **누적 관제량 (Traffic)** | 스트립 완료 시 자동 +1, 수동 ± 보정 가능 |
| **특이사항 (Remarks)** | UTC 타임스탬프 자동 첨부 텍스트 로그 |
| **시간 위반 경고** | 목표 시각 5분 전 주의(주황), 1분 전 / 초과 시 위험(빨강 펄스) |
| **일일 리포트** | 퇴근 시 출/퇴근, 섹터 이력, 총 관제량, 특이사항을 요약한 모달 + 텍스트 복사 |
| **다크/라이트 테마** | 시스템 설정 자동 감지 + 수동 토글, 선택값 영구 저장 |

---

## 화면 구조

```
┌─ Top Bar ──────── 브랜드 · 테마 토글 · 일일 리포트 · UTC/KST 듀얼 시계 ─┐
├─ Status Bar ──── 근무 상태 · 현재 섹터 · 누적 관제량 (한 눈에 보이는 현황) ─┤
├─ Main Work Area ─────────────────────────────────────────────────────┤
│ 빠른 작업 도크 (좌)        │ 항공기 스트립 작업대 (우)                   │
│   · 출/퇴근 버튼            │   · Add Strip 1줄 폼                      │
│   · 섹터 착석 폼           │   · 📌 해야 할 일 │ ✅ 완료한 일 (관제량 칩) │
│   · 특이사항 빠른 입력      │                                            │
├─ Bottom Tabs (접기 가능) ── ⚠ 특이사항 로그 │ 📍 섹터 이력 ───────────┤
└─ Footer ──────── 개발일시 · 개발자 · 이메일 · 기술 스택 ─────────────┘
```

---

## 기술 스택

- **React 18** + **Vite 5** (개발 서버 / 번들러)
- **JavaScript (JSX)** — TypeScript 미도입 (단순도 우선)
- **CSS Modules** + 전역 디자인 토큰 (`tokens.css`) — 다크/라이트 양 테마
- **LocalStorage** — 단일 디바이스 영속화 (key: `atc-tracker:v1`, `atc-tracker:theme`)
- **`useReducer` + `useContext`** — 외부 상태 라이브러리 없이 도메인 상태 관리
- **`crypto.randomUUID()`** — 외부 의존 없는 ID 생성
- **JetBrains Mono** — 등폭 폰트로 시간/숫자 가독성 강조

---

## 디렉토리 구조

```
src/
├── main.jsx              # 엔트리 + ThemeProvider 마운트
├── App.jsx               # 전체 레이아웃 (TopBar / StatusBar / Dock / Work / Tabs / Footer)
├── App.module.css
├── styles/
│   ├── tokens.css        # 다크·라이트 디자인 토큰 (CSS 변수)
│   └── global.css        # reset, body, scrollbar
├── store/
│   ├── TrackerContext.jsx  # 도메인 상태 Provider + useTracker 훅
│   ├── ThemeContext.jsx    # 테마 Provider + useTheme 훅
│   ├── reducer.js          # 8종 액션 (CLOCK_IN/OUT, SECTOR_*, TASK_*, TRAFFIC_*, REMARK_*)
│   └── persistence.js      # LocalStorage load/save
├── utils/
│   ├── time.js           # UTC/Local 포맷, diffMs, formatDuration
│   └── id.js             # uid()
└── components/
    ├── DualClock.jsx          # UTC + Local 듀얼 시계 (1초 갱신)
    ├── StatusBar.jsx          # 근무·섹터·관제량 요약 바
    ├── ThemeToggle.jsx        # ☀/☾ 토글
    ├── ShiftControls.jsx      # 출/퇴근 버튼
    ├── SectorLoginForm.jsx    # 섹터·역할 선택 + 착석/이석/교대
    ├── SectorHistory.jsx      # 섹터별 누적 시간 리스트
    ├── TrafficCounter.jsx     # 관제량 디스플레이 (현재는 Done 레인 헤더 칩 사용)
    ├── RemarkInput.jsx        # 특이사항 1줄 입력 (UTC 자동)
    ├── RemarkTimeline.jsx     # 특이사항 시계열 로그
    ├── AddFlightStripForm.jsx # 새 스트립 1줄 폼
    ├── FlightStripBoard.jsx   # 해야 할 일 / 완료한 일 분리 보드
    ├── FlightStripCard.jsx    # 개별 카드 (시간 경고 펄스 포함)
    ├── BottomTabs.jsx         # 특이사항 로그 / 섹터 이력 탭
    ├── DailyReportModal.jsx   # 일일 리포트 모달 + 텍스트 복사
    ├── Footer.jsx             # 개발자 정보 + 기술 스택
    └── Section.jsx            # 공용 섹션 래퍼
```

---

## 데이터 모델

```js
{
  shift: {
    clockIn:      ISOString | null,   // 출근 UTC
    clockOut:     ISOString | null,   // 퇴근 UTC
    totalTraffic: number,             // 누적 관제량
  },
  sectorLogs: [
    { id, sectorName, role, loginTime, logoutTime | null }
  ],
  remarks: [
    { id, timestamp, content }
  ],
  tasks: [
    { id, callsign, taskType, targetTime, status, priority,
      createdAt, completedAt }
  ]
}
```

- `status`: `pending | in_progress | done`
- 카드를 `done` 으로 전환하는 액션이 자동으로 `shift.totalTraffic += 1` 처리
- 매 reducer 실행 후 LocalStorage 직렬화 저장 → 새로고침 시 복구

---

## 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 (http://localhost:5173)
npm run dev

# 3. 프로덕션 빌드
npm run build

# 4. 빌드 결과 미리보기
npm run preview
```

---

## 사용 시나리오

1. **출근** — 좌측 도크 `▶ 출근하기` → StatusBar 가 "근무 중"으로 전환
2. **섹터 착석** — `East Sector / Radar` 선택 → `▶ 착석` → StatusBar 에 현재 섹터 표시
3. **새 스트립 추가** — 작업대 상단 1줄 폼에 콜사인 + 목표 시각 입력 → `+ 추가`
4. **스트립 처리** — `Start` 클릭(진행) → `Complete`(완료) → 관제량 자동 +1, 카드가 우측 완료 레인으로 이동
5. **시간 임박 카드** — 5분 이내(주황), 1분 이내/초과(빨강 펄스)로 자동 강조
6. **특이사항 기록** — 좌측 도크 입력란에 텍스트 → `기록` → 하단 탭의 특이사항 로그 최상단에 추가
7. **퇴근** — `■ 퇴근하기` → 일일 리포트 모달 자동 오픈 → `Copy as Text` 로 클립보드 복사

---

## 개발 정보

- **개발일시:** 2026-05-01
- **개발자:** 박은기 ([parkeungi@gmail.com](mailto:parkeungi@gmail.com))
- **저장소:** https://github.com/parkeungi/3day-morning

---

## 향후 개선 후보 (Out of Scope)

- 다중 사용자 / 서버 동기화 / 인증
- 자정(UTC 00:00) 자동 롤오버 + 멀티데이 통계
- CSV / PDF 리포트 내보내기
- 자동화 테스트 (현재는 수동 검증 기반)
