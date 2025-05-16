
import React, { useMemo } from 'react';
import { useProcrastination } from '@/context/ProcrastinationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList
} from 'recharts';
import { ChartLine, CheckCheck, Clock } from 'lucide-react';

const ProgressChart = () => {
  const { tasks, completedTasksCount } = useProcrastination();
  
  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((completedTasksCount / tasks.length) * 100);
  }, [tasks, completedTasksCount]);

  const pieData = useMemo(() => {
    if (tasks.length === 0) {
      return [{ name: 'No Tasks', value: 1, color: '#e2e8f0' }];
    }
    
    return [
      { name: 'Completed', value: completedTasksCount, color: '#10B981' },
      { name: 'Remaining', value: tasks.length - completedTasksCount, color: '#3B82F6' }
    ];
  }, [tasks.length, completedTasksCount]);

  // Create data for the time spent chart
  const timeSpentData = useMemo(() => {
    return tasks
      .filter(task => task.timeSpent && task.timeSpent > 0)
      .map(task => ({
        name: task.title.length > 15 ? task.title.substring(0, 15) + '...' : task.title,
        value: Math.round(task.timeSpent ? task.timeSpent / 60 : 0), // Convert seconds to minutes
        color: task.completed ? '#10B981' : '#3B82F6',
      }))
      .sort((a, b) => b.value - a.value) // Sort by time spent (descending)
      .slice(0, 5); // Show only top 5 tasks
  }, [tasks]);

  // Format minutes for the chart
  const formatMinutes = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className="w-full h-[450px]">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2">
          <ChartLine className="h-5 w-5" />
          Productivity Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)]">
        <Tabs defaultValue="completion">
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="completion">Task Completion</TabsTrigger>
            <TabsTrigger value="timeSpent">Time Spent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="completion" className="h-[350px]">
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
            
            <div className="h-[200px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} tasks`, name]}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center" 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="timeSpent" className="h-[350px]">
            <div className="mb-4 flex items-center gap-2 bg-muted/50 p-2 rounded-md">
              <Clock className="h-5 w-5 text-focus-blue" />
              <div>
                <div className="text-sm font-medium">Time Allocation</div>
                <div className="text-xl font-bold">Top {Math.min(5, timeSpentData.length)} Tasks</div>
              </div>
            </div>
            
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {timeSpentData.length > 0 ? (
                  <BarChart
                    data={timeSpentData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickFormatter={formatMinutes} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(value) => [`${formatMinutes(Number(value))}`, 'Time Spent']} />
                    <Bar dataKey="value">
                      {timeSpentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList 
                        dataKey="value" 
                        position="right"
                        formatter={formatMinutes} 
                      />
                    </Bar>
                  </BarChart>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    No time data available yet. Start working on tasks!
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
