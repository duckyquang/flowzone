
import React, { useMemo } from 'react';
import { useProcrastination } from '@/context/ProcrastinationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartLine, CheckCheck } from 'lucide-react';

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
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
