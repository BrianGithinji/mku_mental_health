import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Plus, Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { dataService, Goal } from '../utils/dataService';

export function GoalsSection() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const userGoals = await dataService.getGoals();
    setGoals(userGoals);
  };

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const overallProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Mindfulness': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Reflection': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Physical Health': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Sleep': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'Personal': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const addGoal = async () => {
    if (newGoal.trim()) {
      const deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      await dataService.addGoal(newGoal, 'Custom goal', 10, 'Personal', deadline);
      setNewGoal('');
      loadGoals();
    }
  };

  const updateGoalProgress = async (goalId: string, increment: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const newProgress = Math.min(goal.target, Math.max(0, goal.progress + increment));
      await dataService.updateGoalProgress(goalId, newProgress);
      loadGoals();
    }
  };

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Goals Overview
          </CardTitle>
          <CardDescription>
            Track your progress towards mental health goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4 mb-6">
            <div className="text-center p-2 sm:p-4 bg-muted rounded-lg">
              <p className="text-lg sm:text-2xl font-bold text-green-600">{completedGoals}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="text-center p-2 sm:p-4 bg-muted rounded-lg">
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{totalGoals - completedGoals}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
            </div>
            <div className="text-center p-2 sm:p-4 bg-muted rounded-lg">
              <p className="text-lg sm:text-2xl font-bold text-purple-600">{overallProgress.toFixed(0)}%</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Progress</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span>{overallProgress.toFixed(0)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Active Goals</CardTitle>
          <CardDescription>
            Your current mental health objectives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.length > 0 ? goals.map((goal) => {
            const progressPercentage = (goal.progress / goal.target) * 100;
            const isOverdue = new Date(goal.deadline) < new Date() && !goal.completed;
            
            return (
              <div key={goal._id} className={`p-3 sm:p-4 border rounded-lg space-y-3 ${goal.completed ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium text-sm sm:text-base ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {goal.title}
                      </h4>
                      {goal.completed && <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{goal.description}</p>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2">
                      <Badge className={`${getCategoryColor(goal.category)} text-xs`} variant="secondary">
                        {goal.category}
                      </Badge>
                      {isOverdue && (
                        <Badge variant="destructive" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!goal.completed && (
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGoalProgress(goal._id!, -1)}
                        disabled={goal.progress <= 0}
                        className="h-8 w-8 p-0"
                      >
                        -
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGoalProgress(goal._id!, 1)}
                        disabled={goal.progress >= goal.target}
                        className="h-8 w-8 p-0"
                      >
                        +
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {goal.progress} / {goal.target}</span>
                    <span>{progressPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                    {!goal.completed && (
                      <span>{goal.target - goal.progress} remaining</span>
                    )}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center p-6 text-muted-foreground">
              <p>No goals yet. Add your first goal below!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter a new goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              className="flex-1"
            />
            <Button onClick={addGoal} className="sm:w-auto">Add Goal</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}