import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-relevant-videos.ts';
import '@/ai/flows/analyze-exercise-video.ts';
import '@/ai/flows/generate-diet-plan.ts';
import '@/ai/flows/answer-fitness-queries.ts';