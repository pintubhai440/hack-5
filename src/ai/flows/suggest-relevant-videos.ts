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
  videoSuggestions: z
    .array(z.string())
    .describe('A list of relevant exercise video URLs from external platforms.'),
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
  prompt: `You are an AI fitness assistant. Your task is to recommend relevant and valid YouTube videos based on a user's profile and fitness goals.

User Profile: {{{userProfile}}}
Fitness Goals: {{{fitnessGoals}}}

Please provide a list of exactly 3 valid and relevant YouTube video URLs. You must verify that each URL leads to a real, active video on YouTube. Do not invent or hallucinate any URLs. The format must be 'https://www.youtube.com/watch?v=VIDEO_ID'.
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
