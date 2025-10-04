// Data service for managing user mental health data
export interface MoodEntry {
  _id?: string;
  user_id: string;
  date: string;
  mood: number;
  note?: string;
}

export interface Goal {
  _id?: string;
  user_id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  category: string;
  deadline: string;
  completed: boolean;
  created_at: string;
}

export interface JournalEntry {
  _id?: string;
  user_id: string;
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
    return currentUser._id || '1';
  }

  private async apiCall(endpoint: string, options: RequestInit = {}) {
    const userId = this.getCurrentUserId();
    const netlifyEndpoint = endpoint.replace('/api/data/', '/.netlify/functions/data-');
    const response = await fetch(netlifyEndpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Mood tracking methods
  async getMoodEntries(): Promise<MoodEntry[]> {
    try {
      return await this.apiCall('/api/data/mood');
    } catch (error) {
      // Fallback to localStorage
      const userId = this.getCurrentUserId();
      const entries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
      return entries.filter((entry: MoodEntry) => entry.user_id === userId);
    }
  }

  async addMoodEntry(mood: number, note?: string): Promise<MoodEntry | null> {
    try {
      return await this.apiCall('/api/data/mood', {
        method: 'POST',
        body: JSON.stringify({ mood, note }),
      });
    } catch (error) {
      // Fallback to localStorage
      const userId = this.getCurrentUserId();
      const entries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
      const newEntry: MoodEntry = {
        _id: Date.now().toString(),
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        mood,
        note
      };
      entries.push(newEntry);
      localStorage.setItem('moodEntries', JSON.stringify(entries));
      return newEntry;
    }
  }

  // Goals methods
  async getGoals(): Promise<Goal[]> {
    try {
      return await this.apiCall('/api/data/goals');
    } catch (error) {
      // Fallback to localStorage
      const userId = this.getCurrentUserId();
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      return goals.filter((goal: Goal) => goal.user_id === userId);
    }
  }

  async addGoal(title: string, description: string, target: number, category: string, deadline: string): Promise<Goal | null> {
    try {
      return await this.apiCall('/api/data/goals', {
        method: 'POST',
        body: JSON.stringify({ title, description, target, category, deadline }),
      });
    } catch (error) {
      // Fallback to localStorage
      const userId = this.getCurrentUserId();
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      const newGoal: Goal = {
        _id: Date.now().toString(),
        user_id: userId,
        title,
        description,
        progress: 0,
        target,
        category,
        deadline,
        completed: false,
        created_at: new Date().toISOString()
      };
      goals.push(newGoal);
      localStorage.setItem('goals', JSON.stringify(goals));
      return newGoal;
    }
  }

  async updateGoalProgress(goalId: string, progress: number): Promise<void> {
    try {
      await this.apiCall('/api/data/goals', {
        method: 'PUT',
        body: JSON.stringify({ goalId, progress }),
      });
    } catch (error) {
      // Fallback to localStorage
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      const updatedGoals = goals.map((goal: Goal) => {
        if (goal._id === goalId) {
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
  }

  // Journal methods
  async getJournalEntries(): Promise<JournalEntry[]> {
    try {
      const entries = await this.apiCall('/api/data/journal');
      return entries;
    } catch (error) {
      // Fallback to localStorage
      const userId = this.getCurrentUserId();
      const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      return entries.filter((entry: JournalEntry) => entry.user_id === userId);
    }
  }

  async addJournalEntry(title: string, content: string, mood: number, tags: string[]): Promise<JournalEntry | null> {
    try {
      return await this.apiCall('/api/data/journal', {
        method: 'POST',
        body: JSON.stringify({ title, content, mood, tags }),
      });
    } catch (error) {
      // Fallback to localStorage
      const userId = this.getCurrentUserId();
      const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      const newEntry: JournalEntry = {
        _id: Date.now().toString(),
        user_id: userId,
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
  }

  // Statistics methods
  async getUserStats(): Promise<UserStats> {
    try {
      const [moodEntries, goals, journalEntries] = await Promise.all([
        this.getMoodEntries(),
        this.getGoals(),
        this.getJournalEntries()
      ]);

      const moodAverage = moodEntries.length > 0 
        ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length 
        : 0;

      const completedGoals = goals.filter(goal => goal.completed).length;
      const weeklyGoalProgress = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;

      const currentStreak = this.calculateMoodStreak(moodEntries);

      return {
        moodAverage,
        currentStreak,
        weeklyGoalProgress,
        totalJournalEntries: journalEntries.length,
        totalMindfulnessMinutes: 0
      };
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return {
        moodAverage: 0,
        currentStreak: 0,
        weeklyGoalProgress: 0,
        totalJournalEntries: 0,
        totalMindfulnessMinutes: 0
      };
    }
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