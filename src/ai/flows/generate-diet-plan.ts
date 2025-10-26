'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a personalized 7-day diet plan based on user biography and fitness goals.
 *
 * - generateDietPlan -  A function that generates a personalized 7-day diet plan.
 * - GenerateDietPlanInput - The input type for the generateDietPlan function.
 * - GenerateDietPlanOutput - The output type for the generateDietPlan output.
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

// FIX: OutputSchema अब सिर्फ एक 'dietPlan' string expect करता है
const GenerateDietPlanOutputSchema = z.object({
  dietPlan: z
    .string()
    // FIX: Description में बताया गया है कि output सिर्फ एक simple Markdown string हो
    .describe('A complete 7-day diet plan in well-formatted Markdown text, tailored to the user’s biography and fitness goals.'),
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
  // FIX: Prompt को सख्त बनाया गया है कि वह सिर्फ Markdown Text दे, JSON format नहीं
  prompt: `You are a certified nutritionist. Generate a personalized, detailed, and comprehensive 7-day diet plan based on the user's biography and fitness goals.

User Biography: {{{biography}}}
Fitness Goals: {{{fitnessGoals}}}

**Instructions for Output:**
1. Generate the complete 7-day diet plan (Day 1 to Day 7).
2. For each day, include meals for Breakfast, Lunch, Dinner, and 1-2 Snacks.
3. Your entire response must be returned as a single JSON object matching the schema. The content of the 'dietPlan' field MUST be a single string containing the entire plan, clearly formatted using **Markdown headings and lists**.
4. Do NOT include any extra text outside the final JSON block.

Diet Plan Content (Use Markdown):`,
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