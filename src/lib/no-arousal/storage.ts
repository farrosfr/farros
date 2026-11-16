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
  startDate: string; // ISO (e.g. "2026-11-12T23:00:00+07:00")
  initialCommitmentDate: string;
  checkIns: CheckInEntry[];
  history: HistoryEvent[];
}

export const STORAGE_KEY = 'noarousal_app_state_v1';

export function getDefaultState(): NoArousalState {
  return {
    startDate: DEFAULT_START_TIMESTAMP,
    initialCommitmentDate: DEFAULT_START_TIMESTAMP,
    checkIns: [],
    history: [
      {
        date: '2026-11-12',
        displayDate: '12 NOV 2026',
        timestamp: DEFAULT_START_TIMESTAMP,
        event: 'commitment_started',
        title: 'Commitment started',
      },
    ],
  };
}

/**
 * Safely loads state from localStorage without overwriting existing data
 */
export function loadNoArousalState(): NoArousalState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.startDate) {
      return getDefaultState();
    }

    return {
      startDate: parsed.startDate || DEFAULT_START_TIMESTAMP,
      initialCommitmentDate: parsed.initialCommitmentDate || DEFAULT_START_TIMESTAMP,
      checkIns: Array.isArray(parsed.checkIns) ? parsed.checkIns : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
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
 * records the reset event in history, and updates today's check-in.
 */
export function executeStreakReset(): NoArousalState {
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
    note: 'Commitment renewed with deeper self-awareness.',
  });

  // 3. Record check-in as reset
  const existingIndex = state.checkIns.findIndex((c) => c.date === dateKey);
  const entry: CheckInEntry = {
    date: dateKey,
    displayDate,
    status: 'reset',
    timestamp: nowISO,
    reflection: 'Reset & learned',
  };

  if (existingIndex >= 0) {
    state.checkIns[existingIndex] = entry;
  } else {
    state.checkIns.push(entry);
  }

  saveNoArousalState(state);
  return state;
}
