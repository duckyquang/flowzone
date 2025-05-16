
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Task, PomodoroSettings, DistractionData } from '@/types/procrastination';
import { toast } from '@/components/ui/sonner';

interface ProcrastinationContextType {
  tasks: Task[];
  completedTasksCount: number;
  distractions: DistractionData;
  pomodoroSettings: PomodoroSettings;
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  updatePomodoroSettings: (settings: PomodoroSettings) => void;
  incrementDistraction: () => void;
  resetDailyStats: () => void;
}

const defaultPomodoroSettings: PomodoroSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4
};

const ProcrastinationContext = createContext<ProcrastinationContextType | undefined>(undefined);

export const ProcrastinationProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(defaultPomodoroSettings);
  const [distractions, setDistractions] = useState<DistractionData>({
    count: 0,
    lastDate: new Date().toDateString()
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('procrastination_tasks');
    const savedPomodoroSettings = localStorage.getItem('procrastination_pomodoro');
    const savedDistractions = localStorage.getItem('procrastination_distractions');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedPomodoroSettings) setPomodoroSettings(JSON.parse(savedPomodoroSettings));
    if (savedDistractions) {
      const parsedDistractions = JSON.parse(savedDistractions);
      
      // Reset distractions if it's a new day
      if (parsedDistractions.lastDate !== new Date().toDateString()) {
        setDistractions({
          count: 0,
          lastDate: new Date().toDateString()
        });
      } else {
        setDistractions(parsedDistractions);
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('procrastination_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('procrastination_pomodoro', JSON.stringify(pomodoroSettings));
  }, [pomodoroSettings]);

  useEffect(() => {
    localStorage.setItem('procrastination_distractions', JSON.stringify(distractions));
  }, [distractions]);

  // Track tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        incrementDistraction();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Set up periodic motivational reminders
  useEffect(() => {
    const motivationalMessages = [
      "Stay focused! You're doing great.",
      "Remember why you started. Keep going!",
      "Small progress is still progress. Keep it up!",
      "Distractions are temporary, achievements are permanent.",
      "You've got this. Focus on one task at a time."
    ];

    const reminderInterval = setInterval(() => {
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      toast(randomMessage, {
        description: "Keep focusing on your tasks!",
        duration: 5000
      });
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(reminderInterval);
  }, []);

  const completedTasksCount = tasks.filter(task => task.completed).length;

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks(currentTasks => [...currentTasks, newTask]);
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== id));
  };

  const updatePomodoroSettings = (settings: PomodoroSettings) => {
    setPomodoroSettings(settings);
  };

  const incrementDistraction = () => {
    setDistractions(current => ({
      ...current,
      count: current.count + 1
    }));
  };

  const resetDailyStats = () => {
    setDistractions({
      count: 0,
      lastDate: new Date().toDateString()
    });
  };

  return (
    <ProcrastinationContext.Provider value={{
      tasks,
      completedTasksCount,
      distractions,
      pomodoroSettings,
      addTask,
      toggleTaskCompletion,
      deleteTask,
      updatePomodoroSettings,
      incrementDistraction,
      resetDailyStats
    }}>
      {children}
    </ProcrastinationContext.Provider>
  );
};

export const useProcrastination = () => {
  const context = useContext(ProcrastinationContext);
  if (context === undefined) {
    throw new Error('useProcrastination must be used within a ProcrastinationProvider');
  }
  return context;
};
