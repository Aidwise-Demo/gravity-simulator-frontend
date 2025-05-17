// import React, { useEffect, useState } from 'react';

// interface GaugeChartProps {
//   actualValue: number;
//   targetValue: number;
//   achievementStatus: string;
// }

// // Moved the formatting function within the component file
// const formatValue = (value: number) => {
//   if (value === null || value === undefined || isNaN(value)) {
//     return 'NA';
//   }
  
//   if (value >= 1000000000) {
//     return (value / 1000000000).toFixed(1) + 'B';
//   } else if (value >= 1000000) {
//     return (value / 1000000).toFixed(1) + 'M';
//   } else if (value >= 1000) {
//     return (value / 1000).toFixed(1) + 'K';
//   } else {
//     return value.toFixed(1);
//   }
// };

// const GaugeChart: React.FC<GaugeChartProps> = ({
//   actualValue,
//   targetValue,
//   achievementStatus
// }) => {
//   const [formattedActual, setFormattedActual] = useState('0');
//   const [formattedTarget, setFormattedTarget] = useState('0');
//   const [formattedOverallMax, setFormattedOverallMax] = useState('0');
  
//   // Calculate the maximum value for the gauge (set to 2.5x larger for visual scale)
//   const overallMaxValue = Math.max(actualValue, targetValue) * 2.5;
  
//   useEffect(() => {
//     // Format values using the formatValue function
//     setFormattedActual(formatValue(actualValue));
//     setFormattedTarget(formatValue(targetValue));
//     setFormattedOverallMax(formatValue(overallMaxValue));
//   }, [actualValue, targetValue, overallMaxValue]);
  
//   // Calculate the percentage for the actual value fill in the gauge
//   const actualPercentage = (actualValue / overallMaxValue) * 100;
  
//   // Calculate the position for the target marker (blue line)
//   const targetPercentage = (targetValue / overallMaxValue) * 100;
  
//   return (
//     <div className="relative flex flex-col">
//       <h3 className="font-medium mb-4">EBITDA (in AED)</h3>
      
//       {/* Gauge visualization */}
//       <div className="relative h-24 w-full">
//         {/* Background semi-circle (light gray) */}
//         <div className="absolute top-0 left-0 h-full w-full bg-gray-100 rounded-l-full"></div>
        
//         {/* Actual value fill (green) */}
//         <div
//           className="absolute top-0 left-0 h-full bg-status-green rounded-l-full"
//           style={{ width: `${actualPercentage}%` }}
//         ></div>
        
//         {/* Target marker (blue line) */}
//         {targetValue > 0 && (
//           <div
//             className="absolute top-0 h-full border-r-2 border-chart-blue"
//             style={{ left: `${targetPercentage}%` }}
//           ></div>
//         )}
        
//         {/* Value labels */}
//         <div className="absolute top-0 left-0 text-sm">
//           <div className="font-medium">0</div>
//         </div>
//         <div className="absolute top-0 left-1/4 text-sm">
//           <div className="font-medium">{formattedTarget}</div>
//         </div>
//         <div className="absolute top-0 right-0 text-sm">
//           <div className="font-medium">{formattedOverallMax}</div>
//         </div>
        
//         {/* Center content */}
//         <div className="absolute left-12 top-1/2 transform -translate-y-1/2 text-center">
//           <span className="text-4xl font-bold">{formattedActual}</span>
//         </div>
//       </div>
      
//       {/* Status text */}
//       <div className="text-xs mt-4 text-center">
//         EBITDA Status for March 2025: {achievementStatus} of Target
//       </div>
      
//       {/* Legend */}
//       <div className="flex flex-col gap-2 mt-4">
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-status-green"></div>
//           <span className="text-xs">Actual Value for March 2025</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 border border-chart-blue"></div>
//           <span className="text-xs">Target Value for March 2025</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GaugeChart;
import React, { useEffect, useState } from 'react';

interface GaugeChartProps {
  actualValue: number;
  targetValue: number;
  achievementStatus: string;
  metric: string;
}

const formatValue = (value: number) => {
  if (!value || isNaN(value)) return 'NA';
  if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
  return value.toString();
};

const GaugeChart: React.FC<GaugeChartProps> = ({
  actualValue,
  targetValue,
  achievementStatus,
  metric
}) => {
  const [formattedActual, setFormattedActual] = useState('');
  const [formattedTarget, setFormattedTarget] = useState('');
  const [formattedMax, setFormattedMax] = useState('');

  const maxValue = Math.max(actualValue, targetValue) * 2.5;

  useEffect(() => {
    setFormattedActual(formatValue(actualValue));
    setFormattedTarget(formatValue(targetValue));
    setFormattedMax(formatValue(maxValue));
  }, [actualValue, targetValue, maxValue]);

  // Calculate angles for the arc
  const angleFromValue = (value: number) => {
    const percent = Math.min(value / maxValue, 1);
    return percent * 180; // 0° to 180°
  };

  const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const angleInRadians = ((angleDeg - 180) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians)
    };
  };

  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y, 
      "A", r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const centerX = 100;
  const centerY = 100;
  const radius = 80;
  const strokeWidth = 18;

  const actualAngle = angleFromValue(actualValue);
  const targetAngle = angleFromValue(targetValue);
  const targetPos = polarToCartesian(centerX, centerY, radius, targetAngle);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-md font-medium mb-2">{metric} (in AED)</h3>

      <svg width="220" height="120" viewBox="0 0 200 120">
        {/* Background Arc */}
        <path
          d={describeArc(centerX, centerY, radius, 0, 180)}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Actual Value Arc */}
        <path
          d={describeArc(centerX, centerY, radius, 0, actualAngle)}
          stroke="#10b981"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Target Marker */}
        <line
          x1={targetPos.x}
          y1={targetPos.y}
          x2={targetPos.x}
          y2={targetPos.y - 12}
          stroke="#3b82f6"
          strokeWidth="3"
        />

        {/* Labels: 0, Target, Max */}
        <text x="0" y="115" fontSize="10">0M</text>
        <text x="200" y="115" fontSize="10" textAnchor="end">{formattedMax} (Q4 Target)</text>
        
        {/* Target Value Label */}
        <text 
          x={targetPos.x} 
          y={targetPos.y - 15} 
          fontSize="10" 
          textAnchor="middle" 
          fill="#3b82f6"
        >
          {formattedTarget}
        </text>

        {/* Center Actual */}
        <text x="100" y="88" textAnchor="middle" fontSize="24" fontWeight="bold">
          {formattedActual}
        </text>
      </svg>

      <div className="text-xs mt-1">
        {metric} Status for March 2025: {achievementStatus} of Target
      </div>

      <div className="flex flex-col gap-1 mt-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Actual Value for March 2025</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-500"></div>
          <span>Target Value for March 2025</span>
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;