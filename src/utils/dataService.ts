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
    return currentUser.id || '1';
  }

  private async apiCall(endpoint: string, options: RequestInit = {}) {
    const userId = this.getCurrentUserId();
    const response = await fetch(endpoint, {
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
      console.error('Failed to fetch mood entries:', error);
      return [];
    }
  }

  async addMoodEntry(mood: number, note?: string): Promise<MoodEntry | null> {
    try {
      return await this.apiCall('/api/data/mood', {
        method: 'POST',
        body: JSON.stringify({ mood, note }),
      });
    } catch (error) {
      console.error('Failed to add mood entry:', error);
      return null;
    }
  }

  // Goals methods
  async getGoals(): Promise<Goal[]> {
    try {
      return await this.apiCall('/api/data/goals');
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      return [];
    }
  }

  async addGoal(title: string, description: string, target: number, category: string, deadline: string): Promise<Goal | null> {
    try {
      return await this.apiCall('/api/data/goals', {
        method: 'POST',
        body: JSON.stringify({ title, description, target, category, deadline }),
      });
    } catch (error) {
      console.error('Failed to add goal:', error);
      return null;
    }
  }

  async updateGoalProgress(goalId: string, progress: number): Promise<void> {
    try {
      await this.apiCall('/api/data/goals', {
        method: 'PUT',
        body: JSON.stringify({ goalId, progress }),
      });
    } catch (error) {
      console.error('Failed to update goal progress:', error);
    }
  }

  // Journal methods
  async getJournalEntries(): Promise<JournalEntry[]> {
    try {
      const entries = await this.apiCall('/api/data/journal');
      return entries;
    } catch (error) {
      console.error('Failed to fetch journal entries:', error);
      return [];
    }
  }

  async addJournalEntry(title: string, content: string, mood: number, tags: string[]): Promise<JournalEntry | null> {
    try {
      return await this.apiCall('/api/data/journal', {
        method: 'POST',
        body: JSON.stringify({ title, content, mood, tags }),
      });
    } catch (error) {
      console.error('Failed to add journal entry:', error);
      return null;
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