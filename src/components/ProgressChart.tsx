
import React, { useMemo } from 'react';
import { useProcrastination } from '@/context/ProcrastinationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartLine, CheckCheck } from 'lucide-react';

const ProgressChart = () => {
  const { tasks, completedTasksCount } = useProcrastination();
  
  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((completedTasksCount / tasks.length) * 100);
  }, [tasks, completedTasksCount]);

  // Generate dummy data for chart demonstration 
  // In a real app, this would come from historical task completion data
  const chartData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - i));
      
      // Generate some random data for past days
      // In a real app, this would be actual historical data
      let completedCount = i < 6 
        ? Math.floor(Math.random() * 8) 
        : completedTasksCount;
        
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedCount,
      };
    });
  }, [completedTasksCount]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <ChartLine className="h-5 w-5" />
          Productivity Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-center sm:justify-between">
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
            <CheckCheck className="text-focus-green h-5 w-5" />
            <div>
              <div className="text-sm font-medium">Task Completion</div>
              <div className="text-2xl font-bold">{completedTasksCount} / {tasks.length}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
            <div className="text-sm font-medium">Completion Rate</div>
            <div className="text-2xl font-bold">
              {tasks.length > 0 ? `${completionRate}%` : 'N/A'}
            </div>
          </div>
        </div>
        
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis 
                allowDecimals={false}
                tickCount={5}
                domain={[0, 'dataMax + 1']}
              />
              <Tooltip 
                formatter={(value) => [`${value} tasks`, 'Completed']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar 
                dataKey="completed" 
                name="Tasks Completed" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
