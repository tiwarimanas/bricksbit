'use server';

/**
 * @fileOverview A motivational insights AI agent.
 *
 * - getMotivationalInsight - A function that generates motivational insights based on user progress.
 * - MotivationalInsightInput - The input type for the getMotivationalInsight function.
 * - MotivationalInsightOutput - The return type for the getMotivationalInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalInsightInputSchema = z.object({
  progressPercentage: z
    .number()
    .describe(
      'The current progress percentage of the user in their 21-day habit cycle (0-100).'
    ),
  daysCompleted: z
    .number()
    .describe('The number of days the user has completed in their habit cycle.'),
});
export type MotivationalInsightInput = z.infer<typeof MotivationalInsightInputSchema>;

const MotivationalInsightOutputSchema = z.object({
  insight: z.string().describe('A motivational message to encourage the user.'),
});
export type MotivationalInsightOutput = z.infer<typeof MotivationalInsightOutputSchema>;

export async function getMotivationalInsight(
  input: MotivationalInsightInput
): Promise<MotivationalInsightOutput> {
  return motivationalInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalInsightPrompt',
  input: {schema: MotivationalInsightInputSchema},
  output: {schema: MotivationalInsightOutputSchema},
  prompt: `You are a motivational coach providing encouraging insights to users tracking their habits.

  Based on their current progress ({{progressPercentage}}%) and the number of days they've completed ({{daysCompleted}}), generate a short, positive message to motivate them to continue building their habits.

  Focus on the positive aspects of their progress and encourage them to keep going.
  Tailor the message to be relevant to their current stage in the 21-day cycle.

  If the user has just started, encourage them to keep going.
  If the user is in the middle, remind them of their progress so far.
  If the user is near the end, encourage them to finish strong.
  `,
});

const motivationalInsightFlow = ai.defineFlow(
  {
    name: 'motivationalInsightFlow',
    inputSchema: MotivationalInsightInputSchema,
    outputSchema: MotivationalInsightOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
