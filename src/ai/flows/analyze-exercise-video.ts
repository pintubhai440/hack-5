// File: ai/flows/analyze-exercise-video.ts

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// --- SCHEMAS (Koi change nahi) ---
const AnalyzeExerciseVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of a person performing an exercise, as a data URI..."
    ),
  exerciseType: z.string().describe('The type of exercise being performed...'),
});
export type AnalyzeExerciseVideoInput = z.infer<typeof AnalyzeExerciseVideoInputSchema>;

const AnalyzeExerciseVideoOutputSchema = z.object({
  repetitionCount: z.number().describe('The number of repetitions counted...'),
  formFeedback: z.string().optional().describe('Optional feedback...'),
});
export type AnalyzeExerciseVideoOutput = z.infer<typeof AnalyzeExerciseVideoOutputSchema>;

// --- PURANA FUNCTION (Ise hum ab frontend se call nahi karenge) ---
export async function analyzeExerciseVideo(
  input: AnalyzeExerciseVideoInput
): Promise<AnalyzeExerciseVideoOutput> {
  return analyzeExerciseVideoFlow(input);
}

// --- PROMPT (Koi change nahi) ---
const analyzeExerciseVideoPrompt = ai.definePrompt({
  name: 'analyzeExerciseVideoPrompt',
  input: { schema: AnalyzeExerciseVideoInputSchema },
  output: { schema: AnalyzeExerciseVideoOutputSchema },
  prompt: `You are a world-class AI fitness coach...
... (poora prompt jaisa tha) ...
Video: {{media url=videoDataUri}}
Exercise Type: {{{exerciseType}}}
`,
});

// --- FLOW (Sabse Zaroori Change: 'export' add karein) ---
// Pehle yeh 'const' tha, ab 'export const' hai
export const analyzeExerciseVideoFlow = ai.defineFlow(
  {
    name: 'analyzeExerciseVideoFlow',
    inputSchema: AnalyzeExerciseVideoInputSchema,
    outputSchema: AnalyzeExerciseVideoOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeExerciseVideoPrompt(input);
    return output!;
  }
);