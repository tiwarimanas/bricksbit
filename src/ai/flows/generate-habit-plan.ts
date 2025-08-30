'use server';

/**
 * @fileOverview An AI agent for generating 21-day habit plans.
 *
 * - generateHabitPlan - A function that creates a progressive, 21-day plan for a given habit.
 * - GenerateHabitPlanInput - The input type for the generateHabitPlan function.
 * - GenerateHabitPlanOutput - The return type for the generateHabitPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateHabitPlanInputSchema = z.object({
  habitName: z
    .string()
    .describe('The name of the habit the user wants to build.'),
  habitStrength: z
    .string()
    .describe('The desired intensity of the habit plan (e.g., low, medium, high).'),
});
export type GenerateHabitPlanInput = z.infer<
  typeof GenerateHabitPlanInputSchema
>;

const GenerateHabitPlanOutputSchema = z.object({
  plan: z
    .array(z.string())
    .length(21)
    .describe('A 21-day plan with daily actionable goals.'),
});
export type GenerateHabitPlanOutput = z.infer<
  typeof GenerateHabitPlanOutputSchema
>;

export async function generateHabitPlan(
  input: GenerateHabitPlanInput
): Promise<GenerateHabitPlanOutput> {
  return generateHabitPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHabitPlanPrompt',
  input: { schema: GenerateHabitPlanInputSchema },
  output: { schema: GenerateHabitPlanOutputSchema },
  prompt: `You are a habit-building expert. A user wants to build the habit: "{{habitName}}".

  The user has specified they want a "{{habitStrength}}" intensity plan.
  Create a 21-day action plan for them. The plan must contain exactly 21 daily goals.
  Each daily goal should be a short, concrete, and actionable task.
  The difficulty should increase gradually based on the requested strength.
  - For "low" strength, the increase in difficulty should be very gentle and slow.
  - For "medium" strength, it should be a steady, manageable progression.
  - For "high" strength, the difficulty should ramp up more quickly and be more challenging.

  For example, if the habit is "Read more books" and strength is "medium", a plan could be:
  Day 1: "Read for 5 minutes."
  Day 2: "Read for 7 minutes."
  ...
  Day 21: "Read a chapter of a book."

  Generate the plan now for the habit: "{{habitName}}" with "{{habitStrength}}" intensity.`,
});

const generateHabitPlanFlow = ai.defineFlow(
  {
    name: 'generateHabitPlanFlow',
    inputSchema: GenerateHabitPlanInputSchema,
    outputSchema: GenerateHabitPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
