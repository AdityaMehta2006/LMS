import { Progress } from "./ui/progress";
import { Topic } from "../types/lms";
import { FileText, Upload, Eye, CheckCircle } from "lucide-react";

interface ProgressIndicatorProps {
  topics: Topic[];
}

export function ProgressIndicator({ topics }: ProgressIndicatorProps) {
  const totalTopics = topics.length;
  const plannedTopics = topics.filter(t => t.status === 'planned').length;
  const uploadedTopics = topics.filter(t => t.status === 'uploaded' || t.status === 'under_review').length;
  const reviewedTopics = topics.filter(t => t.status === 'approved').length;
  const finalizedTopics = topics.filter(t => t.status === 'finalized').length;
  
  const completionPercentage = totalTopics > 0 ? (finalizedTopics / totalTopics) * 100 : 0;

  const statusItems = [
    {
      icon: FileText,
      label: 'Planned',
      count: plannedTopics,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      progressColor: 'bg-gray-400',
    },
    {
      icon: Upload,
      label: 'Uploaded',
      count: uploadedTopics,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      progressColor: 'bg-blue-500',
    },
    {
      icon: Eye,
      label: 'Reviewed',
      count: reviewedTopics,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      progressColor: 'bg-purple-500',
    },
    {
      icon: CheckCircle,
      label: 'Finalized',
      count: finalizedTopics,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      progressColor: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Overall Completion
          </span>
          <span className="text-sm">
            {finalizedTopics} of {totalTopics} ({Math.round(completionPercentage)}%)
          </span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statusItems.map((item) => {
          const Icon = item.icon;
          const percentage = totalTopics > 0 ? (item.count / totalTopics) * 100 : 0;
          
          return (
            <div key={item.label} className={`${item.bgColor} rounded-lg p-3 transition-all hover:shadow-sm`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-2xl ${item.color}`}>{item.count}</span>
                <span className="text-xs text-gray-500">/ {totalTopics}</span>
              </div>
              <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full ${item.progressColor} transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
