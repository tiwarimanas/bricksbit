"use client";

import { useTransition, useMemo } from "react";
import { RefreshCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Habit } from "@/lib/types";
import {
  toggleDayCompletion,
  resetHabit,
  getMotivationalInsightAction,
} from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const completedDays = useMemo(() => habit.completions.filter(Boolean).length, [habit.completions]);
  const progress = useMemo(() => Math.round((completedDays / 21) * 100), [completedDays]);

  const handleToggleDay = (dayIndex: number) => {
    startTransition(async () => {
      const updatedHabit = await toggleDayCompletion(habit.id, dayIndex);

      if (updatedHabit && updatedHabit.completions[dayIndex]) {
        // Only show insight when marking as complete
        const newCompletedDays = updatedHabit.completions.filter(Boolean).length;
        const newProgress = Math.round((newCompletedDays / 21) * 100);
        
        const shouldShowInsight = 
            (newCompletedDays === 1) || // First day
            (newCompletedDays === 7) || // One week
            (newCompletedDays === 14) || // Two weeks
            (newCompletedDays === 21) || // Goal!
            (progress < 50 && newProgress >= 50); // Crossed 50%

        if (shouldShowInsight) {
            const insight = await getMotivationalInsightAction(newProgress, newCompletedDays);
            toast({
              title: "Keep Going!",
              description: insight,
            });
        }
      }
    });
  };

  const handleReset = () => {
    startTransition(async () => {
      await resetHabit(habit.id);
      toast({
        title: "Cycle Reset",
        description: `Your cycle for "${habit.name}" has been reset.`,
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{habit.name}</CardTitle>
        <CardDescription>
          {completedDays} of 21 days completed. Keep it up!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">{progress}%</span>
          <Progress value={progress} />
        </div>
        <div className="grid grid-cols-7 gap-2">
          {habit.completions.map((isCompleted, index) => (
            <button
              key={index}
              disabled={isPending}
              onClick={() => handleToggleDay(index)}
              aria-label={`Day ${index + 1}`}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50",
                isCompleted
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-transparent hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={isPending}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset Cycle
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset your 21-day progress for this habit. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
