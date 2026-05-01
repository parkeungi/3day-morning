import { uid } from '../utils/id.js';
import { nowISO } from '../utils/time.js';

export const initialState = {
  shift: {
    clockIn: null,
    clockOut: null,
    totalTraffic: 0,
  },
  sectorLogs: [],
  remarks: [],
  tasks: [],
};

export function reducer(state, action) {
  switch (action.type) {
    case 'CLOCK_IN':
      if (state.shift.clockIn && !state.shift.clockOut) return state;
      return {
        ...initialState,
        shift: { clockIn: nowISO(), clockOut: null, totalTraffic: 0 },
      };

    case 'CLOCK_OUT': {
      if (!state.shift.clockIn || state.shift.clockOut) return state;
      const closeTime = nowISO();
      const sectorLogs = state.sectorLogs.map((log) =>
        log.logoutTime ? log : { ...log, logoutTime: closeTime },
      );
      return {
        ...state,
        sectorLogs,
        shift: { ...state.shift, clockOut: closeTime },
      };
    }

    case 'RESET_DAY':
      return initialState;

    case 'SECTOR_LOGIN': {
      const { sectorName, role } = action.payload;
      if (!sectorName || !role) return state;
      const time = nowISO();
      const sectorLogs = state.sectorLogs.map((log) =>
        log.logoutTime ? log : { ...log, logoutTime: time },
      );
      sectorLogs.push({
        id: uid(),
        sectorName,
        role,
        loginTime: time,
        logoutTime: null,
      });
      return { ...state, sectorLogs };
    }

    case 'SECTOR_LOGOUT': {
      const time = nowISO();
      return {
        ...state,
        sectorLogs: state.sectorLogs.map((log) =>
          log.logoutTime ? log : { ...log, logoutTime: time },
        ),
      };
    }

    case 'TRAFFIC_INCREMENT':
      return {
        ...state,
        shift: { ...state.shift, totalTraffic: state.shift.totalTraffic + 1 },
      };

    case 'TRAFFIC_DECREMENT':
      return {
        ...state,
        shift: {
          ...state.shift,
          totalTraffic: Math.max(0, state.shift.totalTraffic - 1),
        },
      };

    case 'REMARK_ADD': {
      const content = (action.payload?.content || '').trim();
      if (!content) return state;
      return {
        ...state,
        remarks: [
          { id: uid(), timestamp: nowISO(), content },
          ...state.remarks,
        ],
      };
    }

    case 'REMARK_DELETE':
      return {
        ...state,
        remarks: state.remarks.filter((r) => r.id !== action.payload.id),
      };

    case 'TASK_ADD': {
      const { callsign, taskType, targetTime, priority } = action.payload;
      if (!callsign) return state;
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: uid(),
            callsign: callsign.toUpperCase(),
            taskType: taskType || 'Handle',
            targetTime: targetTime || null,
            status: 'pending',
            priority: priority || 'normal',
            createdAt: nowISO(),
            completedAt: null,
          },
        ],
      };
    }

    case 'TASK_SET_STATUS': {
      const { id, status } = action.payload;
      const target = state.tasks.find((t) => t.id === id);
      if (!target) return state;
      const wasDone = target.status === 'done';
      const willBeDone = status === 'done';
      const tasks = state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              completedAt: willBeDone ? nowISO() : null,
            }
          : t,
      );
      let totalTraffic = state.shift.totalTraffic;
      if (!wasDone && willBeDone) totalTraffic += 1;
      else if (wasDone && !willBeDone) totalTraffic = Math.max(0, totalTraffic - 1);
      return {
        ...state,
        tasks,
        shift: { ...state.shift, totalTraffic },
      };
    }

    case 'TASK_DELETE': {
      const target = state.tasks.find((t) => t.id === action.payload.id);
      if (!target) return state;
      const totalTraffic =
        target.status === 'done'
          ? Math.max(0, state.shift.totalTraffic - 1)
          : state.shift.totalTraffic;
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload.id),
        shift: { ...state.shift, totalTraffic },
      };
    }

    default:
      return state;
  }
}
