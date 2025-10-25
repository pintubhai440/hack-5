'use client';

import { useState, useTransition } from 'react';
// YEH AAPKA BACKEND FUNCTION HAI
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLinkIcon } from 'lucide-react';

// NAYA TYPE: Ab hum 'searchQueries' expect kar rahe hain, 'videoSuggestions' nahi
type Recommendations = {
  searchQueries: string[];
};

export default function RecommendationsPage() {
  const [userProfile, setUserProfile] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('');
  // NAYA STATE: State ko naye type 'Recommendations' se update kiya
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGetRecommendations = () => {
    if (!userProfile || !fitnessGoals) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill out your profile and fitness goals.',
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await suggestRelevantVideos({
          userProfile,
          fitnessGoals,
        });
        // NAYA RESULT: Hum 'result' ko 'Recommendations' type mein set kar rahe hain
        setRecommendations(result as Recommendations);
      } catch (error) {
        console.error('Failed to get recommendations:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to get recommendations',
          description: 'There was an error. Please try again.',
        });
      }
    });
  };

  return (
    // Is HTML/JSX mein koi badlaav nahi hai
    <div className="container mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Get Recommendations</CardTitle>
          <CardDescription>
            Describe your profile and goals to get video recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Textarea
              placeholder="e.g., a 20 year old man, I want muscular body"
              value={userProfile}
              onChange={(e) => setUserProfile(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Textarea
              placeholder="e.g., six pack, muscular"
              value={fitnessGoals}
              onChange={(e) => setFitnessGoals(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGetRecommendations} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Recommendations...
              </>
            ) : (
              'Get Recommendations'
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* YEH HISSA BADAL GAYA HAI */}
      {recommendations && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recommended For You</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {/* NAYA MAPPING: Ab hum 'videoSuggestions' ki jagah 'searchQueries' par loop kar rahe hain.
              'video' variable ka naam 'query' ho gaya hai.
            */}
            {recommendations.searchQueries.map((query, index) => {
              // NAYA LINK: Hum har query ke liye ek asli YouTube SEARCH link bana rahe hain
              const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
                query
              )}`;

              return (
                <a
                  // NAYA URL: 'href' mein ab 'searchUrl' jaayega
                  href={searchUrl}
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-muted"
                >
                  {/* NAYA TEXT: Link ki jagah ab 'query' text dikhega */}
                  <span className="truncate text-sm text-primary">{query}</span>
                  <ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
                </a>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}