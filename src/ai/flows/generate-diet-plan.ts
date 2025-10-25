'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a personalized 7-day diet plan based on user biography and fitness goals.
 *
 * - generateDietPlan -  A function that generates a personalized 7-day diet plan.
 * - GenerateDietPlanInput - The input type for the generateDietPlan function.
 * - GenerateDietPlanOutput - The output type for the generateDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDietPlanInputSchema = z.object({
  biography: z
    .string()
    .describe("The user's biography, including age, gender, weight, height, and activity level."),
  fitnessGoals:
    z.string().describe('The user’s fitness goals, such as weight loss, muscle gain, or general health.'),
});

export type GenerateDietPlanInput = z.infer<typeof GenerateDietPlanInputSchema>;

const GenerateDietPlanOutputSchema = z.object({
  dietPlan: z
    .string()
    .describe('A personalized 7-day diet plan tailored to the user’s biography and fitness goals.'),
});

export type GenerateDietPlanOutput = z.infer<typeof GenerateDietPlanOutputSchema>;

export async function generateDietPlan(
  input: GenerateDietPlanInput
): Promise<GenerateDietPlanOutput> {
  return generateDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDietPlanPrompt',
  input: {schema: GenerateDietPlanInputSchema},
  output: {schema: GenerateDietPlanOutputSchema},
  prompt: `You are a certified nutritionist. Generate a personalized 7-day diet plan based on the user's biography and fitness goals.

User Biography: {{{biography}}}
Fitness Goals: {{{fitnessGoals}}}

Diet Plan:`,
});

const generateDietPlanFlow = ai.defineFlow(
  {
    name: 'generateDietPlanFlow',
    inputSchema: GenerateDietPlanInputSchema,
    outputSchema: GenerateDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
