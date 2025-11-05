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
    <div className="flex flex-col items-center p-4">
      <div className="relative">
        <svg width="200" height="120" className="overflow-visible drop-shadow-md">
          {/* Background arc */}
          <path
            d={`M 20 100 A ${radius} ${radius} 0 0 1 180 100`}
            fill="none"
            stroke="#e2e8f0"
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
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '40%' }}>
          <div className="text-4xl bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">{value}</div>
          <div className="text-sm text-muted-foreground mt-0.5">out of {max}</div>
        </div>
      </div>
      <p className="mt-4 text-center text-sm">{label}</p>
    </div>
  );
}
