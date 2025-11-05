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
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [materialFiles, setMaterialFiles] = useState<FileList | null>(null);
  const [editorComments, setEditorComments] = useState(topic.editorComments || '');

  const handleSubmit = () => {
    const pptUrl = pptFile ? pptFile.name : '';
    const contentMaterialsUrl = materialFiles 
      ? Array.from(materialFiles as FileList).map((file) => file.name)
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
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Prepare Scripting Materials: {topic.name}</DialogTitle>
          <DialogDescription>
            Upload presentation slides, content materials, and provide instructions for the editor
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4 overflow-y-auto flex-1 min-h-0">
        
          

          {/* PPT Upload */}
          <div className="space-y-2">
            <Label htmlFor="ppt-upload">Presentation Slides (PPT)</Label>
            <div className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
              pptFile ? 'border-green-300 bg-green-50' : 'border-gray-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Presentation className={`w-8 h-8 ${pptFile ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm">
                      {pptFile ? 'Presentation uploaded' : 'Click to upload PPT'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {pptFile ? pptFile.name : 'PPTX, PDF, or Google Slides'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="ppt-upload"
                    type="file"
                    accept=".ppt,.pptx,.pdf"
                    onChange={(e) => setPptFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => document.getElementById('ppt-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  {pptFile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPptFile(null)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Materials */}
          <div className="space-y-2">
            <Label htmlFor="materials-upload">Content Materials (PDFs, Documents)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-8 h-8 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm">Additional learning materials for the editor</p>
                  <p className="text-xs text-gray-500">References, notes, code samples, etc.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="materials-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.md"
                  onChange={(e) => setMaterialFiles(e.target.files)}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('materials-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select Files
                </Button>
                {materialFiles && materialFiles.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {materialFiles.length} file{materialFiles.length > 1 ? 's' : ''} selected
                  </span>
                )}
              </div>
              {materialFiles && materialFiles.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-600 mb-2">Selected files:</p>
                  <div className="w-full overflow-x-auto pb-2">
                    <div className="flex gap-2 w-max">
                      {Array.from(materialFiles as FileList).map((file, i) => (
                        <div key={i} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-xs text-gray-600 whitespace-nowrap flex-shrink-0">
                          <FileText className="w-3 h-3 flex-shrink-0" />
                          <span className="max-w-32 truncate">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMaterialFiles(null)}
                    className="mt-2 text-xs h-7"
                  >
                    Clear all files
                  </Button>
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

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!pptFile && (!materialFiles || materialFiles.length === 0)}>
            <Upload className="w-4 h-4 mr-2" />
            Complete Scripting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
