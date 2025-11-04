import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { departments } from "../lib/mockData";
import { Course } from "../types/lms";

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (course: Partial<Course>) => void;
}

const programTypes = ['MCA', 'BCA', 'BSc', 'MSc', 'BBA', 'MBA'];

export function AddCourseDialog({ open, onOpenChange, onAdd }: AddCourseDialogProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [programType, setProgramType] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = () => {
    if (name && code && programType && department) {
      onAdd({ name, code, department, program: programType });
      setName('');
      setCode('');
      setProgramType('');
      setDepartment('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>
            Add a new course to your curriculum. You'll be able to add units and topics after creation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="course-name">Course Name</Label>
            <Input 
              id="course-name"
              placeholder="e.g., Basics of Programming"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-code">Course Code</Label>
            <Input 
              id="course-code"
              placeholder="e.g., CS101"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="program-type">Program Type</Label>
            <Select value={programType} onValueChange={setProgramType}>
              <SelectTrigger id="program-type">
                <SelectValue placeholder="Select program type" />
              </SelectTrigger>
              <SelectContent>
                {programTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name || !code || !programType || !department}>
            Create Course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
