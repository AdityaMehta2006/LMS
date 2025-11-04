interface HemisphereProgressProps {
  value: number;
  max: number;
  label: string;
  color?: string;
}

export function HemisphereProgress({ value, max, label, color = "#3b82f6" }: HemisphereProgressProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const radius = 80;
  const strokeWidth = 12;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="200" height="120" className="overflow-visible">
          {/* Background arc */}
          <path
            d={`M 20 100 A ${radius} ${radius} 0 0 1 180 100`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d={`M 20 100 A ${radius} ${radius} 0 0 1 180 100`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.5s ease',
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '40%' }}>
          <div className="text-3xl">{value}</div>
          <div className="text-sm text-gray-500">out of {max}</div>
        </div>
      </div>
      <p className="mt-2 text-center text-sm text-gray-700">{label}</p>
    </div>
  );
}
