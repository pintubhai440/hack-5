'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { analyzeExerciseVideo } from '@/ai/flows/analyze-exercise-video';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Video, VideoOff, Play, Square, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

type AnalysisResult = {
  repetitionCount: number;
  formFeedback?: string;
};

// Helper function to convert Blob to Base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}


export default function LiveSessionPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [exerciseType, setExerciseType] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, startAnalysisTransition] = useTransition();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const setupStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description: "Please allow camera access in your browser settings to use this feature.",
      });
    }
  };
  
  useEffect(() => {
    setupStream();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartRecording = () => {
    if (stream) {
      setIsRecording(true);
      setRecordedBlob(null);
      setVideoPreview(null);
      setAnalysisResult(null);
      recordedChunksRef.current = [];
      
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoPreview(url);
      };
      recorder.start();
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };
  
  const handleReset = () => {
    setRecordedBlob(null);
    setVideoPreview(null);
    setAnalysisResult(null);
    setupStream();
  }

  const handleAnalyze = () => {
    if (!recordedBlob || !exerciseType) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please record a video and select an exercise type.",
      });
      return;
    }
    
    startAnalysisTransition(async () => {
      try {
        const base64data = await blobToBase64(recordedBlob);
        const result = await analyzeExerciseVideo({
          videoDataUri: base64data,
          exerciseType: exerciseType,
        });
        setAnalysisResult(result);
      } catch (error) {
        console.error("Analysis failed:", error);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "There was an error analyzing your video. Please try again.",
        });
      }
    });
  };
  

  return (
    <div className="container mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Live Exercise Session</CardTitle>
          <CardDescription>Record yourself performing an exercise, and we'll count your reps.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
            {isRecording && <Badge variant="destructive" className="absolute top-2 right-2">REC</Badge>}
            {!stream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white">
                    <VideoOff className="h-10 w-10" />
                    <p>Camera not available</p>
                </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="exercise-type">Exercise Type</Label>
            <Select onValueChange={setExerciseType} value={exerciseType} disabled={isRecording || !!videoPreview}>
              <SelectTrigger id="exercise-type">
                <SelectValue placeholder="Select an exercise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Push-ups">Push-ups</SelectItem>
                <SelectItem value="Squats">Squats</SelectItem>
                <SelectItem value="Pull-ups">Pull-ups</SelectItem>
                <SelectItem value="Lunges">Lunges</SelectItem>
                <SelectItem value="Sit-ups">Sit-ups</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {videoPreview && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Recorded Video Preview:</p>
              <video src={videoPreview} controls className="w-full rounded-lg"></video>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex-wrap gap-2">
          {!videoPreview ? (
            !isRecording ? (
              <Button onClick={handleStartRecording} disabled={!stream}>
                <Play className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            ) : (
              <Button onClick={handleStopRecording} variant="destructive">
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )
          ) : (
            <>
              <Button onClick={handleAnalyze} disabled={isAnalyzing || !exerciseType}>
                {isAnalyzing ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                ) : 'Analyze Video'}
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Record Again
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
      
       {analysisResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              Analysis Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-baseline gap-4 rounded-lg bg-muted p-4">
              <span className="text-sm font-medium text-muted-foreground">Repetition Count</span>
              <span className="text-4xl font-bold text-primary">{analysisResult.repetitionCount}</span>
            </div>
            {analysisResult.formFeedback && (
              <div>
                <h4 className="font-semibold mb-2">Form Feedback</h4>
                <div className="flex items-start gap-4 rounded-lg border bg-card p-4">
                   <AlertTriangle className="h-5 w-5 text-amber-500 mt-1" />
                   <p className="text-sm text-muted-foreground">{analysisResult.formFeedback}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
