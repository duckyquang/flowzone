
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const FocusReminder = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  const reminderMessages = [
    "Hey! Focus on your tasks! The internet will still be there when you're done.",
    "Don't get distracted! Your future self will thank you for staying focused.",
    "Procrastination is the thief of time. Come back and get things done!",
    "Focus! You were making such great progress!",
    "The best way to finish is to start... and stay focused!",
    "Eyes on the prize! Return to your tasks.",
    "Click that X only if you're taking a planned break. Otherwise, get back to work!",
    "Your tasks won't complete themselves. Back to focus mode!",
    "Just a friendly reminder: you've got goals to achieve!",
    "Distraction alert! Remember why you started."
  ];
  
  const getRandomMessage = () => {
    return reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
  };
  
  const [message, setMessage] = useState(getRandomMessage());
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User left the page
        setMessage(getRandomMessage());
        setTimeout(() => {
          if (document.hidden) {
            setIsVisible(true);
          }
        }, 500); // Small delay to prevent flashing when switching tabs quickly
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <Card className="w-full max-w-md mx-4 p-6 relative bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-2 border-purple-200 dark:border-purple-900">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Focus Reminder!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {message}
          </p>
          <Button 
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            onClick={() => setIsVisible(false)}
          >
            Back to Focus
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FocusReminder;
