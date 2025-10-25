'use client'; 

import React, { useState, useTransition } from 'react';

// YEH AAPKA BACKEND FUNCTION HAI
import { suggestRelevantVideos } from '@/ai/flows/suggest-relevant-videos';

// Hum Toast (popup) aur Icons ke liye yeh import kar rahe hain
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLinkIcon } from 'lucide-react';

// NAYA TYPE: Jaisa aapke AI code mein tha
type Recommendations = {
  searchQueries: string[];
};

// Yeh icon (SVG) hai jo pehle code mein tha
const ExternalLinkIconSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-500 hover:text-blue-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
);

export default function RecommendationsPage() {
  // State variables (AI code se)
  const [userProfile, setUserProfile] = useState('20 year old man');
  const [fitnessGoals, setFitnessGoals] = useState('muscular');
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // AI ko call karne wala function (AI code se)
  const handleGetRecommendations = (e: React.FormEvent) => {
    e.preventDefault(); // Page ko reload hone se rokta hai

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
        
        console.log("AI SE YEH RESULT AAYA:", result); 
        
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
    // Main content area (Screenshot wale code se)
    <div className="flex-1 p-8 bg-sky-50 min-h-screen overflow-y-auto">
      
      <div className="max-w-3xl">

        {/* --- Get Recommendations Section (Screenshot wale code se) --- */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-gray-800">
            Get Recommendations
          </h2>
          <p className="text-gray-600 mb-4">
            Describe your profile and goals to get video recommendations.
          </p>
          
          {/* Form aur button (AI function ke saath merged) */}
          <form onSubmit={handleGetRecommendations} className="space-y-4">
            {/* Textarea 1 */}
            <textarea
              className="w-full p-4 border-0 rounded-lg bg-sky-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              rows="3"
              value={userProfile}
              onChange={(e) => setUserProfile(e.target.value)}
              placeholder="e.g., 20 year old man"
            ></textarea>
            
            {/* Textarea 2 */}
            <textarea
              className="w-full p-4 border-0 rounded-lg bg-sky-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              rows="3"
              value={fitnessGoals}
              onChange={(e) => setFitnessGoals(e.target.value)}
              placeholder="e.g., muscular, weight loss"
            ></textarea>
            
            {/* Button (Loading state ke saath merged) */}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting...
                </span>
              ) : (
                'Get Recommendations'
              )}
            </button>
          </form>
        </div>

        {/* --- Recommended For You Section (AI data ke saath merged) --- */}
        {recommendations && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Recommended For You
            </h2>
            <div className="space-y-3">
              
              {/* NAYA MAPPING: Ab hum AI se aaye 'searchQueries' par loop kar rahe hain */}
              {recommendations.searchQueries.map((query, index) => {
                // Har query ke liye YouTube search link banaya
                const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

                return (
                  <div
                    key={index}
                    // Screenshot wala white card style
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center"
                  >
                    {/* Link (AI query text ke saath) */}
                    <a
                      href={searchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium capitalize text-sm"
                    >
                      {query}
                    </a>
                    {/* Icon */}
                    <a
                      href={searchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 flex-shrink-0"
                    >
                      <ExternalLinkIconSvg />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}