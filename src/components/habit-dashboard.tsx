"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Habit } from "@/lib/types";
import { AddHabitForm } from "@/components/add-habit-form";
import { HabitCard } from "@/components/habit-card";
import { Header } from "@/components/header";
import { getHabits } from "@/app/actions";
import { useAuth } from "@/contexts/auth-context";

export function HabitDashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isPending, startTransition] = useTransition();
  const { user, loading } = useAuth();
  const router = useRouter();

  const fetchHabits = useCallback(() => {
    if (user) {
      startTransition(async () => {
        const userHabits = await getHabits(user.uid);
        setHabits(userHabits);
      });
    } else {
      setHabits([]);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else {
      fetchHabits();
    }
  }, [user, loading, router, fetchHabits]);

  const onHabitChange = () => {
    fetchHabits();
  };

  if (loading || !user) {
    return (
       <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 bg-muted/40 p-4 md:p-8">
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8">
                <p>Loading...</p>
            </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-muted/40 p-4 md:p-8">
        <div className="mx-auto grid w-full max-w-4xl gap-4">
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Your Habits</h1>
              <AddHabitForm onHabitAdded={onHabitChange}/>
            </div>

            {isPending && habits.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8">
                  <p>Loading habits...</p>
                </div>
            ) : habits.length > 0 ? (
              <div className="grid gap-6">
                {habits.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} onHabitUpdated={onHabitChange} />
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
                    <AddHabitForm onHabitAdded={onHabitChange} />
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </main>
    </div>
  );
}
