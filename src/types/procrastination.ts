
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  timeSpent?: number; // Time spent in seconds
}

export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

export interface DistractionData {
  count: number;
  lastDate: string;
}

export interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  mode: 'work' | 'break' | 'longBreak';
  timeLeft: number;
  sessionsCompleted: number;
  currentTaskId?: string; // Add current task ID
}

export interface TaskCompletionData {
  date: string;
  count: number;
}
