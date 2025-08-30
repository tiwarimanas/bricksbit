"use server";

import { revalidatePath } from "next/cache";
import type { Habit } from "@/lib/types";
import { getMotivationalInsight } from "@/ai/flows/motivational-insights";
import { db } from "@/lib/firebase-admin";
import { auth } from "firebase-admin";

async function getUserId() {
  // This is a placeholder for getting the user ID from the session in a real app
  // For now, we'll use a hardcoded user ID for demonstration with Firestore.
  // In a real scenario, you'd get this from the user's authentication state.
  // As we are not using a session management library, we can't get the user here.
  // We will assume a single user for now. A proper implementation would require
  // passing the user ID from the client, which is insecure, or using a session.
  return "test-user-id";
}

export async function getHabits(userId: string): Promise<Habit[]> {
    if (!userId) return [];
    const habitsSnapshot = await db.collection('users').doc(userId).collection('habits').orderBy('createdAt', 'desc').get();
    return habitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
}

export async function addHabit(formData: FormData, userId: string) {
  const habitName = formData.get("habitName") as string;
  if (!habitName || habitName.trim().length === 0) {
    return { error: "Habit name cannot be empty." };
  }
  if (!userId) {
    return { error: "User not authenticated." };
  }

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
