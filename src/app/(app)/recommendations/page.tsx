'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestRelevantVideos } from '@/ai/flows/suggest-relevant-videos';
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
import { Loader2, Youtube, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  userProfile: z.string().min(20, 'Please provide more details for better recommendations.'),
  fitnessGoals: z.string().min(10, 'Please describe your goals in more detail.'),
});

export default function RecommendationsPage() {
  const [isPending, startTransition] = useTransition();
  const [videoSuggestions, setVideoSuggestions] = useState<string[] | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userProfile: 'e.g., 30-year-old male, beginner fitness level, has access to dumbbells.',
      fitnessGoals: 'e.g., Build chest and shoulder strength.',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const result = await suggestRelevantVideos(values);
        setVideoSuggestions(result.videoSuggestions);
      } catch (error) {
        console.error('Failed to get recommendations:', error);
        toast({
          variant: 'destructive',
          title: 'Suggestion Failed',
          description: 'Could not get video recommendations. Please try again.',
        });
      }
    });
  }

  return (
    <div className="container mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Video Recommendations</CardTitle>
          <CardDescription>
            Get personalized exercise video recommendations from YouTube based on your profile and goals.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form. handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="userProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Profile</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about yourself..." rows={3} {...field} />
                    </FormControl>
                    <FormDescription>
                      Include age, fitness level, and available equipment.
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
                      <Input placeholder="e.g., Improve cardio, build leg strength" {...field} />
                    </FormControl>
                    <FormDescription>
                      What do you want to work on?
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
                    Finding Videos...
                  </>
                ) : (
                  'Get Recommendations'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {videoSuggestions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="text-red-500" />
              Recommended For You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {videoSuggestions.map((url, index) => (
                <li key={index}>
                  <Link href={url} target="_blank" rel="noopener noreferrer">
                    <Card className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                        <span className="truncate text-sm text-primary underline-offset-4 hover:underline">{url}</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground ml-4 shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}