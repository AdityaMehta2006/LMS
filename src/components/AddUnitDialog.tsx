import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AddUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (unitName: string) => void;
}

export function AddUnitDialog({ open, onOpenChange, onAdd }: AddUnitDialogProps) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name) {
      onAdd(name);
      setName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Unit</DialogTitle>
          <DialogDescription>
            Create a new unit to organize related topics within this course.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="unit-name">Unit Name</Label>
            <Input 
              id="unit-name"
              placeholder="e.g., Introduction to Computing"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name}>
            Add Unit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
