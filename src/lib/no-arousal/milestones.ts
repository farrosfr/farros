/**
 * NoArousal - Milestone Definitions & Dynamic Progress Calculation
 */

export interface Milestone {
  id: string;
  days: number;
  label: string; // e.g. "07 DAYS"
  title: string; // e.g. "7 DAYS"
  sublabel: string; // e.g. "First week"
}

export const MILESTONES: Milestone[] = [
  { id: 'm-7', days: 7, label: '07 DAYS', title: '7 DAYS', sublabel: 'First week' },
  { id: 'm-14', days: 14, label: '14 DAYS', title: '14 DAYS', sublabel: 'Two weeks' },
  { id: 'm-30', days: 30, label: '30 DAYS', title: '30 DAYS', sublabel: 'One month' },
  { id: 'm-60', days: 60, label: '60 DAYS', title: '60 DAYS', sublabel: 'Two months' },
  { id: 'm-90', days: 90, label: '90 DAYS', title: '90 DAYS', sublabel: 'New chapter' },
];

export interface MilestoneProgressResult {
  nextMilestone: Milestone;
  isAllCompleted: boolean;
  currentDays: number;
  remainingDays: number;
  percentage: number;
  supportingSentence: string;
  completedMilestoneIds: string[];
}

/**
 * Automatically calculates the next incomplete milestone and progress percentage.
 * Follows the visual spec:
 * E.g. at 4 days elapsed toward 7-day milestone:
 * - 3 days to go
 * - 57% complete (4/7 = ~57%)
 */
export function calculateMilestoneProgress(elapsedSeconds: number): MilestoneProgressResult {
  const currentDays = Math.floor(elapsedSeconds / 86400);

  const completedMilestoneIds = MILESTONES
    .filter((m) => currentDays >= m.days)
    .map((m) => m.id);

  const nextMilestone = MILESTONES.find((m) => currentDays < m.days) ?? MILESTONES[MILESTONES.length - 1];
  const isAllCompleted = currentDays >= MILESTONES[MILESTONES.length - 1].days;

  let remainingDays = Math.max(0, nextMilestone.days - currentDays);
  let percentage: number;

  if (isAllCompleted) {
    percentage = 100;
    remainingDays = 0;
  } else {
    // Exact percentage calculation based on current progress towards the target milestone
    percentage = Math.min(100, Math.max(0, Math.floor((currentDays / nextMilestone.days) * 100)));
  }

  const supportingSentence = 'Consistency is built one day at a time.';

  return {
    nextMilestone,
    isAllCompleted,
    currentDays,
    remainingDays,
    percentage,
    supportingSentence,
    completedMilestoneIds,
  };
}
