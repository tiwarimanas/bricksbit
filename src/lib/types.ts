import * as z from 'zod';

export interface Habit {
  id: string;
  name: string;
  createdAt: string; // ISO string
  cycleStartDate: string; // ISO string
  completions: boolean[]; // Array of 21 booleans
}

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type SignInData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
});

export type SignUpData = z.infer<typeof signupSchema>;
