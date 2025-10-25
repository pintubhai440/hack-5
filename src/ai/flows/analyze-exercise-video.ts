'use server';

/**
 * @fileOverview Analyzes a video to count exercise repetitions and provide form feedback.
 *
 * - analyzeExerciseVideo - A function that handles the exercise video analysis process.
 * - AnalyzeExerciseVideoInput - The input type for the analyzeExerciseVideo function.
 * - AnalyzeExerciseVideoOutput - The return type for the analyzeExerciseVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeExerciseVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of a person performing an exercise, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Maximum 45 seconds."
    ),
  exerciseType: z.string().describe('The type of exercise being performed (e.g., push-ups, squats).'),
});
export type AnalyzeExerciseVideoInput = z.infer<typeof AnalyzeExerciseVideoInputSchema>;

const AnalyzeExerciseVideoOutputSchema = z.object({
  repetitionCount: z.number().describe('The number of repetitions counted in the video.'),
  formFeedback: z.string().optional().describe('Optional feedback on the user\'s form during the exercise.'),
});
export type AnalyzeExerciseVideoOutput = z.infer<typeof AnalyzeExerciseVideoOutputSchema>;

export async function analyzeExerciseVideo(input: AnalyzeExerciseVideoInput): Promise<AnalyzeExerciseVideoOutput> {
  return analyzeExerciseVideoFlow(input);
}

const analyzeExerciseVideoPrompt = ai.definePrompt({
  name: 'analyzeExerciseVideoPrompt',
  input: {schema: AnalyzeExerciseVideoInputSchema},
  output: {schema: AnalyzeExerciseVideoOutputSchema},
  prompt: `You are a world-class AI fitness coach with expertise in biomechanics and exercise science. Your task is to analyze a user-submitted video and provide an accurate repetition count and constructive form feedback.

**Video Analysis Instructions:**

1.  **Exercise Identification:** The user has specified the exercise is '{{{exerciseType}}}'.
2.  **Repetition Counting:**
    *   Carefully analyze the video frame-by-frame.
    *   Count only **full, completed repetitions** based on the criteria below.
    * **Push-up:** A full rep involves lowering the body by bending the elbows significantly (to at least 90 degrees) and then pushing back up until the arms are nearly straight.
    *   **Squat:** A full rep involves lowering the hips until the thighs are at least parallel to the floor, then returning to a standing position.
    *   **Pull-up:** A full rep starts from a full hang, pulling the body up until the chin is over the bar, and then lowering back to a full hang.
    *   **Lunge:** A full rep involves stepping forward or backward, lowering both knees to approximately 90-degree angles, and returning to the starting position. One leg movement counts as one rep.
    *   **Sit-up:** A full rep involves raising the torso from a supine position until the chest is close to the knees and then returning to the starting position.
3.  **Form Feedback:**
    *   If you observe significant deviations from proper form (e.g., partial range of motion, incorrect posture, unsafe movements), provide concise, actionable feedback.
    *   If the user's form is good, you do not need to provide feedback.
4.  **Output:** Return the total number of completed repetitions and any form feedback in the specified JSON format.

**User Video and Exercise:**
Video: {{media url=videoDataUri}}
Exercise Type: {{{exerciseType}}}
`,
});

const analyzeExerciseVideoFlow = ai.defineFlow(
  {
    name: 'analyzeExerciseVideoFlow',
    inputSchema: AnalyzeExerciseVideoInputSchema,
    outputSchema: AnalyzeExerciseVideoOutputSchema,
  },
  async input => {
    const {output} = await analyzeExerciseVideoPrompt(input);
    return output!;
  }
);
