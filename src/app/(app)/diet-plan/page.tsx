'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  biography: z.string().min(20, 'Please provide more details for a better plan.'),
  fitnessGoals: z.string().min(10, 'Please describe your goals in more detail.'),
});

export default function DietPlanPage() {
  const [isPending, startTransition] = useTransition();
  const [dietPlan, setDietPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      biography: 'e.g., 30-year-old male, 80kg, 180cm, moderately active (gym 3 times a week), no allergies.',
      fitnessGoals: 'e.g., Lose 5kg in 2 months and build lean muscle.',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const result = await generateDietPlan(values);
        setDietPlan(result.dietPlan);
      } catch (error) {
        console.error('Failed to generate diet plan:', error);
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: 'Could not generate a diet plan. Please try again.',
        });
      }
    });
  }

  return (
    <div className="container mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Diet Planner</CardTitle>
          <CardDescription>
            Enter your details and fitness goals to generate a personalized 7-day diet plan.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="biography"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Biography</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about yourself..." rows={4} {...field} />
                    </FormControl>
                    <FormDescription>
                      Include age, gender, weight, height, activity level, and dietary restrictions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fitnessGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitness Goals</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lose weight, build muscle" {...field} />
                    </FormControl>
                     <FormDescription>
                      What do you want to achieve?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Diet Plan'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {dietPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              Your 7-Day Diet Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm prose-p:text-muted-foreground max-w-none whitespace-pre-wrap rounded-md bg-muted p-4 font-body">
              {dietPlan}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
