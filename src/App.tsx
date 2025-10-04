import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { MoodTracker } from './components/mood-tracker';
import { GoalsSection } from './components/goals-section';
import { JournalSection } from './components/journal-section';
import { MindfulnessSection } from './components/mindfulness-section';
import { ResourcesSection } from './components/resources-section';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import mkuLogo from 'figma:asset/14595c554c029d987635aae1d898f92cd008b33f.png';
import { 
  Heart, 
  Target, 
  BookOpen, 
  Brain, 
  Shield, 
  Sun, 
  Moon, 
  Settings,
  TrendingUp,
  Smile,
  LogOut
} from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogin = (email: string, password: string) => {
    // Get user data from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.firstName && currentUser.lastName) {
      setUser({ firstName: currentUser.firstName, lastName: currentUser.lastName, email: currentUser.email });
    } else {
      // Fallback if no stored user data
      const emailName = email.split('@')[0];
      const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      setUser({ firstName, lastName: '', email });
    }
    setIsAuthenticated(true);
  };

  const handleRegister = (userData: any) => {
    setUser({ firstName: userData.firstName, lastName: userData.lastName, email: userData.email });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Show authentication forms if not logged in
  if (!isAuthenticated) {
    return showRegister ? (
      <RegisterForm 
        onRegister={handleRegister}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <LoginForm 
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          {/* Mobile Layout */}
          <div className="flex sm:hidden h-16 items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <img 
                src={mkuLogo} 
                alt="MKU Logo" 
                className="h-8 w-auto flex-shrink-0"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <h1 className="text-sm font-semibold leading-tight truncate">Mount Kenya University</h1>
                <p className="text-xs text-muted-foreground leading-tight truncate">Mental Health Program</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden sm:flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <img 
                  src={mkuLogo} 
                  alt="Mount Kenya University Logo" 
                  className="h-10 w-auto"
                />
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold leading-tight">Mount Kenya University</h1>
                  <p className="text-sm text-muted-foreground leading-tight">Mental Health Awareness Program</p>
                </div>
              </div>
              <Badge variant="secondary" className="hidden lg:inline-flex">
                Student Wellness Dashboard
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleDarkMode}
                className="hidden md:flex"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">{getTimeBasedGreeting()}, {user?.firstName}{user?.lastName ? ` ${user.lastName}` : ''}! 👋</h2>
              <p className="text-sm sm:text-base text-muted-foreground">{currentDate}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-4 sm:justify-end">
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-bold text-green-600">8.2</p>
                <p className="text-xs text-muted-foreground">Current Mood</p>
              </div>
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-bold text-blue-600">12</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-bold text-purple-600">85%</p>
                <p className="text-xs text-muted-foreground">Weekly Goal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                <Heart className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mood Average</p>
                <p className="text-lg font-semibold">7.8/10</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goals Progress</p>
                <p className="text-lg font-semibold">3/4 Active</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Journal Entries</p>
                <p className="text-lg font-semibold">23 This Month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mindfulness</p>
                <p className="text-lg font-semibold">245 Minutes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="mood" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            <TabsTrigger value="mood" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3">
              <Smile className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Mood</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3">
              <Target className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Journal</span>
            </TabsTrigger>
            <TabsTrigger value="mindfulness" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3">
              <Target className="h-4 w-4" />
              <span className="text-xs sm:text-sm hidden xs:inline">Mind</span>
              <span className="text-xs sm:text-sm xs:hidden">🧠</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3">
              <Shield className="h-4 w-4" />
              <span className="text-xs sm:text-sm hidden xs:inline">Help</span>
              <span className="text-xs sm:text-sm xs:hidden">🛡️</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mood" className="space-y-6">
            <MoodTracker />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <GoalsSection />
          </TabsContent>

          <TabsContent value="journal" className="space-y-6">
            <JournalSection />
          </TabsContent>

          <TabsContent value="mindfulness" className="space-y-6">
            <MindfulnessSection />
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <ResourcesSection />
          </TabsContent>
        </Tabs>

        {/* Daily Insights */}
        <Card className="mt-8 border-blue-200 bg-blue-50/50 dark:bg-blue-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
              <TrendingUp className="h-5 w-5" />
              Today's Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 dark:text-blue-400 mb-3">
              Your mood tends to be highest on days when you complete your morning meditation. 
              Consider maintaining this pattern for continued emotional well-being.
            </p>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Pattern Recognition
              </Badge>
              <Badge variant="outline" className="border-blue-300 text-blue-700">
                Based on 30 days of data
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 py-4 sm:py-6 border-t">
          <div className="text-center text-xs sm:text-sm text-muted-foreground space-y-2">
            <p>Remember: You are not alone. Your mental health matters. Take it one day at a time. 💙</p>
            <p className="hidden sm:block">
              Mount Kenya University Mental Health Awareness Program 2025 is a supportive tool for student wellness. For professional help, please consult a licensed therapist or visit the university counseling center.
            </p>
            <p className="sm:hidden">
              MKU Mental Health Program 2025. For professional help, consult a licensed therapist.
            </p>
            <p className="text-xs">
              Mount Kenya University - Committed to your wellbeing
            </p>
            <p className="text-xs mt-4 pt-2 border-t border-muted">
              Copyright © Mount Kenya University 2025
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}