"use client";

import { useState, useTransition } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addHabit } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

export function AddHabitForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await addHabit(formData);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          title: "Success",
          description: "New habit added.",
        });
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new habit</DialogTitle>
          <DialogDescription>
            What new habit would you like to build? It takes 21 days to make a habit stick.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="habitName" className="text-right">
                Habit
              </Label>
              <Input
                id="habitName"
                name="habitName"
                placeholder="e.g., Drink 8 glasses of water"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
