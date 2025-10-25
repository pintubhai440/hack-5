import React from 'react';
import { Dumbbell } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-headline text-lg font-bold ${className}`}>
      <Dumbbell className="h-6 w-6 text-primary" />
      <span>AI Fitness Counter</span>
    </div>
  );
}
