"use client";

import { useTransition, useMemo, useState } from "react";
import { RefreshCcw, MoreVertical, Trash2, FileDown } from "lucide-react";
import jsPDF from "jspdf";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Habit } from "@/lib/types";
import {
  toggleDayCompletion,
  resetHabit,
  getMotivationalInsightAction,
  deleteHabit,
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
import { useAuth } from "@/contexts/auth-context";

interface HabitCardProps {
  habit: Habit;
  onHabitUpdated: () => void;
}

export function HabitCard({ habit, onHabitUpdated }: HabitCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const completedDays = useMemo(() => habit.completions.filter(Boolean).length, [habit.completions]);
  const progress = useMemo(() => Math.round((completedDays / 21) * 100), [completedDays]);

  const handleToggleDay = (dayIndex: number) => {
    if (!user) return;
    startTransition(async () => {
      const updatedHabit = await toggleDayCompletion(habit.id, dayIndex, user.uid);
      onHabitUpdated();

      if (updatedHabit && updatedHabit.completions[dayIndex]) {
        // Only show insight when marking as complete
        const newCompletedDays = updatedHabit.completions.filter(Boolean).length;
        const newProgress = Math.round((newCompletedDays / 21) * 100);
        
        const shouldShowInsight = 
            (newCompletedDays === 1) || // First day
            (newCompletedDays === 7) || // One week
            (newCompletedDays === 14) || // Two weeks
            (newCompletedDays === 21) || // Goal!
            (progress < 50 && newProgress >= 50);

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
    if (!user) return;
    startTransition(async () => {
      await resetHabit(habit.id, user.uid);
      onHabitUpdated();
      toast({
        title: "Cycle Reset",
        description: `Your cycle for "${habit.name}" has been reset.`,
      });
    });
  };

  const handleDelete = () => {
    if (!user) return;
    startTransition(async () => {
        await deleteHabit(habit.id, user.uid);
        onHabitUpdated();
        toast({
            title: "Habit Deleted",
            description: `"${habit.name}" has been removed.`,
        });
        setDeleteAlertOpen(false);
    });
  };
  
  const handleExport = () => {
    startTransition(() => {
        const doc = new jsPDF();
        const cycleStartDate = new Date(habit.cycleStartDate);

        doc.setFontSize(22);
        doc.text(`Habit: ${habit.name}`, 15, 20);

        doc.setFontSize(16);
        doc.text(`Progress Report`, 15, 30);

        doc.setFontSize(12);
        doc.text(`Cycle Started: ${cycleStartDate.toLocaleDateString()}`, 15, 40);
        doc.text(`Days Completed: ${completedDays} of 21`, 15, 46);
        doc.text(`Overall Progress: ${progress}%`, 15, 52);

        doc.line(15, 58, 195, 58); // Horizontal line

        doc.setFontSize(14);
        doc.text("Daily Completion Status", 15, 68);

        let yPos = 76;
        habit.completions.forEach((isCompleted, index) => {
            if (yPos > 280) { // Add new page if content overflows
                doc.addPage();
                yPos = 20;
            }
            const dayDate = new Date(cycleStartDate);
            dayDate.setDate(cycleStartDate.getDate() + index);
            
            const status = isCompleted ? "Completed" : "Incomplete";
            const dateString = dayDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

            doc.setFontSize(12);
            doc.text(`Day ${index + 1} (${dateString}):`, 20, yPos);
            doc.setTextColor(isCompleted ? "#4CAF50" : "#F44336");
            doc.text(status, 100, yPos);
            doc.setTextColor("#000000"); // Reset color
            yPos += 7;
        });

        doc.save(`habit-report-${habit.name.replace(/\s+/g, '-')}.pdf`);
        toast({
            title: "Export Successful",
            description: "Your habit report has been downloaded.",
        });
    });
  }

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
      <CardFooter className="flex justify-between">
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

        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isPending}>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Habit
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <DropdownMenuItem onClick={handleExport} disabled={isPending}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Export PDF
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete your habit and all its progress. This action cannot be undone.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
