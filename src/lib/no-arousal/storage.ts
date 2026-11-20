/**
 * NoArousal - LocalStorage State Management
 */

import { DEFAULT_START_TIMESTAMP, formatDateKey, formatDisplayDate } from './counter';

export type CheckInStatus = 'focused' | 'resisted' | 'reset';

export interface CheckInEntry {
  date: string; // "YYYY-MM-DD"
  displayDate: string; // "16 NOV 2026"
  status: CheckInStatus;
  timestamp: string; // ISO
  reflection?: string;
}

export interface HistoryEvent {
  date: string; // "YYYY-MM-DD"
  displayDate: string; // "12 NOV 2026"
  timestamp: string; // ISO
  event: 'commitment_started' | 'day_milestone' | 'reset_and_learned';
  title: string;
  note?: string;
}

export interface NoArousalState {
  startDate: string; // ISO of active streak (e.g. "2026-11-19T03:00:00+07:00")
  initialCommitmentDate: string; // "2026-11-12T23:00:00+07:00"
  checkIns: CheckInEntry[];
  history: HistoryEvent[];
}

export const STORAGE_KEY = 'noarousal_app_state_v2';
export const STORAGE_KEY_V1 = 'noarousal_app_state_v1';

export const INITIAL_COMMITMENT_TIMESTAMP = '2026-11-12T23:00:00+07:00';
export const LATEST_RELAPSE_TIMESTAMP = '2026-11-19T03:00:00+07:00';

export const RELAPSE_NOTE_NOV19 = `tbh this is very hard war so i will choose this feel of hard to use for productiviyt of other hard things, like doing 200 push up a day became feel easy, make a business is become easy, manage familiy also become easy Bismillah.

because the access is likely very instant, internet access is so fast, so the speed maybe more fast then i can think or considering

considering need structural flow and effort, need to imagine how will be give many of destruction what wanna see, but currently tech is very fast, so the more deep i learn about the noarousal method maybe will be make as a anti tech or anti ai`;

export function getDefaultState(): NoArousalState {
  return {
    startDate: LATEST_RELAPSE_TIMESTAMP,
    initialCommitmentDate: INITIAL_COMMITMENT_TIMESTAMP,
    checkIns: [
      {
        date: '2026-11-19',
        displayDate: '19 NOV 2026',
        status: 'reset',
        timestamp: LATEST_RELAPSE_TIMESTAMP,
        reflection: RELAPSE_NOTE_NOV19,
      },
    ],
    history: [
      {
        date: '2026-11-12',
        displayDate: '12 NOV 2026',
        timestamp: INITIAL_COMMITMENT_TIMESTAMP,
        event: 'commitment_started',
        title: 'Commitment started',
      },
      {
        date: '2026-11-19',
        displayDate: '19 NOV 2026',
        timestamp: LATEST_RELAPSE_TIMESTAMP,
        event: 'reset_and_learned',
        title: 'Streak reset · Learned & returned',
        note: RELAPSE_NOTE_NOV19,
      },
    ],
  };
}

/**
 * Safely loads state from localStorage with migration from v1 to v2
 */
export function loadNoArousalState(): NoArousalState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY);
    if (rawV2) {
      const parsed = JSON.parse(rawV2);
      if (parsed && typeof parsed === 'object' && parsed.startDate) {
        return {
          startDate: parsed.startDate || LATEST_RELAPSE_TIMESTAMP,
          initialCommitmentDate: parsed.initialCommitmentDate || INITIAL_COMMITMENT_TIMESTAMP,
          checkIns: Array.isArray(parsed.checkIns) ? parsed.checkIns : [],
          history: Array.isArray(parsed.history) ? parsed.history : [],
        };
      }
    }

    // Auto-migrate from v1 if present
    const rawV1 = localStorage.getItem(STORAGE_KEY_V1);
    const initial = getDefaultState();

    if (rawV1) {
      try {
        const parsedV1 = JSON.parse(rawV1);
        if (parsedV1 && typeof parsedV1 === 'object') {
          // Merge user's check-ins from v1 while ensuring the Nov 19 relapse is recorded
          const mergedCheckIns: CheckInEntry[] = Array.isArray(parsedV1.checkIns) ? [...parsedV1.checkIns] : [];
          if (!mergedCheckIns.some((c) => c.date === '2026-11-19')) {
            mergedCheckIns.push(initial.checkIns[0]);
          }

          const mergedHistory: HistoryEvent[] = Array.isArray(parsedV1.history) && parsedV1.history.length > 0
            ? [...parsedV1.history]
            : [...initial.history];

          if (!mergedHistory.some((h) => h.date === '2026-11-19' && h.event === 'reset_and_learned')) {
            mergedHistory.push(initial.history[1]);
          }

          const migratedState: NoArousalState = {
            startDate: LATEST_RELAPSE_TIMESTAMP,
            initialCommitmentDate: parsedV1.initialCommitmentDate || INITIAL_COMMITMENT_TIMESTAMP,
            checkIns: mergedCheckIns,
            history: mergedHistory,
          };

          localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedState));
          return migratedState;
        }
      } catch (e) {
        // Fallback to initial
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.error('[NoArousal] Error loading state from localStorage:', err);
    return getDefaultState();
  }
}

/**
 * Saves state safely to localStorage
 */
export function saveNoArousalState(state: NoArousalState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('[NoArousal] Error saving state to localStorage:', err);
  }
}

/**
 * Saves or updates a daily check-in
 */
export function saveDailyCheckIn(status: CheckInStatus, reflection = ''): NoArousalState {
  const state = loadNoArousalState();
  const now = new Date();
  const dateKey = formatDateKey(now);
  const displayDate = formatDisplayDate(now);

  const existingIndex = state.checkIns.findIndex((c) => c.date === dateKey);
  const entry: CheckInEntry = {
    date: dateKey,
    displayDate,
    status,
    timestamp: now.toISOString(),
    reflection,
  };

  if (existingIndex >= 0) {
    state.checkIns[existingIndex] = entry;
  } else {
    state.checkIns.push(entry);
  }

  saveNoArousalState(state);
  return state;
}

/**
 * Confirmed Streak Reset:
 * Resets the active startDate to now, keeps original commitment date,
 * records the reset event in history with reflection, and updates today's check-in.
 */
export function executeStreakReset(reflection = ''): NoArousalState {
  const state = loadNoArousalState();
  const now = new Date();
  const dateKey = formatDateKey(now);
  const displayDate = formatDisplayDate(now);
  const nowISO = now.toISOString();

  // 1. Reset start date to now
  state.startDate = nowISO;

  // 2. Add reset event to history
  state.history.push({
    date: dateKey,
    displayDate,
    timestamp: nowISO,
    event: 'reset_and_learned',
    title: 'Streak reset · Learned & returned',
    note: reflection || 'Commitment renewed with deeper self-awareness.',
  });

  // 3. Record check-in as reset
  const existingIndex = state.checkIns.findIndex((c) => c.date === dateKey);
  const entry: CheckInEntry = {
    date: dateKey,
    displayDate,
    status: 'reset',
    timestamp: nowISO,
    reflection: reflection || 'Reset & learned',
  };

  if (existingIndex >= 0) {
    state.checkIns[existingIndex] = entry;
  } else {
    state.checkIns.push(entry);
  }

  saveNoArousalState(state);
  return state;
}
