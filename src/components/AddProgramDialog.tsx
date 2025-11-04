import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Degree } from "../lib/mockData";

interface AddProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (programData: {
    name: string;
    shortName: string;
    department: string;
    duration: string;
    description: string;
  }) => void;
  editingProgram?: Degree | null;
}

export function AddProgramDialog({ open, onOpenChange, onSubmit, editingProgram }: AddProgramDialogProps) {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [department, setDepartment] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingProgram) {
      setName(editingProgram.name);
      setShortName(editingProgram.shortName);
      setDepartment(editingProgram.department);
      setDuration(editingProgram.duration);
      setDescription(editingProgram.description);
    } else {
      setName('');
      setShortName('');
      setDepartment('');
      setDuration('');
      setDescription('');
    }
  }, [editingProgram, open]);

  const handleSubmit = () => {
    if (!name || !shortName || !department || !duration) return;

    onSubmit({
      name,
      shortName,
      department,
      duration,
      description,
    });

    // Reset form
    setName('');
    setShortName('');
    setDepartment('');
    setDuration('');
    setDescription('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName('');
      setShortName('');
      setDepartment('');
      setDuration('');
      setDescription('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingProgram ? 'Edit Program' : 'Add New Program'}</DialogTitle>
          <DialogDescription>
            {editingProgram ? 'Update program information' : 'Create a new degree program'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shortName">Program Code</Label>
              <Input
                id="shortName"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g., BCA, MCA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 3 Years"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Program Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Bachelor of Computer Applications"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Business Administration">Business Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the program"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name || !shortName || !department || !duration}>
            {editingProgram ? 'Update Program' : 'Create Program'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
