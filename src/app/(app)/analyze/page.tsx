'use client';

import { useState, useRef, useTransition } from 'react';
// YEH AAPKA UPDATED BACKEND FUNCTION HAI
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

// Analysis result ka type same rahega
type AnalysisResult = {
  repetitionCount: number;
  formFeedback?: string;
};

export default function AnalyzeVideoPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [exerciseType, setExerciseType] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a video smaller than 50MB.",
        });
        return;
      }

      setAnalysisResult(null); // Purana result clear karo

      // Video duration check karne ke liye
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';

      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src); // Memory release karo
        if (videoElement.duration > 45) {
          toast({
            variant: "destructive",
            title: "Video too long",
            description: "Please upload a video with a maximum duration of 45 seconds.",
          });
          setVideoFile(null);
          setVideoPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          // Sab theek hai, file aur preview set karo
          setVideoFile(file);
          // Purana preview clear karo (agar ho toh)
          if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
          }
          setVideoPreview(URL.createObjectURL(file)); // Data URI ki jagah Object URL use karein
        }
      };
      
      videoElement.src = URL.createObjectURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!videoFile || !exerciseType) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please upload a video and select an exercise type.",
      });
      return;
    }

    startTransition(async () => {
      try {
        // *** YEH HISSA BADAL GAYA HAI ***
        // Ab hum FormData bhej rahe hain, naaki JSON object
        const formData = new FormData();
        formData.append('videoFile', videoFile);
        formData.append('exerciseType', exerciseType);

        // Server action ko 'formData' parcel bhej rahe hain
        const result = await analyzeExerciseVideo(formData);
        
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
    // Aapka JSX (HTML) bilkul same rahega, usmein koi change nahi hai
    <div className="container mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Exercise Video</CardTitle>
          <CardDescription>
            Upload a video (max 45 seconds) of your exercise to count reps and get form feedback.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="exercise-type">Exercise Type</Label>
            <Select onValueChange={setExerciseType} value={exerciseType}>
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
          <div className="grid gap-2">
            <Label htmlFor="video-upload">Video Upload</Label>
            <Input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} ref={fileInputRef} className="file:text-primary"/>
          </div>

          {videoPreview && (
            <div className="mt-4">
              <video
                src={videoPreview}
                controls
                className="w-full rounded-lg"
              ></video>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyze} disabled={isPending || !videoFile || !exerciseType}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Video'
            )}
          </Button>
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