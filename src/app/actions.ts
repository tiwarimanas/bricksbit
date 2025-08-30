"use server";

import { revalidatePath } from "next/cache";
import type { Habit } from "@/lib/types";
import { getMotivationalInsight } from "@/ai/flows/motivational-insights";

// Mock database using an in-memory array
let habits: Habit[] = [];

// Artificial delay to simulate network latency
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getHabits(): Promise<Habit[]> {
  await delay(500);
  return habits;
}

export async function addHabit(formData: FormData) {
  const habitName = formData.get("habitName") as string;
  if (!habitName || habitName.trim().length === 0) {
    return { error: "Habit name cannot be empty." };
  }

  const newHabit: Habit = {
    id: Date.now().toString(),
    name: habitName,
    createdAt: new Date().toISOString(),
    cycleStartDate: new Date().toISOString(),
    completions: Array(21).fill(false),
  };

  await delay(500);
  habits.push(newHabit);
  revalidatePath("/");
  return { success: true };
}

export async function toggleDayCompletion(habitId: string, dayIndex: number) {
  await delay(100);
  const habit = habits.find((h) => h.id === habitId);
  if (habit && habit.completions[dayIndex] !== undefined) {
    habit.completions[dayIndex] = !habit.completions[dayIndex];
    revalidatePath("/");
    return habit;
  }
  return null;
}

export async function resetHabit(habitId: string) {
  await delay(500);
  const habit = habits.find((h) => h.id === habitId);
  if (habit) {
    habit.completions = Array(21).fill(false);
    habit.cycleStartDate = new Date().toISOString();
    revalidatePath("/");
  }
}

export async function getMotivationalInsightAction(
  progressPercentage: number,
  daysCompleted: number
) {
  try {
    const result = await getMotivationalInsight({
      progressPercentage,
      daysCompleted,
    });
    return result.insight;
  } catch (error) {
    console.error("Error fetching motivational insight:", error);
    return "Keep up the great work! Every step forward is a victory.";
  }
}
