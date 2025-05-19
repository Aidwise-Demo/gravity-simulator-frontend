import React from 'react';

interface ScoreSummaryProps {
  scorePercent: number;
  targetsRatio: string;
  targetDiff: number;
  metric: string;
}

// Format function for number values
const formatValue = (value: number) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'NA';
  }
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + 'B';
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + 'M';
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + 'K';
  } else {
    return value.toFixed(1);
  }
};

const ScoreSummary = ({ scorePercent, targetsRatio, targetDiff, metric }: ScoreSummaryProps) => {
  const formattedScore = formatValue(scorePercent);
  const formattedTargetDiff = formatValue(Math.abs(targetDiff));
  const isPositive = targetDiff >= 0;

  return (
    <div className="p-4 rounded-lg text-center border-2 border-gray-300 shadow-md">
      <h3 className="text-base font-bold">Overall {metric}</h3>
      <div className="relative mt-2 mb-1">
        <div className="flex items-end justify-center">
          <div className="text-5xl font-bold">{formattedScore}</div>
          <div className={`ml-1 ${isPositive ? 'bg-green-500' : 'bg-red-500'} rounded p-1 text-white font-medium flex items-center`}>
            <span className="inline mr-1 text-lg">
              {isPositive ? '↑' : '↓'}
            </span>
            <span>{formattedTargetDiff}%</span>
          </div>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className="text-lg font-medium">{targetsRatio}</div>
        <div className="text-sm text-blue-600 font-medium">Business verticals</div>
        <div className="text-sm font-bold text-black-600 mt-0">Face High Target Achievement Risk</div>
      </div>
    </div>
  );
};

export default ScoreSummary;