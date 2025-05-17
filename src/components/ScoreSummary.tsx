import React from 'react';

interface ScoreSummaryProps {
  scorePercent: number;
  targetsRatio: string;
}

// Format function for number values
const formatValue = (value: number) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'NA';
  }
  
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B';
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  } else {
    return value.toFixed(1);
  }
};

const ScoreSummary: React.FC<ScoreSummaryProps> = ({
  scorePercent,
  targetsRatio
}) => {
  // Format the score percent using the formatValue function
  const formattedScore = formatValue(scorePercent);
  
  return (
    <div className="p-4 rounded-lg text-center">
      <h3 className="text-lg font-medium">Overall EBITDA</h3>
      <div className="text-4xl font-bold mt-1">{formattedScore}</div>
      <div className="text-lg mt-1">{targetsRatio}</div>
      <div className="text-sm">Business verticals</div>
      <div className="text-sm font-medium mt-2">Face High Target Achievement Risk</div>
    </div>
  );
};

export default ScoreSummary;

