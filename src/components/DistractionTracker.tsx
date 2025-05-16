
import React from 'react';
import { useProcrastination } from '@/context/ProcrastinationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

const DistractionTracker = () => {
  const { distractions, resetDailyStats } = useProcrastination();

  const getMessageBasedOnDistractions = () => {
    if (distractions.count === 0) {
      return "Amazing focus! You haven't been distracted yet.";
    } else if (distractions.count < 5) {
      return "Good job staying mostly focused!";
    } else if (distractions.count < 10) {
      return "Try to minimize tab switching for better focus.";
    } else {
      return "You're getting distracted frequently. Take a deep breath and refocus.";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Distraction Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center">
          <div className="text-4xl font-bold mb-2">{distractions.count}</div>
          <div className="text-sm text-muted-foreground mb-4">Number of Distracted Moments Today</div>
          <div className="text-sm mb-4">{getMessageBasedOnDistractions()}</div>
          <Button variant="outline" size="sm" onClick={resetDailyStats}>
            Reset Counter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistractionTracker;
