/**
 * NoArousal - Streak Timeline & History Generation
 */

import { formatDisplayDate, formatDateKey } from './counter';
import type { NoArousalState, CheckInEntry } from './storage';

export interface TimelineItem {
  id: string;
  dateKey: string;
  displayDate: string;
  dayNumber?: number;
  label: string;
  note?: string;
  isInProgress?: boolean;
  isReset?: boolean;
  isInitial?: boolean;
  statusBadge?: string;
  checkIn?: CheckInEntry;
}

/**
 * Generates an accurate chronological timeline of the user's journey.
 * Inscribes the initial commitment, days elapsed, reset events with reflections,
 * and current active streak up to today in Asia/Jakarta timezone.
 */
export function generateTimeline(state: NoArousalState, currentDate: Date = new Date()): TimelineItem[] {
  const items: TimelineItem[] = [];
  const checkInMap = new Map<string, CheckInEntry>();
  for (const c of state.checkIns) {
    checkInMap.set(c.date, c);
  }

  const initialDate = new Date(state.initialCommitmentDate || state.startDate);
  const activeStartDate = new Date(state.startDate);
  if (isNaN(initialDate.getTime())) {
    return items;
  }

  const msPerDay = 86400000;

  // Day boundaries in Jakarta time
  const getMidnight = (d: Date) => {
    const m = new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    m.setHours(0, 0, 0, 0);
    return m;
  };

  const initialMidnight = getMidnight(initialDate);
  const activeMidnight = getMidnight(activeStartDate);
  const todayMidnight = getMidnight(currentDate);

  // Map of reset events by dateKey
  const resetEventsMap = new Map<string, typeof state.history[0]>();
  for (const h of state.history) {
    if (h.event === 'reset_and_learned') {
      resetEventsMap.set(h.date, h);
    }
  }

  const hasReset = state.history.some((h) => h.event === 'reset_and_learned');

  if (!hasReset) {
    // Normal continuous streak from initial commitment to today
    const totalDays = Math.max(0, Math.floor((todayMidnight.getTime() - initialMidnight.getTime()) / msPerDay));
    const startKey = formatDateKey(initialDate);
    const startDisplay = formatDisplayDate(initialDate);
    const isStartToday = startKey === formatDateKey(currentDate);

    items.push({
      id: `event-start-${startKey}`,
      dateKey: startKey,
      displayDate: startDisplay,
      label: isStartToday ? 'Commitment started · In progress' : 'Commitment started',
      isInitial: true,
      isInProgress: isStartToday,
      checkIn: checkInMap.get(startKey),
    });

    for (let d = 1; d <= totalDays; d++) {
      const dayDate = new Date(initialMidnight.getTime() + d * msPerDay);
      const dayKey = formatDateKey(dayDate);
      const isToday = d === totalDays;
      const checkIn = checkInMap.get(dayKey);

      items.push({
        id: `day-${d}-${dayKey}`,
        dateKey: dayKey,
        displayDate: formatDisplayDate(dayDate),
        dayNumber: d,
        label: `Day ${String(d).padStart(2, '0')}${isToday ? ' · In progress' : ''}`,
        isInProgress: isToday,
        statusBadge: checkIn ? getBadgeLabel(checkIn.status) : undefined,
        note: checkIn?.reflection,
        checkIn,
      });
    }
  } else {
    // Journey with historical reset(s)
    // 1. Initial Commitment
    const startKey = formatDateKey(initialDate);
    items.push({
      id: `event-start-${startKey}`,
      dateKey: startKey,
      displayDate: formatDisplayDate(initialDate),
      label: 'Commitment started',
      isInitial: true,
      checkIn: checkInMap.get(startKey),
    });

    // 2. Days from initial commitment up to active reset date
    const preResetDays = Math.max(0, Math.floor((activeMidnight.getTime() - initialMidnight.getTime()) / msPerDay));
    for (let d = 1; d < preResetDays; d++) {
      const dayDate = new Date(initialMidnight.getTime() + d * msPerDay);
      const dayKey = formatDateKey(dayDate);
      const checkIn = checkInMap.get(dayKey);

      items.push({
        id: `day-pre-${d}-${dayKey}`,
        dateKey: dayKey,
        displayDate: formatDisplayDate(dayDate),
        dayNumber: d,
        label: `Day ${String(d).padStart(2, '0')}`,
        statusBadge: checkIn ? getBadgeLabel(checkIn.status) : undefined,
        note: checkIn?.reflection,
        checkIn,
      });
    }

    // 3. Reset Event(s)
    for (const h of state.history) {
      if (h.event === 'reset_and_learned') {
        const checkIn = checkInMap.get(h.date);
        const resetDate = new Date(h.timestamp);
        const timeStr = !isNaN(resetDate.getTime())
          ? resetDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }) + ' WIB'
          : '03:00 WIB';

        const displayWithTime = `${h.displayDate} · ${timeStr}`;

        items.push({
          id: `reset-${h.date}-${h.timestamp}`,
          dateKey: h.date,
          displayDate: displayWithTime,
          label: h.title || `Streak reset at ${timeStr} · Learned & returned`,
          isReset: true,
          statusBadge: h.statusBadge || `${timeStr} · Reset & learned`,
          note: h.note || checkIn?.reflection,
          checkIn,
        });
      }
    }

    // 4. Post-reset streak days from active reset date to today
    const postResetDays = Math.max(0, Math.floor((todayMidnight.getTime() - activeMidnight.getTime()) / msPerDay));
    for (let d = 1; d <= postResetDays; d++) {
      const dayDate = new Date(activeMidnight.getTime() + d * msPerDay);
      const dayKey = formatDateKey(dayDate);
      const isToday = d === postResetDays;
      const checkIn = checkInMap.get(dayKey);

      items.push({
        id: `day-post-${d}-${dayKey}`,
        dateKey: dayKey,
        displayDate: formatDisplayDate(dayDate),
        dayNumber: d,
        label: `Day ${String(d).padStart(2, '0')}${isToday ? ' · In progress' : ''}`,
        isInProgress: isToday,
        statusBadge: checkIn ? getBadgeLabel(checkIn.status) : undefined,
        note: checkIn?.reflection,
        checkIn,
      });
    }
  }

  return items;
}

function getBadgeLabel(status: CheckInEntry['status']): string {
  if (status === 'focused') return 'Focused';
  if (status === 'resisted') return 'Resisted';
  if (status === 'reset') return 'Reset & learned';
  return '';
}
