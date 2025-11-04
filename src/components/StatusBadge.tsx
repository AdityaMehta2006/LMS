import { ContentStatus } from "../types/lms";

interface StatusBadgeProps {
  status: ContentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
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
  const currentStage = stages[currentIndex];

  return (
    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
      {/* Timeline dots */}
      <div className="flex items-center gap-0.5">
        {stages.map((stage, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={stage.id} className="flex items-center">
              {/* Stage Dot */}
              <div className="relative group">
                <div
                  className={`
                    transition-all duration-200
                    ${isCurrent ? 'w-2.5 h-2.5' : 'w-2 h-2'}
                    rounded-full
                    ${isCompleted ? stage.color : 'bg-gray-200'}
                    ${isCurrent ? 'ring-2 ring-offset-1 ring-' + stage.color.replace('bg-', '') + '-200' : ''}
                  `}
                />
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {stage.label}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="border-4 border-transparent border-t-gray-900" style={{ marginTop: '-4px' }} />
                  </div>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div 
                  className={`
                    h-0.5 w-1.5 transition-all duration-200
                    ${isCompleted && index < currentIndex ? stage.color : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current stage label */}
      <span className="text-xs text-gray-700">
        {currentStage.label}
      </span>
    </div>
  );
}
