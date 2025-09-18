import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Smile, Meh, Frown, Heart, Star } from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: number;
  note?: string;
}

const moodData = [
  { date: 'Mon', mood: 7 },
  { date: 'Tue', mood: 6 },
  { date: 'Wed', mood: 8 },
  { date: 'Thu', mood: 5 },
  { date: 'Fri', mood: 9 },
  { date: 'Sat', mood: 7 },
  { date: 'Sun', mood: 8 },
];

const moodIcons = [
  { icon: Frown, color: 'text-red-500', label: 'Very Low' },
  { icon: Frown, color: 'text-red-400', label: 'Low' },
  { icon: Meh, color: 'text-orange-400', label: 'Fair' },
  { icon: Meh, color: 'text-yellow-400', label: 'Good' },
  { icon: Smile, color: 'text-green-400', label: 'Great' },
  { icon: Smile, color: 'text-green-500', label: 'Excellent' },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [todayMood, setTodayMood] = useState<number>(7);

  const handleMoodSelect = (moodLevel: number) => {
    setSelectedMood(moodLevel);
    setTodayMood(moodLevel);
  };

  const averageMood = moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length;

  return (
    <div className="space-y-6">
      {/* Daily Mood Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            How are you feeling today?
          </CardTitle>
          <CardDescription>
            Track your daily mood to identify patterns and improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:flex sm:justify-between gap-2 sm:gap-1 mb-4">
            {moodIcons.map((mood, index) => {
              const IconComponent = mood.icon;
              const moodLevel = index + 1;
              return (
                <Button
                  key={index}
                  variant={selectedMood === moodLevel ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleMoodSelect(moodLevel)}
                  className="flex flex-col gap-1 h-auto p-2 sm:p-3"
                >
                  <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${mood.color}`} />
                  <span className="text-xs">{moodLevel}</span>
                </Button>
              );
            })}
          </div>
          {selectedMood && (
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                You're feeling {moodIcons[selectedMood - 1].label.toLowerCase()} today
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood Trends */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Mood Trend</CardTitle>
          <CardDescription>
            Your mood patterns over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Average Mood</p>
                <p className="text-xl sm:text-2xl font-semibold">{averageMood.toFixed(1)}/10</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <Badge variant="secondary" className="text-sm">
                  <Star className="h-3 w-3 mr-1" />
                  5 days
                </Badge>
              </div>
            </div>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Mood Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div>
              <p className="font-medium text-green-800 dark:text-green-300">Great Progress!</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your mood improved 23% this week
              </p>
            </div>
            <Smile className="h-8 w-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Best day: Friday</span>
              <span className="text-green-600">9/10</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Most challenging: Thursday</span>
              <span className="text-orange-600">5/10</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}