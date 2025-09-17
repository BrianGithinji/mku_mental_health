import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Play, Pause, RotateCcw, Brain, Leaf, Sun, Moon, Clock } from 'lucide-react';

interface MindfulnessActivity {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
}

const activities: MindfulnessActivity[] = [
  {
    id: '1',
    title: 'Morning Breathing',
    description: 'Start your day with focused breathing exercises',
    duration: 5,
    category: 'Breathing',
    difficulty: 'Beginner',
    completed: false,
  },
  {
    id: '2',
    title: 'Body Scan Meditation',
    description: 'Progressive relaxation through body awareness',
    duration: 15,
    category: 'Meditation',
    difficulty: 'Intermediate',
    completed: true,
  },
  {
    id: '3',
    title: 'Gratitude Practice',
    description: 'Reflect on three things you\'re grateful for',
    duration: 8,
    category: 'Gratitude',
    difficulty: 'Beginner',
    completed: false,
  },
  {
    id: '4',
    title: 'Walking Meditation',
    description: 'Mindful walking to connect with the present moment',
    duration: 12,
    category: 'Movement',
    difficulty: 'Beginner',
    completed: false,
  },
];

interface TimerProps {
  duration: number;
  onComplete: () => void;
}

function MeditationTimer({ duration, onComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => {
          if (timeLeft <= 1) {
            setIsActive(false);
            onComplete();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft, onComplete]);

  const reset = () => {
    setTimeLeft(duration * 60);
    setIsActive(false);
    setIsPaused(false);
  };

  const toggle = () => {
    if (isActive) {
      setIsPaused(!isPaused);
    } else {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-center space-y-4">
      <div className="text-4xl font-mono font-bold">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-center gap-2">
        <Button onClick={toggle} size="sm">
          {isActive && !isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button onClick={reset} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function MindfulnessSection() {
  const [selectedActivity, setSelectedActivity] = useState<MindfulnessActivity | null>(null);
  const [completedToday, setCompletedToday] = useState(2);
  
  const handleActivityComplete = () => {
    if (selectedActivity) {
      setCompletedToday(prev => prev + 1);
      setSelectedActivity(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Breathing': return <Sun className="h-4 w-4" />;
      case 'Meditation': return <Brain className="h-4 w-4" />;
      case 'Gratitude': return <Leaf className="h-4 w-4" />;
      case 'Movement': return <Clock className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const totalMinutes = 45;
  const progressPercentage = (completedToday * 15 / totalMinutes) * 100;

  return (
    <div className="space-y-6">
      {/* Mindfulness Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Today's Mindfulness
          </CardTitle>
          <CardDescription>
            Take a moment to center yourself and find inner peace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{completedToday}</p>
              <p className="text-sm text-muted-foreground">Sessions Today</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{completedToday * 15}m</p>
              <p className="text-sm text-muted-foreground">Minutes Practiced</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-green-600">7</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Daily Goal Progress</span>
              <span>{Math.round(progressPercentage)}% of {totalMinutes}m</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Featured Session */}
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1687180948607-9ba1dd045e10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMG1lZGl0YXRpb24lMjB3ZWxsbmVzc3xlbnwxfHx8fDE3NTgwODQyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Peaceful meditation scene"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-black/40 rounded-t-lg flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-xl font-semibold mb-2">Featured: Evening Calm</h3>
                <p className="text-sm opacity-90 mb-4">Wind down with guided relaxation</p>
                <Button variant="secondary">
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Session */}
      {selectedActivity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getCategoryIcon(selectedActivity.category)}
              {selectedActivity.title}
            </CardTitle>
            <CardDescription>
              {selectedActivity.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MeditationTimer 
              duration={selectedActivity.duration} 
              onComplete={handleActivityComplete}
            />
          </CardContent>
        </Card>
      )}

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle>Mindfulness Activities</CardTitle>
          <CardDescription>
            Choose from guided exercises and meditations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className={`p-4 border rounded-lg space-y-3 ${activity.completed ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(activity.category)}
                      <h4 className={`font-medium ${activity.completed ? 'text-green-700 dark:text-green-300' : ''}`}>
                        {activity.title}
                      </h4>
                      {activity.completed && <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.duration}m
                      </Badge>
                      <Badge className={getDifficultyColor(activity.difficulty)} variant="secondary">
                        {activity.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {activity.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-4">
                    {!activity.completed && (
                      <Button 
                        onClick={() => setSelectedActivity(activity)}
                        disabled={selectedActivity?.id === activity.id}
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Mindfulness</CardTitle>
          <CardDescription>
            Brief exercises for immediate relief
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-20 flex flex-col gap-1">
              <Sun className="h-5 w-5" />
              <span className="text-xs">4-7-8 Breathing</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-1">
              <Moon className="h-5 w-5" />
              <span className="text-xs">Quick Scan</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-1">
              <Leaf className="h-5 w-5" />
              <span className="text-xs">Gratitude</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-1">
              <Brain className="h-5 w-5" />
              <span className="text-xs">Focus Reset</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}