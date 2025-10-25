'use client'; 

import React, { useState } from 'react';

// This is the SVG for the "open in new tab" icon seen in your screenshot
const ExternalLinkIcon = () => (
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
  // We use 'useState' to manage the text in the boxes
  // I've pre-filled them to match your screenshot
  const [profile, setProfile] = useState('20 year old man');
  const [goal, setGoal] = useState('muscular');

  // Static list of recommendations, just like in the screenshot
  // In a real app, you would fetch these based on the profile and goal
  const recommendations = [
    {
      title: 'science based workout for muscle growth',
      url: 'https://www.youtube.com/results?search_query=science+based+workout+for+muscle+growth',
    },
    {
      title: 'push pull legs split for mass',
      url: 'https://www.youtube.com/results?search_query=push+pull+legs+split+for+mass',
    },
    {
      title: 'high protein meal plan for building muscle',
      url: 'https://www.youtube.com/results?search_query=high+protein+meal+plan+for+building+muscle',
    },
  ];

  // This function runs when you click the button
  const handleGetRecommendations = (e) => {
    e.preventDefault(); // Prevents the page from reloading
    console.log('Fetching recommendations for:', { profile, goal });
    // Add your AI/API call here to get new recommendations
  };

  return (
    // Main content area with a light blue background (bg-sky-50)
    <div className="flex-1 p-8 bg-sky-50 min-h-screen overflow-y-auto">
      
      {/* Constrain the width to match the centered look in the image */}
      <div className="max-w-3xl">

        {/* --- Get Recommendations Section --- */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-gray-800">
            Get Recommendations
          </h2>
          <p className="text-gray-600 mb-4">
            Describe your profile and goals to get video recommendations.
          </p>
          
          <form onSubmit={handleGetRecommendations} className="space-y-4">
            {/* Textarea 1: Styled with bg-sky-100 as in the image */}
            <textarea
              className="w-full p-4 border-0 rounded-lg bg-sky-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              rows="3"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              placeholder="e.g., 20 year old man"
            ></textarea>
            
            {/* Textarea 2: Styled with bg-sky-100 as in the image */}
            <textarea
              className="w-full p-4 border-0 rounded-lg bg-sky-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              rows="3"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., muscular, weight loss"
            ></textarea>
            
            {/* The blue button */}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Get Recommendations
            </button>
          </form>
        </div>

        {/* --- Recommended For You Section --- */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Recommended For You
          </h2>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                // Each recommendation is a white card with a shadow
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center"
              >
                {/* The blue link */}
                <a
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium capitalize text-sm"
                >
                  {rec.title}
                </a>
                {/* The icon on the right */}
                <a
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 flex-shrink-0"
                >
                  <ExternalLinkIcon />
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}