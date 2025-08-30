"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import type { Habit } from "@/lib/types";
import { AddHabitForm } from "@/components/add-habit-form";
import { HabitCard } from "@/components/habit-card";
import { Header } from "@/components/header";
import { getHabits } from "@/app/actions";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "./ui/button";

export function HabitDashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isPending, startTransition] = useTransition();
  const { user, loading, signInWithGoogle } = useAuth();

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
    fetchHabits();
  }, [user, fetchHabits]);

  const onHabitChange = () => {
    fetchHabits();
  };

  if (loading) {
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
          {user ? (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
              <div className="flex flex-col items-center gap-2 text-center p-8">
                <h3 className="text-2xl font-bold tracking-tight">
                  Welcome to Bricksbit
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sign in to start tracking your habits and building a better you.
                </p>
                <div className="mt-4">
                  <Button onClick={signInWithGoogle}>Sign in with Google</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
