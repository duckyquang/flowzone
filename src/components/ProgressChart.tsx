
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
    <Card className="w-full h-full">
      <CardHeader className="pb-1 pt-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ChartLine className="h-5 w-5" />
          Productivity Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-2">
        <Tabs defaultValue="completion" className="w-full">
          <TabsList className="mb-4 grid grid-cols-2 gap-2 w-full">
            <TabsTrigger value="completion" className="py-1.5">Task Completion</TabsTrigger>
            <TabsTrigger value="timeSpent" className="py-1.5">Time Spent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="completion" className="mt-0 space-y-4">
            <div className="flex flex-wrap gap-6 items-center justify-between">
              <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
                <CheckCheck className="text-focus-green h-6 w-6" />
                <div>
                  <div className="text-sm font-medium">Task Completion</div>
                  <div className="text-xl font-bold">{completedTasksCount} / {tasks.length}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
                <div className="text-sm font-medium">Completion Rate</div>
                <div className="text-xl font-bold">
                  {tasks.length > 0 ? `${completionRate}%` : 'N/A'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center px-3 py-2 min-h-[180px]">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={70}
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
                    contentStyle={{ padding: '6px', borderRadius: '6px' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center" 
                    wrapperStyle={{ paddingTop: "20px", marginBottom: "0" }}
                    iconSize={10}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="timeSpent" className="mt-0 space-y-4">
            <div className="py-3 px-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-focus-blue" />
                <div>
                  <div className="text-sm font-medium">Time Allocation</div>
                  <div className="text-xl font-bold">Top {Math.min(5, timeSpentData.length)} Tasks</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center px-3 py-2 min-h-[180px]">
              <ResponsiveContainer width="100%" height={180}>
                {timeSpentData.length > 0 ? (
                  <BarChart
                    data={timeSpentData}
                    layout="vertical"
                    margin={{ top: 10, right: 40, left: 40, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickFormatter={formatMinutes} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip 
                      formatter={(value) => [`${formatMinutes(Number(value))}`, 'Time Spent']}
                      contentStyle={{ padding: '6px', borderRadius: '6px' }}
                    />
                    <Bar dataKey="value" barSize={15}>
                      {timeSpentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList 
                        dataKey="value" 
                        position="right"
                        formatter={formatMinutes}
                        style={{ fontWeight: 'bold', fontSize: '12px' }}
                      />
                    </Bar>
                  </BarChart>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
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
