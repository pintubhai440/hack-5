'use client';

import { useState, useTransition } from 'react';
import { generateDietPlan } from '@/ai/flows/generate-diet-plan';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
// import { Markdown } from '@/components/ui/markdown'; // Agar aap Markdown component use kar rahe hain

// FIX: OutputType ko backend ke naye schema se match kiya gaya
type DietPlanResult = {
  dietPlan: string;
};

export default function DietPlannerPage() {
  const [userBiography, setUserBiography] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('');
  // FIX: Ab hum sirf dietPlan string store karenge
  const [dietPlan, setDietPlan] = useState<string | null>(null); 
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGeneratePlan = () => {
    if (!userBiography || !fitnessGoals) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill out all required fields.',
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await generateDietPlan({
          biography: userBiography,
          fitnessGoals: fitnessGoals,
        });
        
        // FIX: Hum result se sirf 'dietPlan' string nikal kar state mein save kar rahe hain
        setDietPlan(result.dietPlan); 
        
        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Diet plan generated successfully.',
        });

      } catch (error) {
        console.error('Diet plan generation failed:', error);
        setDietPlan(null); // Agar fail hua to purana plan hata denge
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: 'Could not generate a diet plan. The AI may have returned an incorrect format. Please try again.',
        });
      }
    });
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>AI Diet Planner</CardTitle>
          <CardDescription>
            Enter your details and fitness goals to generate a personalized 7-day diet plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="biography">Your Biography</Label>
            <Textarea
              id="biography"
              placeholder="e.g., 30-year-old male, 80kg, 180cm, moderately active (gym 3 times a week), no allergies."
              value={userBiography}
              onChange={(e) => setUserBiography(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">Include age, gender, weight, height, activity level, and dietary restrictions.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fitness-goals">Fitness Goals</Label>
            <Textarea
              id="fitness-goals"
              placeholder="e.g., Lose 5kg in 2 months and build lean muscle."
              value={fitnessGoals}
              onChange={(e) => setFitnessGoals(e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGeneratePlan} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Plan...
              </>
            ) : (
              'Generate Diet Plan'
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* FIX: Naya Display Logic - Ab hum simple string (Markdown) dikhayenge */}
      {dietPlan && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              Your Personalized 7-Day Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto max-h-[600px] border rounded-lg p-4 bg-muted/50">
            {/* FIX: whiteSpace: 'pre-wrap' से Markdown formatting (newlines) और spaces दिखेंगे */}
            <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{dietPlan}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}