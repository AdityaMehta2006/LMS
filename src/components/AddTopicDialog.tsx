import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Topic } from "../types/lms";

interface AddTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (topic: Partial<Topic>) => void;
}

export function AddTopicDialog({ open, onOpenChange, onAdd }: AddTopicDialogProps) {
  const [name, setName] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  const handleSubmit = () => {
    if (name && estimatedTime) {
      onAdd({ 
        name, 
        estimatedTime: parseInt(estimatedTime) 
      });
      setName('');
      setEstimatedTime('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Topic</DialogTitle>
          <DialogDescription>
            Add a topic to this unit with an estimated completion time.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="topic-name">Topic Name</Label>
            <Input 
              id="topic-name"
              placeholder="e.g., What is a Computer?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated-time">Estimated Time (minutes)</Label>
            <Input 
              id="estimated-time"
              type="number"
              placeholder="45"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name || !estimatedTime}>
            Add Topic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
