'use server';

/**
 * @fileOverview A fitness and health question answering AI agent.
 *
 * - answerFitnessQuery - A function that answers user questions about fitness and health, providing age-appropriate and personalized advice.
 * - AnswerFitnessQueryInput - The input type for the answerFitnessQuery function.
 * - AnswerFitnessQueryOutput - The return type for the answerFitnessQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFitnessQueryInputSchema = z.object({
  query: z.string().describe('The user question about fitness or health.'),
  biography: z.string().describe('The user biography including age and fitness goals.'),
});
export type AnswerFitnessQueryInput = z.infer<typeof AnswerFitnessQueryInputSchema>;

const AnswerFitnessQueryOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question, personalized based on their biography.'),
});
export type AnswerFitnessQueryOutput = z.infer<typeof AnswerFitnessQueryOutputSchema>;

export async function answerFitnessQuery(input: AnswerFitnessQueryInput): Promise<AnswerFitnessQueryOutput> {
  return answerFitnessQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFitnessQueryPrompt',
  input: {schema: AnswerFitnessQueryInputSchema},
  output: {schema: AnswerFitnessQueryOutputSchema},
  prompt: `You are a friendly and encouraging AI fitness and health expert. Your goal is to have a natural conversation with the user, providing expert, age-appropriate, and personalized advice based on their biography. Be conversational and supportive.

User Biography: {{{biography}}}

User's Question: {{{query}}}

Your Conversational Answer:`,
});

const answerFitnessQueryFlow = ai.defineFlow(
  {
    name: 'answerFitnessQueryFlow',
    inputSchema: AnswerFitnessQueryInputSchema,
    outputSchema: AnswerFitnessQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
