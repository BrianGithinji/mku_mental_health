import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { BookOpen, Plus, Calendar, Heart, Lightbulb, Zap } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: number;
  tags: string[];
}

const mockEntries: JournalEntry[] = [
  {
    id: '1',
    date: '2024-09-17',
    title: 'Morning Reflection',
    content: 'Started the day with meditation and felt really centered. The breathing exercises helped me prepare for the challenging meeting I had scheduled. Grateful for small moments of peace.',
    mood: 8,
    tags: ['gratitude', 'meditation', 'work']
  },
  {
    id: '2',
    date: '2024-09-16',
    title: 'Overcoming Anxiety',
    content: 'Had a tough day dealing with anxiety about the upcoming presentation. Used the 5-4-3-2-1 grounding technique which helped. Reminded myself that its okay to feel nervous.',
    mood: 6,
    tags: ['anxiety', 'coping', 'presentation']
  },
  {
    id: '3',
    date: '2024-09-15',
    title: 'Weekend Recharge',
    content: 'Spent quality time with family and friends. Realized how important social connections are for my mental health. Feeling recharged and ready for the week ahead.',
    mood: 9,
    tags: ['family', 'social', 'recharge']
  },
];

const moodEmojis = ['😔', '😟', '😐', '😊', '😄', '🤩'];
const suggestedTags = ['gratitude', 'anxiety', 'work', 'family', 'meditation', 'exercise', 'social', 'reflection', 'goals', 'self-care'];

export function JournalSection() {
  const [entries, setEntries] = useState<JournalEntry[]>(mockEntries);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: 5, tags: [] as string[] });
  const [isWriting, setIsWriting] = useState(false);

  const handleSubmit = () => {
    if (newEntry.title && newEntry.content) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood,
        tags: newEntry.tags,
      };
      setEntries([entry, ...entries]);
      setNewEntry({ title: '', content: '', mood: 5, tags: [] });
      setIsWriting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'gratitude': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'anxiety': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'work': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'family': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'meditation': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    };
    return colors[tag] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const totalEntries = entries.length;
  const averageMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / totalEntries;
  const currentStreak = 7; // Mock data

  return (
    <div className="space-y-6">
      {/* Journal Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            Journal Overview
          </CardTitle>
          <CardDescription>
            Track your thoughts and emotional journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{totalEntries}</p>
              <p className="text-sm text-muted-foreground">Total Entries</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-green-600">{currentStreak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{averageMood.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Avg. Mood</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write New Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Journal Entry
          </CardTitle>
          <CardDescription>
            Express your thoughts and feelings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isWriting ? (
            <Button onClick={() => setIsWriting(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Write New Entry
            </Button>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Entry title..."
                value={newEntry.title}
                onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-md bg-background"
              />
              
              <Textarea
                placeholder="What's on your mind today? How are you feeling?"
                value={newEntry.content}
                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-32"
              />
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Mood:</span>
                  <div className="flex gap-1">
                    {moodEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => setNewEntry(prev => ({ ...prev, mood: index + 1 }))}
                        className={`p-1 text-lg rounded ${newEntry.mood === index + 1 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={newEntry.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSubmit}>Save Entry</Button>
                <Button variant="outline" onClick={() => setIsWriting(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>
            Your latest journal entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{entry.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{moodEmojis[entry.mood - 1]}</span>
                    <span className="text-xs text-muted-foreground">{entry.mood}/5</span>
                  </div>
                </div>
                
                <p className="text-sm leading-relaxed">{entry.content}</p>
                
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className={`text-xs ${getTagColor(tag)}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Journal Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Writing Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Zap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Most frequent theme: Gratitude
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  You've mentioned gratitude in 60% of your entries this month
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Heart className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Positive trend detected
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Your mood has improved 15% over the last two weeks
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}