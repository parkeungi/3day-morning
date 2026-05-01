import { createContext, useContext, useEffect, useReducer } from 'react';
import { reducer, initialState } from './reducer.js';
import { loadState, saveState } from './persistence.js';

const TrackerContext = createContext(null);

function init() {
  const persisted = loadState();
  if (!persisted) return initialState;
  return {
    ...initialState,
    ...persisted,
    shift: { ...initialState.shift, ...(persisted.shift || {}) },
    sectorLogs: persisted.sectorLogs || [],
    remarks: persisted.remarks || [],
    tasks: persisted.tasks || [],
  };
}

export function TrackerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <TrackerContext.Provider value={{ state, dispatch }}>
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error('useTracker must be used within TrackerProvider');
  return ctx;
}
