
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
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2 pt-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <ChartLine className="h-6 w-6" />
          Productivity Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex-1 flex flex-col">
        <Tabs defaultValue="completion" className="flex-1 flex flex-col">
          <TabsList className="mb-6 grid grid-cols-2 gap-2">
            <TabsTrigger value="completion" className="py-3">Task Completion</TabsTrigger>
            <TabsTrigger value="timeSpent" className="py-3">Time Spent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="completion" className="flex-1 flex flex-col space-y-8">
            <div className="flex flex-wrap gap-x-10 gap-y-6 items-center justify-center sm:justify-between">
              <div className="flex items-center gap-6 bg-muted/50 p-6 px-8 rounded-lg shadow-sm">
                <CheckCheck className="text-focus-green h-8 w-8" />
                <div>
                  <div className="text-base font-medium mb-2">Task Completion</div>
                  <div className="text-3xl font-bold">{completedTasksCount} / {tasks.length}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 bg-muted/50 p-6 px-8 rounded-lg shadow-sm">
                <div className="text-base font-medium mb-2">Completion Rate</div>
                <div className="text-3xl font-bold">
                  {tasks.length > 0 ? `${completionRate}%` : 'N/A'}
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center px-8 py-8 min-h-[260px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                <PieChart margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={90}
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
                    contentStyle={{ padding: '10px', borderRadius: '8px' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center" 
                    wrapperStyle={{ paddingTop: "40px", marginBottom: "20px" }}
                    iconSize={12}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="timeSpent" className="flex-1 flex flex-col space-y-8">
            <div className="py-6 px-8 rounded-lg shadow-sm bg-muted/50">
              <div className="flex items-center gap-6">
                <Clock className="h-7 w-7 text-focus-blue" />
                <div>
                  <div className="text-base font-medium mb-2">Time Allocation</div>
                  <div className="text-2xl font-bold">Top {Math.min(5, timeSpentData.length)} Tasks</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center px-8 py-6 min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                {timeSpentData.length > 0 ? (
                  <BarChart
                    data={timeSpentData}
                    layout="vertical"
                    margin={{ top: 20, right: 60, left: 60, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickFormatter={formatMinutes} />
                    <YAxis type="category" dataKey="name" width={130} />
                    <Tooltip 
                      formatter={(value) => [`${formatMinutes(Number(value))}`, 'Time Spent']}
                      contentStyle={{ padding: '10px', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" barSize={20}>
                      {timeSpentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList 
                        dataKey="value" 
                        position="right"
                        formatter={formatMinutes}
                        style={{ fontWeight: 'bold' }}
                      />
                    </Bar>
                  </BarChart>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground text-lg">
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
