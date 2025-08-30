import { getHabits } from "@/app/actions";
import { HabitDashboard } from "@/components/habit-dashboard";

export default async function Home() {
  const habits = await getHabits();

  return (
    <main>
      <HabitDashboard initialHabits={habits} />
    </main>
  );
}
