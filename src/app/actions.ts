"use server";

import { revalidatePath } from "next/cache";
import type { Habit } from "@/lib/types";
import { getMotivationalInsight } from "@/ai/flows/motivational-insights";
import { getDb } from "@/lib/firebase-admin";

export async function getHabits(userId: string): Promise<Habit[]> {
    if (!userId) return [];
    try {
      const db = getDb();
      const habitsSnapshot = await db.collection('users').doc(userId).collection('habits').orderBy('createdAt', 'desc').get();
      return habitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
    } catch (error) {
      console.error("Error fetching habits:", error);
      return [];
    }
}

export async function addHabit(formData: FormData, userId: string) {
  const habitName = formData.get("habitName") as string;
  if (!habitName || habitName.trim().length === 0) {
    return { error: "Habit name cannot be empty." };
  }
  if (!userId) {
    return { error: "User not authenticated." };
  }
  
  const db = getDb();

  const newHabit: Omit<Habit, 'id'> = {
    name: habitName,
    createdAt: new Date().toISOString(),
    cycleStartDate: new Date().toISOString(),
    completions: Array(21).fill(false),
  };

  const habitRef = await db.collection('users').doc(userId).collection('habits').add(newHabit);

  revalidatePath("/");
  return { success: true, id: habitRef.id };
}

export async function toggleDayCompletion(habitId: string, dayIndex: number, userId: string) {
    if (!userId) return null;

    const db = getDb();
    const habitRef = db.collection('users').doc(userId).collection('habits').doc(habitId);
    const habitDoc = await habitRef.get();

    if (habitDoc.exists) {
        const habit = habitDoc.data() as Habit;
        const newCompletions = [...habit.completions];
        newCompletions[dayIndex] = !newCompletions[dayIndex];
        await habitRef.update({ completions: newCompletions });
        revalidatePath("/");
        return { ...habit, id: habitId, completions: newCompletions };
    }
    return null;
}

export async function resetHabit(habitId: string, userId: string) {
    if (!userId) return;
    
    const db = getDb();
    const habitRef = db.collection('users').doc(userId).collection('habits').doc(habitId);
    await habitRef.update({
        completions: Array(21).fill(false),
        cycleStartDate: new Date().toISOString(),
    });
    revalidatePath("/");
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
