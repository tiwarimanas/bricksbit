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
import { useAuth } from "@/contexts/auth-context";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface AddHabitFormProps {
    onHabitAdded: () => void;
}

export function AddHabitForm({ onHabitAdded }: AddHabitFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = (formData: FormData) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be signed in to add a habit.",
        });
        return;
    }
    startTransition(async () => {
      const result = await addHabit(formData, user.uid);
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
        onHabitAdded();
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
            <div className="grid grid-cols-4 items-start gap-4">
               <Label htmlFor="habitStrength" className="text-right pt-2">
                Intensity
              </Label>
              <RadioGroup name="habitStrength" defaultValue="medium" className="col-span-3 flex space-x-4 pt-2">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High</Label>
                </div>
              </RadioGroup>
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
