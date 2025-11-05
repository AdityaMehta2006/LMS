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
    <div className="inline-flex items-center gap-2.5 bg-white border border-border/60 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
      {/* Timeline dots */}
      <div className="flex items-center gap-1">
        {stages.map((stage, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={stage.id} className="flex items-center">
              {/* Stage Dot */}
              <div className="relative">
                <div
                  className={`
                    transition-all duration-300
                    ${isCurrent ? 'w-3 h-3 ring-2 ring-offset-2' : 'w-2.5 h-2.5'}
                    rounded-full
                    ${isCompleted ? stage.color : 'bg-gray-300'}
                    ${isCurrent ? 'shadow-lg' : ''}
                  `}
                  style={isCurrent ? { 
                    ringColor: stage.color.replace('bg-', '').split('-')[0] === 'slate' ? '#cbd5e1' :
                               stage.color.replace('bg-', '').split('-')[0] === 'indigo' ? '#c7d2fe' :
                               stage.color.replace('bg-', '').split('-')[0] === 'red' ? '#fecaca' :
                               stage.color.replace('bg-', '').split('-')[0] === 'amber' ? '#fde68a' :
                               stage.color.replace('bg-', '').split('-')[0] === 'blue' ? '#bfdbfe' :
                               stage.color.replace('bg-', '').split('-')[0] === 'purple' ? '#e9d5ff' :
                               stage.color.replace('bg-', '').split('-')[0] === 'cyan' ? '#cffafe' :
                               '#bbf7d0'
                  } : {}}
                />
              </div>
              
              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div 
                  className={`
                    h-0.5 w-2 transition-all duration-300
                    ${isCompleted && index < currentIndex ? stage.color : 'bg-gray-300'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current stage label */}
      <span className="text-xs">
        {currentStage.label}
      </span>
    </div>
  );
}
