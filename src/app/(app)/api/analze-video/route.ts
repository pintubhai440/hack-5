// File: app/api/analyze-video/route.ts

import { NextResponse } from 'next/server';
// Hum aapke Genkit flow ko yahan import kar rahe hain
import { analyzeExerciseVideoFlow } from '@/ai/flows/analyze-exercise-video';

export async function POST(request: Request) {
  try {
    // Step 1: Frontend se "parcel" (FormData) receive karein
    const formData = await request.formData();
    const videoFile = formData.get('videoFile') as File;
    const exerciseType = formData.get('exerciseType') as string;

    if (!videoFile || !exerciseType) {
      return NextResponse.json(
        { error: 'Missing video file or exercise type' },
        { status: 400 }
      );
    }

    // Step 2: Video file ko Base64 text string mein convert karein (Server par)
    const videoBuffer = await videoFile.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');
    const mimeType = videoFile.type;
    const videoDataUri = `data:${mimeType};base64,${videoBase64}`;

    // Step 3: AI flow ko wahi data dein jo use chahiye (JSON object)
    const analysisInput = {
      videoDataUri: videoDataUri,
      exerciseType: exerciseType,
    };

    // Step 4: AI flow ko call karein aur result ka wait karein
    const result = await analyzeExerciseVideoFlow(analysisInput);

    // Step 5: Result ko frontend par wapas bhej dein
    return NextResponse.json(result);

  } catch (error) {
    console.error('SERVER API ROUTE ERROR:', error);
    return NextResponse.json(
      { error: 'Analysis failed on the server.' },
      { status: 500 }
    );
  }
}