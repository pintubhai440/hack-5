'use client';

import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  Camera,
  MessageCircle,
  NotebookText,
  Video,
  Youtube,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';

const chartData = [
  { day: 'Mon', pushups: 58, squats: 45 },
  { day: 'Tue', pushups: 50, squats: 55 },
  { day: 'Wed', pushups: 78, squats: 60 },
  { day: 'Thu', pushups: 65, squats: 70 },
  { day: 'Fri', pushups: 80, squats: 75 },
  { day: 'Sat', pushups: 70, squats: 65 },
  { day: 'Sun', pushups: 90, squats: 85 },
];

const chartConfig = {
  pushups: {
    label: 'Push-ups',
    color: 'hsl(var(--chart-1))',
  },
  squats: {
    label: 'Squats',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const quickActions = [
  {
    href: '/live-session',
    icon: Camera,
    title: 'Live Session',
    description: 'Start a real-time workout.',
  },
  {
    href: '/analyze',
    icon: Video,
    title: 'Analyze Video',
    description: 'Get feedback on a recorded workout.',
  },
  {
    href: '/diet-plan',
    icon: NotebookText,
    title: 'Diet Plan',
    description: 'Generate your weekly meal plan.',
  },
  {
    href: '/recommendations',
    icon: Youtube,
    title: 'Recommendations',
    description: 'Discover new workout videos.',
  },
  {
    href: '/chatbot',
    icon: MessageCircle,
    title: 'AI Chatbot',
    description: 'Ask our AI for fitness advice.',
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reps</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Days</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5/7</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
            <NotebookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 Days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>
              Your push-up and squat progress over the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart data={chartData}>
                   <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="pushups" fill="hsl(var(--chart-1))" radius={4} />
                  <Bar dataKey="squats" fill="hsl(var(--chart-2))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Jump right into your next fitness activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {quickActions.map((action) => (
              <Link href={action.href} key={action.href}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
