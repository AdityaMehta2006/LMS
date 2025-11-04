import { ContentStatus } from "../types/lms";
import { Circle } from "lucide-react";

interface StatusTimelineProps {
  status: ContentStatus;
  compact?: boolean;
}

export function StatusTimeline({ status, compact = false }: StatusTimelineProps) {
  const stages = [
    { id: 'planned', label: 'Planned', color: 'bg-slate-400' },
    { id: 'scripting', label: 'Scripting', color: 'bg-indigo-500' },
    { id: 'recording', label: 'Recording', color: 'bg-red-500' },
    { id: 'editing', label: 'Editing', color: 'bg-amber-500' },
    { id: 'uploaded', label: 'Uploaded', color: 'bg-blue-500' },
    { id: 'under_review', label: 'Review', color: 'bg-purple-500' },
    { id: 'approved', label: 'Approved', color: 'bg-cyan-500' },
    { id: 'finalized', label: 'Published', color: 'bg-green-500' },
  ];

  const getCurrentStageIndex = (currentStatus: ContentStatus) => {
    return stages.findIndex(stage => stage.id === currentStatus);
  };

  const currentIndex = getCurrentStageIndex(status);

  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <div key={stage.id} className="flex items-center">
            {/* Stage Dot */}
            <div className="relative group">
              <div
                className={`
                  w-3 h-3 rounded-full transition-all duration-200
                  ${isCompleted ? stage.color : 'bg-gray-200 border-2 border-gray-300'}
                  ${isCurrent ? 'ring-2 ring-offset-1 ring-opacity-50' : ''}
                  ${isCurrent && stage.color}
                `}
                style={isCurrent ? { boxShadow: `0 0 0 3px ${stage.color.replace('bg-', 'rgba(var(--')}-500), 0.2)` } : {}}
              />
              
              {/* Tooltip */}
              {!compact && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {stage.label}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              )}
            </div>
            
            {/* Connector Line */}
            {index < stages.length - 1 && (
              <div 
                className={`
                  h-0.5 w-2 transition-all duration-200
                  ${isCompleted ? stage.color : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Alternative: Labeled version for more prominent display
interface StatusTimelineLabeledProps {
  status: ContentStatus;
}

export function StatusTimelineLabeled({ status }: StatusTimelineLabeledProps) {
  const stages = [
    { id: 'planned', label: 'Planned', shortLabel: 'Plan', color: 'bg-slate-400', textColor: 'text-slate-700' },
    { id: 'scripting', label: 'Scripting', shortLabel: 'Script', color: 'bg-indigo-500', textColor: 'text-indigo-700' },
    { id: 'recording', label: 'Recording', shortLabel: 'Record', color: 'bg-red-500', textColor: 'text-red-700' },
    { id: 'editing', label: 'Editing', shortLabel: 'Edit', color: 'bg-amber-500', textColor: 'text-amber-700' },
    { id: 'uploaded', label: 'Uploaded', shortLabel: 'Upload', color: 'bg-blue-500', textColor: 'text-blue-700' },
    { id: 'under_review', label: 'Review', shortLabel: 'Review', color: 'bg-purple-500', textColor: 'text-purple-700' },
    { id: 'approved', label: 'Approved', shortLabel: 'Approve', color: 'bg-cyan-500', textColor: 'text-cyan-700' },
    { id: 'finalized', label: 'Published', shortLabel: 'Publish', color: 'bg-green-500', textColor: 'text-green-700' },
  ];

  const getCurrentStageIndex = (currentStatus: ContentStatus) => {
    return stages.findIndex(stage => stage.id === currentStatus);
  };

  const currentIndex = getCurrentStageIndex(status);

  return (
    <div className="inline-flex items-center gap-1 bg-gray-50 rounded-lg px-3 py-2">
      {stages.map((stage, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <div key={stage.id} className="flex items-center">
            {/* Stage with Label */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-2.5 h-2.5 rounded-full transition-all duration-200
                  ${isCompleted ? stage.color : 'bg-gray-300'}
                  ${isCurrent ? 'ring-2 ring-offset-1 ' + stage.color : ''}
                `}
              />
              {isCurrent && (
                <span className={`text-[10px] ${stage.textColor}`}>
                  {stage.shortLabel}
                </span>
              )}
            </div>
            
            {/* Connector Line */}
            {index < stages.length - 1 && (
              <div 
                className={`
                  h-0.5 w-2 mx-0.5 transition-all duration-200
                  ${isCompleted && index < currentIndex ? stage.color : 'bg-gray-300'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
