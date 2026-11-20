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

export const STORAGE_KEY = 'noarousal_app_state_v3';
export const STORAGE_KEY_V2 = 'noarousal_app_state_v2';
export const STORAGE_KEY_V1 = 'noarousal_app_state_v1';

export const INITIAL_COMMITMENT_TIMESTAMP = '2026-11-12T23:00:00+07:00';
export const LATEST_RELAPSE_TIMESTAMP = '2026-11-19T03:00:00+07:00';

export const RELAPSE_NOTE_NOV19 = `Tbh, this is a very hard war, so I will choose this feeling of hard to use for productivity of other hard things, like doing 200 push-ups a day becomes feeling easy, making a business becomes easy, managing family also becomes easy, Bismillah.

Because the access is likely very instant, internet access is so fast, so the speed is maybe faster than I can think or consider.

Considering it needs structural flow and effort, needing to imagine how it will give so much destruction to what I want to see, but currently tech is very fast, so the deeper I learn about the NoArousal method, maybe it will be made as anti-tech or anti-AI.`;

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
 * Safely loads state from localStorage with migration across versions
 */
export function loadNoArousalState(): NoArousalState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  try {
    const rawV3 = localStorage.getItem(STORAGE_KEY);
    if (rawV3) {
      const parsed = JSON.parse(rawV3);
      if (parsed && typeof parsed === 'object' && parsed.startDate) {
        return {
          startDate: parsed.startDate || LATEST_RELAPSE_TIMESTAMP,
          initialCommitmentDate: parsed.initialCommitmentDate || INITIAL_COMMITMENT_TIMESTAMP,
          checkIns: Array.isArray(parsed.checkIns) ? parsed.checkIns : [],
          history: Array.isArray(parsed.history) ? parsed.history : [],
        };
      }
    }

    // Auto-migrate from v2 or v1 if present
    const rawPrev = localStorage.getItem(STORAGE_KEY_V2) || localStorage.getItem(STORAGE_KEY_V1);
    const initial = getDefaultState();

    if (rawPrev) {
      try {
        const parsedPrev = JSON.parse(rawPrev);
        if (parsedPrev && typeof parsedPrev === 'object') {
          const mergedCheckIns: CheckInEntry[] = Array.isArray(parsedPrev.checkIns) ? [...parsedPrev.checkIns] : [];
          const checkInNov19 = mergedCheckIns.find((c) => c.date === '2026-11-19');
          if (checkInNov19) {
            checkInNov19.reflection = RELAPSE_NOTE_NOV19;
          } else {
            mergedCheckIns.push(initial.checkIns[0]);
          }

          const mergedHistory: HistoryEvent[] = Array.isArray(parsedPrev.history) && parsedPrev.history.length > 0
            ? [...parsedPrev.history]
            : [...initial.history];

          const resetEventNov19 = mergedHistory.find((h) => h.date === '2026-11-19' && h.event === 'reset_and_learned');
          if (resetEventNov19) {
            resetEventNov19.note = RELAPSE_NOTE_NOV19;
          } else {
            mergedHistory.push(initial.history[1]);
          }

          const migratedState: NoArousalState = {
            startDate: LATEST_RELAPSE_TIMESTAMP,
            initialCommitmentDate: parsedPrev.initialCommitmentDate || INITIAL_COMMITMENT_TIMESTAMP,
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
