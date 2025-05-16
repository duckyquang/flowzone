
import React, { useState } from 'react';
import { useProcrastination } from '@/context/ProcrastinationContext';
import { PomodoroSettings } from '@/types/procrastination';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const PomodoroSettingsDialog = () => {
  const { pomodoroSettings, updatePomodoroSettings } = useProcrastination();
  const [settings, setSettings] = useState<PomodoroSettings>({...pomodoroSettings});
  const [open, setOpen] = useState(false);
  
  const handleInputChange = (field: keyof PomodoroSettings, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setSettings(prev => ({ ...prev, [field]: numValue }));
    }
  };
  
  const handleSave = () => {
    // Validate settings before saving
    if (settings.workDuration <= 0 || settings.breakDuration <= 0 || 
        settings.longBreakDuration <= 0 || settings.sessionsBeforeLongBreak <= 0) {
      toast("Invalid Settings", {
        description: "All duration values must be greater than 0.",
      });
      return;
    }
    
    updatePomodoroSettings(settings);
    setOpen(false);
    toast("Settings Updated", {
      description: "Your Pomodoro timer settings have been updated.",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pomodoro Timer Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="workDuration" className="text-right">
              Work Duration (min)
            </Label>
            <Input
              id="workDuration"
              type="number"
              min="1"
              value={settings.workDuration}
              onChange={(e) => handleInputChange('workDuration', e.target.value)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="breakDuration" className="text-right">
              Break Duration (min)
            </Label>
            <Input
              id="breakDuration"
              type="number"
              min="1"
              value={settings.breakDuration}
              onChange={(e) => handleInputChange('breakDuration', e.target.value)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="longBreakDuration" className="text-right">
              Long Break (min)
            </Label>
            <Input
              id="longBreakDuration"
              type="number"
              min="1"
              value={settings.longBreakDuration}
              onChange={(e) => handleInputChange('longBreakDuration', e.target.value)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="sessionsBeforeLongBreak" className="text-right">
              Sessions Before Long Break
            </Label>
            <Input
              id="sessionsBeforeLongBreak"
              type="number"
              min="1"
              value={settings.sessionsBeforeLongBreak}
              onChange={(e) => handleInputChange('sessionsBeforeLongBreak', e.target.value)}
              className="col-span-2"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PomodoroSettingsDialog;
