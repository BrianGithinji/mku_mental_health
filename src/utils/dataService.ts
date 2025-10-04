// Data service for managing user mental health data
export interface MoodEntry {
  id: string;
  userId: string;
  date: string;
  mood: number;
  note?: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  category: string;
  deadline: string;
  completed: boolean;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  title: string;
  content: string;
  mood: number;
  tags: string[];
}

export interface UserStats {
  moodAverage: number;
  currentStreak: number;
  weeklyGoalProgress: number;
  totalJournalEntries: number;
  totalMindfulnessMinutes: number;
}

class DataService {
  private getCurrentUserId(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.id || 'default';
  }

  // Mood tracking methods
  getMoodEntries(): MoodEntry[] {
    const userId = this.getCurrentUserId();
    const entries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    return entries.filter((entry: MoodEntry) => entry.userId === userId);
  }

  addMoodEntry(mood: number, note?: string): MoodEntry {
    const userId = this.getCurrentUserId();
    const entries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      userId,
      date: new Date().toISOString().split('T')[0],
      mood,
      note
    };
    entries.push(newEntry);
    localStorage.setItem('moodEntries', JSON.stringify(entries));
    return newEntry;
  }

  // Goals methods
  getGoals(): Goal[] {
    const userId = this.getCurrentUserId();
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    return goals.filter((goal: Goal) => goal.userId === userId);
  }

  addGoal(title: string, description: string, target: number, category: string, deadline: string): Goal {
    const userId = this.getCurrentUserId();
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const newGoal: Goal = {
      id: Date.now().toString(),
      userId,
      title,
      description,
      progress: 0,
      target,
      category,
      deadline,
      completed: false,
      createdAt: new Date().toISOString()
    };
    goals.push(newGoal);
    localStorage.setItem('goals', JSON.stringify(goals));
    return newGoal;
  }

  updateGoalProgress(goalId: string, progress: number): void {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const updatedGoals = goals.map((goal: Goal) => {
      if (goal.id === goalId) {
        return {
          ...goal,
          progress,
          completed: progress >= goal.target
        };
      }
      return goal;
    });
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
  }

  // Journal methods
  getJournalEntries(): JournalEntry[] {
    const userId = this.getCurrentUserId();
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    return entries.filter((entry: JournalEntry) => entry.userId === userId);
  }

  addJournalEntry(title: string, content: string, mood: number, tags: string[]): JournalEntry {
    const userId = this.getCurrentUserId();
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      userId,
      date: new Date().toISOString().split('T')[0],
      title,
      content,
      mood,
      tags
    };
    entries.push(newEntry);
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    return newEntry;
  }

  // Statistics methods
  getUserStats(): UserStats {
    const moodEntries = this.getMoodEntries();
    const goals = this.getGoals();
    const journalEntries = this.getJournalEntries();

    const moodAverage = moodEntries.length > 0 
      ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length 
      : 0;

    const completedGoals = goals.filter(goal => goal.completed).length;
    const weeklyGoalProgress = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;

    // Calculate streak (simplified - consecutive days with mood entries)
    const currentStreak = this.calculateMoodStreak(moodEntries);

    return {
      moodAverage,
      currentStreak,
      weeklyGoalProgress,
      totalJournalEntries: journalEntries.length,
      totalMindfulnessMinutes: 0 // Placeholder for mindfulness tracking
    };
  }

  private calculateMoodStreak(entries: MoodEntry[]): number {
    if (entries.length === 0) return 0;
    
    const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let currentDate = new Date();
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate = entryDate;
      } else {
        break;
      }
    }
    
    return streak;
  }
}

export const dataService = new DataService();