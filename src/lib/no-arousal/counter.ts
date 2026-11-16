/**
 * NoArousal - Real-time Streak Counter Utilities
 * Default Start: 12 November 2026, 23:00:00 Asia/Jakarta (UTC+7)
 */

export const DEFAULT_START_TIMESTAMP = '2026-11-12T23:00:00+07:00';

export interface ElapsedTime {
  elapsedSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  daysStr: string;
  hoursStr: string;
  minutesStr: string;
  secondsStr: string;
}

/**
 * Calculates elapsed time from startTime to currentTime
 * Formula follows the NoArousal Specification:
 *   elapsedSeconds = floor((currentTime - startTime) / 1000)
 *   days = floor(elapsedSeconds / 86400)
 *   hours = floor((elapsedSeconds % 86400) / 3600)
 *   minutes = floor((elapsedSeconds % 3600) / 60)
 *   seconds = elapsedSeconds % 60
 */
export function calculateElapsed(
  startTime: Date | string | number,
  currentTime: Date | string | number = new Date()
): ElapsedTime {
  const startMs = typeof startTime === 'number' ? startTime : new Date(startTime).getTime();
  const currentMs = typeof currentTime === 'number' ? currentTime : new Date(currentTime).getTime();

  const elapsedMs = Math.max(0, currentMs - startMs);
  const elapsedSeconds = Math.floor(elapsedMs / 1000);

  const days = Math.floor(elapsedSeconds / 86400);
  const hours = Math.floor((elapsedSeconds % 86400) / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  return {
    elapsedSeconds,
    days,
    hours,
    minutes,
    seconds,
    daysStr: String(days).padStart(2, '0'),
    hoursStr: String(hours).padStart(2, '0'),
    minutesStr: String(minutes).padStart(2, '0'),
    secondsStr: String(seconds).padStart(2, '0'),
  };
}

/**
 * Formats a date into "16 NOV 2026" (uppercase format in Asia/Jakarta timezone)
 */
export function formatDisplayDate(date: Date | string | number = new Date()): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '16 NOV 2026';

  const day = d.toLocaleDateString('en-GB', { day: '2-digit', timeZone: 'Asia/Jakarta' });
  const month = d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'Asia/Jakarta' }).toUpperCase();
  const year = d.toLocaleDateString('en-GB', { year: 'numeric', timeZone: 'Asia/Jakarta' });

  return `${day} ${month} ${year}`;
}

/**
 * Formats a date into standard "YYYY-MM-DD" key in Asia/Jakarta timezone
 */
export function formatDateKey(date: Date | string | number = new Date()): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(d);
}
