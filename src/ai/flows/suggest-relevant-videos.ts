'use server';

/**
 * @fileOverview Suggests relevant exercise videos from external platforms based on the user's profile and goals.
 *
 * - suggestRelevantVideos - A function that suggests relevant exercise videos.
 * - SuggestRelevantVideosInput - The input type for the suggestRelevantVideos function.
 * - SuggestRelevantVideosOutput - The return type for the suggestRelevantVideos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantVideosInputSchema = z.object({
  userProfile: z
    .string()
    .describe('A detailed description of the user profile, including age, gender, fitness level, and any health conditions.'),
  fitnessGoals: z
    .string()
    .describe('The user fitness goals, such as weight loss, muscle gain, or improved endurance.'),
});
export type SuggestRelevantVideosInput = z.infer<typeof SuggestRelevantVideosInputSchema>;

const SuggestRelevantVideosOutputSchema = z.object({
  searchQueries: z
    .array(z.string())
    .describe('A list of YouTube search queries, not URLs.'),
});
export type SuggestRelevantVideosOutput = z.infer<typeof SuggestRelevantVideosOutputSchema>;

export async function suggestRelevantVideos(
  input: SuggestRelevantVideosInput
): Promise<SuggestRelevantVideosOutput> {
  return suggestRelevantVideosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantVideosPrompt',
  input: {schema: SuggestRelevantVideosInputSchema},
  output: {schema: SuggestRelevantVideosOutputSchema},
  prompt: `You are an AI fitness assistant. Your task is to suggest relevant YouTube search topics based on a user's profile and fitness goals.

User Profile: {{{userProfile}}}
Fitness Goals: {{{fitnessGoals}}}

Please provide a list of exactly 3 concise and effective YouTube search queries.
For example: 'best 10 min six pack workout' or 'beginner full body workout at home'.
Do not provide URLs, only provide the search query text. Return the queries as an array of strings.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const suggestRelevantVideosFlow = ai.defineFlow(
  {
    name: 'suggestRelevantVideosFlow',
    inputSchema: SuggestRelevantVideosInputSchema,
    outputSchema: SuggestRelevantVideosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
