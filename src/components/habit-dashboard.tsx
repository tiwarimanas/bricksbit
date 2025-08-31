"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import type { Habit } from "@/lib/types";
import { AddHabitForm } from "@/components/add-habit-form";
import { HabitCard } from "@/components/habit-card";
import { Header } from "@/components/header";
import { getHabits } from "@/app/actions";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "./ui/button";

const GoogleLogo = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4818h4.844c-.2086 1.125-.844 2.0782-1.7777 2.7218v2.2591h2.9087c1.7018-1.5668 2.684-3.875 2.684-6.6218z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1818l-2.9087-2.2591c-.806.5427-1.8409.8618-2.9932.8618-2.3127 0-4.2659-1.5668-4.9636-3.675H1.05v2.3318C2.5327 16.5118 5.4818 18 9 18z" fill="#34A853"/>
            <path d="M4.0364 10.71c-.1827-.5427-.2827-1.1168-.2827-1.71s.1-1.1673.2827-1.71V4.9582H1.05C.3718 6.2755 0 7.5927 0 9s.3718 2.7245 1.05 4.0418l2.9864-2.3318z" fill="#FBBC05"/>
            <path d="M9 3.5455c1.3218 0 2.5082.4555 3.4409 1.3464l2.5855-2.5855C13.4636.8873 11.4259 0 9 0 5.4818 0 2.5327 1.4882 1.05 4.0418L4.0364 6.3736c.6977-2.1082 2.6509-3.675 4.9636-3.675z" fill="#EA4335"/>
        </g>
    </svg>
);


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
                    <Button onClick={signInWithGoogle}>
                        <GoogleLogo />
                        <span>Sign in with Google</span>
                    </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
