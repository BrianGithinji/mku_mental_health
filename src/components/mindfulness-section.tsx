import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Play, Pause, RotateCcw, Brain, Leaf, Sun, Moon, Clock, Volume2, VolumeX } from 'lucide-react';

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
      <div className="text-2xl sm:text-4xl font-mono font-bold">
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
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleActivityComplete = () => {
    if (selectedActivity) {
      setCompletedToday(prev => prev + 1);
      setSelectedActivity(null);
    }
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const startFeaturedSession = () => {
    const newAudio = new Audio('/youtube-background-music-lofi-398315.mp3');
    newAudio.loop = true;
    newAudio.volume = 0.3;
    setAudio(newAudio);
    newAudio.play();
    setIsPlaying(true);
  };

  const toggleAudio = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
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
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
            <div className="text-center p-2 sm:p-4 bg-muted rounded-lg">
              <p className="text-lg sm:text-2xl font-bold text-purple-600">{completedToday}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Sessions</p>
            </div>
            <div className="text-center p-2 sm:p-4 bg-muted rounded-lg">
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{completedToday * 15}m</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Minutes</p>
            </div>
            <div className="text-center p-2 sm:p-4 bg-muted rounded-lg">
              <p className="text-lg sm:text-2xl font-bold text-green-600">7</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Streak</p>
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
            <img 
              src="/mku fou-Picsart-AiImageEnhancer.jpeg"
              alt="Mount Kenya University"
              className="w-full h-32 sm:h-48 object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-black/40 rounded-t-lg flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Featured: Evening Calm</h3>
                <p className="text-xs sm:text-sm opacity-90 mb-4">Wind down with guided relaxation</p>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={startFeaturedSession}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                  {audio && (
                    <Button variant="secondary" size="sm" onClick={toggleAudio}>
                      {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
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
                className={`p-3 sm:p-4 border rounded-lg space-y-3 ${activity.completed ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {getCategoryIcon(activity.category)}
                      <h4 className={`font-medium text-sm sm:text-base ${activity.completed ? 'text-green-700 dark:text-green-300' : ''}`}>
                        {activity.title}
                      </h4>
                      {activity.completed && <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Done</Badge>}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">{activity.description}</p>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.duration}m
                      </Badge>
                      <Badge className={`${getDifficultyColor(activity.difficulty)} text-xs`} variant="secondary">
                        {activity.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {activity.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {!activity.completed && (
                      <Button 
                        onClick={() => {
                          setSelectedActivity(activity);
                          const newAudio = new Audio('/youtube-background-music-lofi-398315.mp3');
                          newAudio.loop = true;
                          newAudio.volume = 0.2;
                          setAudio(newAudio);
                          newAudio.play();
                          setIsPlaying(true);
                        }}
                        disabled={selectedActivity?.id === activity.id}
                        size="sm"
                        className="text-xs px-2"
                      >
                        <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Start</span>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1">
              <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs">4-7-8 Breathing</span>
            </Button>
            <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1">
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs">Quick Scan</span>
            </Button>
            <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1">
              <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs">Gratitude</span>
            </Button>
            <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs">Focus Reset</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}