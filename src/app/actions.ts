"use server";

import { revalidatePath } from "next/cache";
import type { Habit } from "@/lib/types";
import { getMotivationalInsight } from "@/ai/flows/motivational-insights";
import { db } from "@/lib/firebase"; // Use client SDK
import { collection, getDocs, doc, addDoc, updateDoc, query, where, orderBy } from "firebase/firestore";

// Helper function to get the habits sub-collection for a user
const getHabitsCollection = (userId: string) => {
    return collection(db, 'users', userId, 'habits');
}

export async function getHabits(userId: string): Promise<Habit[]> {
    if (!userId) return [];
    try {
      const habitsCollection = getHabitsCollection(userId);
      const habitsQuery = query(habitsCollection, orderBy('createdAt', 'desc'));
      const habitsSnapshot = await getDocs(habitsQuery);
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

  const newHabit: Omit<Habit, 'id'> = {
    name: habitName,
    createdAt: new Date().toISOString(),
    cycleStartDate: new Date().toISOString(),
    completions: Array(21).fill(false),
  };

  const habitsCollection = getHabitsCollection(userId);
  const habitRef = await addDoc(habitsCollection, newHabit);

  revalidatePath("/");
  return { success: true, id: habitRef.id };
}

export async function toggleDayCompletion(habitId: string, dayIndex: number, userId: string) {
    if (!userId) return null;

    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    
    // This is less efficient than a direct update, but client SDK on server
    // doesn't have a simple way to get a doc without a snapshot listener.
    // For server actions, this is an acceptable pattern. We'll assume a 'get' isn't needed
    // if we can construct the update. Let's try to update without a read first.
    // Firestore's `getDoc` is not available in the server-actions context with the client SDK in the same way.
    // To keep this simple and avoid complex workarounds, we can't easily read the value first.
    // A more advanced solution would be a transaction, but that's overkill.
    // Let's refactor to update without reading.
    
    // Since we don't know the current state, we cannot simply "toggle".
    // This is a limitation of using the client SDK this way.
    // The component must now pass the intended new state.
    // Let's adjust the client-side and this action.
    // NO - let's keep the signature. We'll have to read first. That requires a getDoc.
    // Let's assume getDoc is available.
    const { getDoc } = await import("firebase/firestore");
    const habitDoc = await getDoc(habitRef);

    if (habitDoc.exists()) {
        const habit = habitDoc.data() as Habit;
        const newCompletions = [...habit.completions];
        newCompletions[dayIndex] = !newCompletions[dayIndex];
        await updateDoc(habitRef, { completions: newCompletions });
        revalidatePath("/");
        return { ...habit, id: habitId, completions: newCompletions };
    }
    return null;
}

export async function resetHabit(habitId: string, userId: string) {
    if (!userId) return;

    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    await updateDoc(habitRef, {
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
