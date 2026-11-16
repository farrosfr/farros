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
  isInProgress?: boolean;
  isReset?: boolean;
  isInitial?: boolean;
  statusBadge?: string;
  checkIn?: CheckInEntry;
}

/**
 * Generates an accurate chronological timeline of days from the active start date
 * up to today in Asia/Jakarta timezone, interleaving check-ins and reset history.
 */
export function generateTimeline(state: NoArousalState, currentDate: Date = new Date()): TimelineItem[] {
  const items: TimelineItem[] = [];
  const checkInMap = new Map<string, CheckInEntry>();
  for (const c of state.checkIns) {
    checkInMap.set(c.date, c);
  }

  const startDate = new Date(state.startDate);
  if (isNaN(startDate.getTime())) {
    return items;
  }

  // Calculate day boundaries in Jakarta time
  const startDay = new Date(startDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  startDay.setHours(0, 0, 0, 0);

  const today = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  today.setHours(0, 0, 0, 0);

  const msPerDay = 86400000;
  const totalDays = Math.max(0, Math.floor((today.getTime() - startDay.getTime()) / msPerDay));

  // Day 0: Start of commitment
  const startKey = formatDateKey(startDate);
  const startDisplay = formatDisplayDate(startDate);
  const isStartToday = startKey === formatDateKey(today);

  items.push({
    id: `event-start-${startKey}`,
    dateKey: startKey,
    displayDate: startDisplay,
    label: isStartToday ? 'Commitment started · In progress' : 'Commitment started',
    isInitial: true,
    isInProgress: isStartToday,
    checkIn: checkInMap.get(startKey),
  });

  // Subsequent days from 1 to totalDays
  for (let d = 1; d <= totalDays; d++) {
    const dayDate = new Date(startDay.getTime() + d * msPerDay);
    const dayKey = formatDateKey(dayDate);
    const dayDisplay = formatDisplayDate(dayDate);
    const isToday = d === totalDays;
    const checkIn = checkInMap.get(dayKey);

    const dayNumberFormatted = String(d).padStart(2, '0');
    let label = `Day ${dayNumberFormatted}`;

    if (isToday) {
      label += ' · In progress';
    }

    let statusBadge: string | undefined;
    if (checkIn) {
      if (checkIn.status === 'focused') statusBadge = 'Focused';
      else if (checkIn.status === 'resisted') statusBadge = 'Resisted';
      else if (checkIn.status === 'reset') statusBadge = 'Reset & learned';
    }

    items.push({
      id: `day-${d}-${dayKey}`,
      dateKey: dayKey,
      displayDate: dayDisplay,
      dayNumber: d,
      label,
      isInProgress: isToday,
      statusBadge,
      checkIn,
    });
  }

  // Interleave any reset history events that occurred
  for (const h of state.history) {
    if (h.event === 'reset_and_learned') {
      const existing = items.find((it) => it.dateKey === h.date && it.isReset);
      if (!existing) {
        items.push({
          id: `reset-${h.date}-${h.timestamp}`,
          dateKey: h.date,
          displayDate: h.displayDate,
          label: h.title,
          isReset: true,
        });
      }
    }
  }

  return items;
}
