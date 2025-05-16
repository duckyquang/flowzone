
import React, { useState, useEffect, useCallback } from 'react';
import { useProcrastination } from '@/context/ProcrastinationContext';
import { TimerState } from '@/types/procrastination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';
import { Clock, Play, Pause, SkipForward, Timer } from 'lucide-react';

const PomodoroTimer = () => {
  const { pomodoroSettings } = useProcrastination();
  const [timer, setTimer] = useState<TimerState>({
    isActive: false,
    isPaused: false,
    mode: 'work',
    timeLeft: pomodoroSettings.workDuration * 60,
    sessionsCompleted: 0,
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset timer with new mode
  const switchMode = useCallback(() => {
    let nextMode: 'work' | 'break' | 'longBreak' = 'work';
    let nextSessionCount = timer.sessionsCompleted;
    
    if (timer.mode === 'work') {
      nextSessionCount = timer.sessionsCompleted + 1;
      if (nextSessionCount % pomodoroSettings.sessionsBeforeLongBreak === 0) {
        nextMode = 'longBreak';
      } else {
        nextMode = 'break';
      }
    } else {
      nextMode = 'work';
    }
    
    const nextDuration = nextMode === 'work' 
      ? pomodoroSettings.workDuration * 60
      : nextMode === 'longBreak'
        ? pomodoroSettings.longBreakDuration * 60
        : pomodoroSettings.breakDuration * 60;
    
    setTimer({
      isActive: true,
      isPaused: false,
      mode: nextMode,
      timeLeft: nextDuration,
      sessionsCompleted: nextSessionCount,
    });

    // Show notification based on mode
    const message = nextMode === 'work' 
      ? "Focus time! Let's be productive." 
      : "Time for a break. Stretch and relax.";
    
    toast(
      nextMode === 'work' ? "Work Session Started" : "Break Time!", 
      { description: message }
    );
  }, [timer.mode, timer.sessionsCompleted, pomodoroSettings]);

  // Timer tick effect
  useEffect(() => {
    let interval: number | undefined;

    if (timer.isActive && !timer.isPaused) {
      interval = window.setInterval(() => {
        setTimer(current => {
          if (current.timeLeft <= 1) {
            clearInterval(interval);
            // Play notification sound if available
            const audio = new Audio('/notification.mp3');
            audio.play().catch(() => {
              console.log('Audio play failed, possibly no user interaction yet');
            });
            
            // We'll switch mode in the next render cycle using useEffect
            return { ...current, timeLeft: 0, isActive: false };
          }
          return { ...current, timeLeft: current.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isActive, timer.isPaused]);

  // Effect to switch modes when timer ends
  useEffect(() => {
    if (timer.timeLeft === 0 && !timer.isActive) {
      switchMode();
    }
  }, [timer.timeLeft, timer.isActive, switchMode]);

  // Initialize timer when settings change
  useEffect(() => {
    if (!timer.isActive) {
      setTimer(current => ({
        ...current,
        timeLeft: pomodoroSettings.workDuration * 60
      }));
    }
  }, [pomodoroSettings]);

  const startTimer = () => {
    setTimer(current => ({
      ...current,
      isActive: true,
      isPaused: false,
    }));
  };

  const pauseTimer = () => {
    setTimer(current => ({
      ...current,
      isPaused: !current.isPaused,
    }));
  };

  const resetTimer = () => {
    const duration = timer.mode === 'work'
      ? pomodoroSettings.workDuration * 60
      : timer.mode === 'longBreak'
        ? pomodoroSettings.longBreakDuration * 60
        : pomodoroSettings.breakDuration * 60;
    
    setTimer(current => ({
      ...current,
      isActive: false,
      isPaused: false,
      timeLeft: duration,
    }));
  };

  const skipToNext = () => {
    switchMode();
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalTime = timer.mode === 'work'
      ? pomodoroSettings.workDuration * 60
      : timer.mode === 'longBreak'
        ? pomodoroSettings.longBreakDuration * 60
        : pomodoroSettings.breakDuration * 60;
    
    return 100 - (timer.timeLeft / totalTime) * 100;
  };

  const timerColor = timer.mode === 'work' 
    ? 'bg-focus-blue' 
    : timer.mode === 'longBreak' 
      ? 'bg-focus-green' 
      : 'bg-focus-teal';

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Pomodoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold my-4 flex items-center">
            <Clock className={`mr-2 ${timer.isActive && !timer.isPaused ? 'animate-pulse-soft' : ''}`} />
            {formatTime(timer.timeLeft)}
          </div>
          
          <Progress value={calculateProgress()} className={`h-2 w-full mb-4 ${timerColor}`} />
          
          <div className="text-sm mb-4">
            {timer.mode === 'work' ? 'Work Session' : timer.mode === 'longBreak' ? 'Long Break' : 'Short Break'}
            {' • '}
            Sessions: {timer.sessionsCompleted}
          </div>
          
          <div className="flex gap-2">
            {!timer.isActive ? (
              <Button onClick={startTimer} className="flex items-center">
                <Play className="mr-1 h-4 w-4" /> Start
              </Button>
            ) : (
              <Button onClick={pauseTimer} className="flex items-center" variant={timer.isPaused ? "outline" : "default"}>
                <Pause className="mr-1 h-4 w-4" /> {timer.isPaused ? 'Resume' : 'Pause'}
              </Button>
            )}
            <Button onClick={resetTimer} variant="outline" className="flex items-center">
              Reset
            </Button>
            <Button onClick={skipToNext} variant="secondary" className="flex items-center">
              <SkipForward className="mr-1 h-4 w-4" /> Skip
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
