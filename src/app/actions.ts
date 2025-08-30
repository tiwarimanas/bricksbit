"use server";

import { revalidatePath } from "next/cache";
import type { Habit } from "@/lib/types";
import { getMotivationalInsight } from "@/ai/flows/motivational-insights";
import { generateHabitPlan } from "@/ai/flows/generate-habit-plan";
import { db } from "@/lib/firebase"; // Use client SDK
import { collection, getDocs, doc, addDoc, updateDoc, query, orderBy, deleteDoc, getDoc } from "firebase/firestore";

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
    } catch (error)      {
      console.error("Error fetching habits:", error);
      return [];
    }
}

export async function addHabit(formData: FormData, userId: string) {
  const habitName = formData.get("habitName") as string;
  const habitStrength = formData.get("habitStrength") as string || 'medium';

  if (!habitName || habitName.trim().length === 0) {
    return { error: "Habit name cannot be empty." };
  }
  if (!userId) {
    return { error: "User not authenticated." };
  }

  try {
    const planResult = await generateHabitPlan({ habitName, habitStrength });
    const dailyPlan = planResult.plan;

    const newHabit: Omit<Habit, 'id'> = {
      name: habitName,
      createdAt: new Date().toISOString(),
      cycleStartDate: new Date().toISOString(),
      completions: Array(21).fill(false),
      dailyPlan: dailyPlan,
    };

    const habitsCollection = getHabitsCollection(userId);
    const habitRef = await addDoc(habitsCollection, newHabit);

    revalidatePath("/");
    return { success: true, id: habitRef.id };
  } catch (error) {
    console.error("Error adding habit with AI plan:", error);
    return { error: "Failed to generate AI plan. Please try again." };
  }
}

export async function toggleDayCompletion(habitId: string, dayIndex: number, userId: string) {
    if (!userId) return null;
    try {
        const habitRef = doc(db, 'users', userId, 'habits', habitId);
        
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
    } catch (error) {
        console.error("Error toggling day completion:", error);
        return null;
    }
}

export async function resetHabit(habitId: string, userId: string) {
    if (!userId) return;
    try {
        const habitRef = doc(db, 'users', userId, 'habits', habitId);
        await updateDoc(habitRef, {
            completions: Array(21).fill(false),
            cycleStartDate: new Date().toISOString(),
        });
        revalidatePath("/");
    } catch (error) {
        console.error("Error resetting habit:", error);
    }
}

export async function deleteHabit(habitId: string, userId: string) {
    if (!userId) return;
    try {
        const habitRef = doc(db, 'users', userId, 'habits', habitId);
        await deleteDoc(habitRef);
        revalidatePath("/");
    } catch (error) {
        console.error("Error deleting habit:", error);
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
