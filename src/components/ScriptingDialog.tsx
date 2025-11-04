import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { FileText, Presentation, Upload } from "lucide-react";
import { Topic } from "../types/lms";

interface ScriptingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: Topic;
  onSubmit: (data: {
    estimatedTime: number;
    pptUrl: string;
    contentMaterialsUrl: string[];
    editorComments: string;
  }) => void;
}

export function ScriptingDialog({ open, onOpenChange, topic, onSubmit }: ScriptingDialogProps) {
  const [estimatedTime, setEstimatedTime] = useState(topic.estimatedTime.toString());
  const [hasPPT, setHasPPT] = useState(!!topic.pptUrl);
  const [materialsCount, setMaterialsCount] = useState(topic.contentMaterialsUrl?.length || 0);
  const [editorComments, setEditorComments] = useState(topic.editorComments || '');

  const handleSubmit = () => {
    const pptUrl = hasPPT ? `ppt-${topic.id}.pptx` : '';
    const contentMaterialsUrl = materialsCount > 0 
      ? Array.from({ length: materialsCount }, (_, i) => `material-${topic.id}-${i + 1}.pdf`)
      : [];

    onSubmit({
      estimatedTime: parseInt(estimatedTime) || topic.estimatedTime,
      pptUrl,
      contentMaterialsUrl,
      editorComments,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Prepare Scripting Materials: {topic.name}</DialogTitle>
          <DialogDescription>
            Upload presentation slides, content materials, and provide instructions for the editor
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Estimated Duration (minutes)</Label>
            <Input 
              id="duration"
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="45"
            />
            <p className="text-xs text-gray-500">Set or update the expected video duration</p>
          </div>

          {/* PPT Upload */}
          <div className="space-y-2">
            <Label>Presentation Slides (PPT)</Label>
            <div className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
              hasPPT ? 'border-green-300 bg-green-50' : 'border-gray-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Presentation className={`w-8 h-8 ${hasPPT ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm">
                      {hasPPT ? 'Presentation uploaded' : 'Click to upload PPT'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {hasPPT ? `ppt-${topic.id}.pptx` : 'PPTX, PDF, or Google Slides'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={hasPPT ? "outline" : "default"}
                  size="sm"
                  onClick={() => setHasPPT(!hasPPT)}
                >
                  {hasPPT ? 'Remove' : 'Upload'}
                </Button>
              </div>
            </div>
          </div>

          {/* Content Materials */}
          <div className="space-y-2">
            <Label htmlFor="materials-count">Content Materials (PDFs, Documents)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-8 h-8 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm">Additional learning materials for the editor</p>
                  <p className="text-xs text-gray-500">References, notes, code samples, etc.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="materials-count" className="text-sm">Number of files:</Label>
                <Input 
                  id="materials-count"
                  type="number"
                  min="0"
                  value={materialsCount}
                  onChange={(e) => setMaterialsCount(parseInt(e.target.value) || 0)}
                  className="w-24"
                />
              </div>
              {materialsCount > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-600 mb-2">Files to be uploaded:</p>
                  <div className="space-y-1">
                    {Array.from({ length: materialsCount }, (_, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                        <FileText className="w-3 h-3" />
                        <span>material-{topic.id}-{i + 1}.pdf</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Editor Comments */}
          <div className="space-y-2">
            <Label htmlFor="editor-comments">Instructions for Editor</Label>
            <Textarea 
              id="editor-comments"
              placeholder="E.g., Focus on slides 5-10, include code examples from material-1.pdf, emphasize the diagram on slide 8..."
              value={editorComments}
              onChange={(e) => setEditorComments(e.target.value)}
              rows={5}
            />
            <p className="text-xs text-gray-500">
              Provide specific guidance for the video editor about what to emphasize
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!hasPPT && materialsCount === 0}>
            <Upload className="w-4 h-4 mr-2" />
            Complete Scripting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
