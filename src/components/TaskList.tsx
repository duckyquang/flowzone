
import React, { useState } from 'react';
import { useProcrastination } from '@/context/ProcrastinationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { ListTodo, Plus, Trash2 } from 'lucide-react';

const TaskList = () => {
  const { tasks, addTask, toggleTaskCompletion, deleteTask } = useProcrastination();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      priority: newTaskPriority,
      completed: false,
      createdAt: new Date().toISOString()
    });

    toast('Task Added', {
      description: 'Your new task has been added to the list.'
    });

    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setDialogOpen(false);
  };

  const getPriorityClass = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-l-4 border-red-500 dark:bg-red-900/20';
      case 'medium': return 'bg-yellow-100 border-l-4 border-yellow-500 dark:bg-yellow-900/20';
      case 'low': return 'bg-green-100 border-l-4 border-green-500 dark:bg-green-900/20';
      default: return '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="h-5 w-5" />
          Tasks
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-medium">
                  Description (optional)
                </label>
                <Textarea
                  id="description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Task description"
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select
                  value={newTaskPriority}
                  onValueChange={(val) => setNewTaskPriority(val as 'low' | 'medium' | 'high')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Add Task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tasks yet. Add your first task to get started!
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-3 rounded-md flex items-start gap-3 transition-colors ${getPriorityClass(task.priority)}`}
              >
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div className={`text-sm mt-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                      {task.description}
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
