/**
 * NoArousal - LocalStorage State Management
 */

import { DEFAULT_START_TIMESTAMP, formatDateKey, formatDisplayDate } from './counter';
import streakData from '../../data/no-arousal/streak.json';

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
  statusBadge?: string;
  note?: string;
}

export interface NoArousalState {
  startDate: string; // ISO of active streak (e.g. "2026-11-19T03:00:00+07:00")
  initialCommitmentDate: string; // "2026-11-12T23:00:00+07:00"
  checkIns: CheckInEntry[];
  history: HistoryEvent[];
}

export const STORAGE_KEY = 'noarousal_app_state_v3';
export const STORAGE_KEY_V2 = 'noarousal_app_state_v2';
export const STORAGE_KEY_V1 = 'noarousal_app_state_v1';

export const INITIAL_COMMITMENT_TIMESTAMP = streakData.initialCommitmentDate || '2026-11-12T23:00:00+07:00';
export const LATEST_RELAPSE_TIMESTAMP = streakData.activeStartDate || '2026-11-19T03:00:00+07:00';

export function getDefaultState(): NoArousalState {
  return {
    startDate: streakData.activeStartDate,
    initialCommitmentDate: streakData.initialCommitmentDate,
    checkIns: (streakData.checkIns as CheckInEntry[]) || [],
    history: (streakData.history as HistoryEvent[]) || [],
  };
}

/**
 * Safely loads state from localStorage with migration across versions
 */
export function loadNoArousalState(): NoArousalState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  const initial = getDefaultState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY_V2) || localStorage.getItem(STORAGE_KEY_V1);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        // Merge check-ins with defaults from streak.json
        const localCheckIns: CheckInEntry[] = Array.isArray(parsed.checkIns) ? parsed.checkIns : [];
        const mergedCheckIns: CheckInEntry[] = [...localCheckIns];

        for (const defaultCheckIn of initial.checkIns) {
          const idx = mergedCheckIns.findIndex((c) => c.date === defaultCheckIn.date);
          if (idx >= 0) {
            if (defaultCheckIn.reflection) {
              mergedCheckIns[idx].reflection = defaultCheckIn.reflection;
            }
          } else {
            mergedCheckIns.push(defaultCheckIn);
          }
        }

        // Merge history with defaults from streak.json
        const localHistory: HistoryEvent[] = Array.isArray(parsed.history) ? parsed.history : [];
        const mergedHistory: HistoryEvent[] = [...localHistory];

        for (const defaultH of initial.history) {
          const idx = mergedHistory.findIndex((h) => h.date === defaultH.date && h.event === defaultH.event);
          if (idx >= 0) {
            mergedHistory[idx] = { ...mergedHistory[idx], ...defaultH };
          } else {
            mergedHistory.push(defaultH);
          }
        }

        const state: NoArousalState = {
          startDate: streakData.activeStartDate || parsed.startDate || initial.startDate,
          initialCommitmentDate: streakData.initialCommitmentDate || parsed.initialCommitmentDate || initial.initialCommitmentDate,
          checkIns: mergedCheckIns,
          history: mergedHistory,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return state;
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.error('[NoArousal] Error loading state from localStorage:', err);
    return initial;
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
