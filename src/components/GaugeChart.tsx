import React, { useEffect, useState } from 'react';

interface GaugeChartProps {
  actualValue: number;
  targetValue: number;
  achievementStatus: string;
}

// Moved the formatting function within the component file
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

const GaugeChart: React.FC<GaugeChartProps> = ({
  actualValue,
  targetValue,
  achievementStatus
}) => {
  const [formattedActual, setFormattedActual] = useState('0');
  const [formattedTarget, setFormattedTarget] = useState('0');
  const [formattedOverallMax, setFormattedOverallMax] = useState('0');
  
  // Calculate the maximum value for the gauge (set to 2.5x larger for visual scale)
  const overallMaxValue = Math.max(actualValue, targetValue) * 2.5;
  
  useEffect(() => {
    // Format values using the formatValue function
    setFormattedActual(formatValue(actualValue));
    setFormattedTarget(formatValue(targetValue));
    setFormattedOverallMax(formatValue(overallMaxValue));
  }, [actualValue, targetValue, overallMaxValue]);
  
  // Calculate the percentage for the actual value fill in the gauge
  const actualPercentage = (actualValue / overallMaxValue) * 100;
  
  // Calculate the position for the target marker (blue line)
  const targetPercentage = (targetValue / overallMaxValue) * 100;
  
  return (
    <div className="relative flex flex-col">
      <h3 className="font-medium mb-4">EBITDA (in AED)</h3>
      
      {/* Gauge visualization */}
      <div className="relative h-24 w-full">
        {/* Background semi-circle (light gray) */}
        <div className="absolute top-0 left-0 h-full w-full bg-gray-100 rounded-l-full"></div>
        
        {/* Actual value fill (green) */}
        <div
          className="absolute top-0 left-0 h-full bg-status-green rounded-l-full"
          style={{ width: `${actualPercentage}%` }}
        ></div>
        
        {/* Target marker (blue line) */}
        {targetValue > 0 && (
          <div
            className="absolute top-0 h-full border-r-2 border-chart-blue"
            style={{ left: `${targetPercentage}%` }}
          ></div>
        )}
        
        {/* Value labels */}
        <div className="absolute top-0 left-0 text-sm">
          <div className="font-medium">0</div>
        </div>
        <div className="absolute top-0 left-1/4 text-sm">
          <div className="font-medium">{formattedTarget}</div>
        </div>
        <div className="absolute top-0 right-0 text-sm">
          <div className="font-medium">{formattedOverallMax}</div>
        </div>
        
        {/* Center content */}
        <div className="absolute left-12 top-1/2 transform -translate-y-1/2 text-center">
          <span className="text-4xl font-bold">{formattedActual}</span>
        </div>
      </div>
      
      {/* Status text */}
      <div className="text-xs mt-4 text-center">
        EBITDA Status for March 2025: {achievementStatus} of Target
      </div>
      
      {/* Legend */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-status-green"></div>
          <span className="text-xs">Actual Value for March 2025</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-chart-blue"></div>
          <span className="text-xs">Target Value for March 2025</span>
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;