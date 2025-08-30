export interface Habit {
  id: string;
  name: string;
  createdAt: string; // ISO string
  cycleStartDate: string; // ISO string
  completions: boolean[]; // Array of 21 booleans
  dailyPlan?: string[]; // Optional array of 21 strings for AI-generated plan
}
