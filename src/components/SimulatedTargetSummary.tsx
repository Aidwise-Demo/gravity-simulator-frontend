import React from 'react';

interface SimulatedTargetSummaryProps {
  simulatedValue: number;
  predefinedValue: number;
}

const formatValue = (value: number) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'NA';
  }
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2) + 'B';
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + 'M';
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + 'K';
  } else {
    return value.toFixed(1);
  }
};

const SimulatedTargetSummary: React.FC<SimulatedTargetSummaryProps> = ({
  simulatedValue,
  predefinedValue,
}) => {
  if (
    simulatedValue === undefined ||
    predefinedValue === undefined ||
    simulatedValue === null ||
    predefinedValue === null ||
    isNaN(simulatedValue) ||
    isNaN(predefinedValue) ||
    simulatedValue === predefinedValue
  ) {
    return null;
  }

  const percentDiff =
    predefinedValue !== 0
      ? ((simulatedValue - predefinedValue) / predefinedValue) * 100
      : 0;

  return (
    <div className="text-xs font-medium text-gray-700 bg-white rounded px-2 py-1 border border-gray-100">
      Simulated Target: <span className="font-bold text-blue-700">{formatValue(simulatedValue)}</span>
      <span className="ml-1 text-gray-500">
        (vs Predefined Target: <span className={percentDiff >= 0 ? 'text-green-600' : 'text-red-600'}>
          {percentDiff >= 0 ? '+' : ''}
          {percentDiff.toFixed(1)}%
        </span>)
      </span>
    </div>
  );
};

export default SimulatedTargetSummary;