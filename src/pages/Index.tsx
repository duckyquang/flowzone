
import React from 'react';
import { ProcrastinationProvider } from '@/context/ProcrastinationContext';
import PomodoroTimer from '@/components/PomodoroTimer';
import TaskList from '@/components/TaskList';
import ProgressChart from '@/components/ProgressChart';
import DistractionTracker from '@/components/DistractionTracker';
import FocusReminder from '@/components/FocusReminder';

const Index = () => {
  return (
    <ProcrastinationProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container py-8 px-4 mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-focus-blue to-focus-teal bg-clip-text text-transparent">FlowZone</h1>
            <p className="text-muted-foreground">Beat procrastination and stay focused on what matters.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <PomodoroTimer />
              <TaskList />
            </div>
            
            <div className="space-y-8 flex flex-col">
              <DistractionTracker />
              <div className="flex-1">
                <ProgressChart />
              </div>
            </div>
          </div>
        </div>
        
        <footer className="py-6 border-t mt-12">
          <div className="container text-center text-sm text-muted-foreground">
            <p>FlowZone &copy; {new Date().getFullYear()} - Stay productive and focused</p>
          </div>
        </footer>
        
        <FocusReminder />
      </div>
    </ProcrastinationProvider>
  );
};

export default Index;
