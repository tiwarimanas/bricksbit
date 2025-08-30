
"use client";

import { useEffect, useState } from "react";
import type { Habit } from "@/lib/types";
import { AddHabitForm } from "@/components/add-habit-form";
import { HabitCard } from "@/components/habit-card";
import { Header } from "@/components/header";

interface HabitDashboardProps {
  initialHabits: Habit[];
}

export function HabitDashboard({ initialHabits }: HabitDashboardProps) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  useEffect(() => {
    setHabits(initialHabits);
  }, [initialHabits]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-muted/40 p-4 md:p-8">
        <div className="mx-auto grid w-full max-w-4xl gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Your Habits</h1>
            <AddHabitForm />
          </div>

          {habits.length > 0 ? (
            <div className="grid gap-6">
              {habits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
              <div className="flex flex-col items-center gap-2 text-center p-8">
                <h3 className="text-2xl font-bold tracking-tight">
                  You have no habits yet.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get started by adding a new habit to track.
                </p>
                <div className="mt-4">
                  <AddHabitForm />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
