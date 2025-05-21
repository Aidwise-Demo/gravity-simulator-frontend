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
  overallValue: number;
  newTarget: number;
  metric: string;
  period: string;
  title: string;
  periodLabel: string;
  showSimulatedTarget?: boolean; 
  previuos_quarter_actual: number;
  previuos_quarter_target: number;
}

const formatValue = (value: number) => {
  if (value === undefined || value === null || isNaN(value)) return 'NA';
  if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
  return value.toString();
};

function getPreviousQuarter(quarterStr: string) {
  const match = quarterStr.match(/Q([1-4]) (\d{4})/);
  if (!match) return quarterStr;
  let q = parseInt(match[1], 10);
  let year = parseInt(match[2], 10);
  if (q === 1) {
    q = 4;
    year -= 1;
  } else {
    q -= 1;
  }
  return `Q${q} ${year}`;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  actualValue,
  targetValue,
  overallValue,
  newTarget,
  metric,
  period,
  title,
  periodLabel,
  showSimulatedTarget = true,
  previuos_quarter_actual,
  previuos_quarter_target
}) => {
  const [formattedActual, setFormattedActual] = useState('');
  const [formattedTarget, setFormattedTarget] = useState('');
  const [formattedNewTarget, setFormattedNewTarget] = useState('');
  const [formattedMax, setFormattedMax] = useState('');
  const [achievementStatus, setAchievementStatus] = useState('');
  const [statusColor, setStatusColor] = useState('#ef4444');
  const previousQuarterLabel = getPreviousQuarter(period);

  // Ensure we have valid values to work with
  const safeActual = isNaN(actualValue) || actualValue < 0 ? 0 : actualValue;
  const safeTarget = isNaN(targetValue) || targetValue <= 0 ? 1 : targetValue;
  const safeNewTarget = isNaN(newTarget) || newTarget <= 0 ? 1 : newTarget;
  const safeOverall = isNaN(overallValue) || overallValue <= 0 ? 1 : overallValue;
  const maxValue = Math.max(safeActual, safeTarget, safeOverall);
  const safe_previuos_quarter_actual = isNaN(previuos_quarter_actual) || previuos_quarter_actual <= 0 ? 1 : previuos_quarter_actual;
  const QoQ_growth = ((safeActual - safe_previuos_quarter_actual) / safe_previuos_quarter_actual) * 100;
  const safe_previuos_quarter_target = isNaN(previuos_quarter_target) || previuos_quarter_target <= 0 ? 1 : previuos_quarter_target;
  const QoQ_growth_target = ((safeActual - safe_previuos_quarter_target) / safe_previuos_quarter_target) * 100;

  useEffect(() => {
    setFormattedActual(formatValue(safeActual));
    setFormattedTarget(formatValue(safeTarget));
    setFormattedNewTarget(formatValue(safeNewTarget));
    setFormattedMax(formatValue(maxValue));
    
    // Calculate achievement percentage
    const percentage = ((safeTarget - safeActual) / safeTarget) * 100;
    setAchievementStatus(`${Math.round(percentage)}%`);
    const percentage_for_gauge = ((safeActual) / safeNewTarget) * 100;
    
    // Set color based on achievement percentage
    if (percentage_for_gauge >= 100) {
      setStatusColor('#10b981'); // green
    } else if (percentage_for_gauge >= 90) {
      setStatusColor('#f59e0b'); // yellow
    } else {
      setStatusColor('#ef4444'); // red
    }
  }, [safeActual, safeTarget, safeNewTarget, maxValue]);

  // Calculate angles for the arc
  const angleFromValue = (value: number): number => {
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
  const radius = 78;
  const strokeWidth = 18;
  const simulatedAchievement = ((safeNewTarget - safeActual) / safeNewTarget) * 100;
  const simulatedArrowUp = simulatedAchievement >= 100;
  const simulatedArrowColor = simulatedArrowUp ? "#10b981" : "#ef4444";
  const simulatedAchievementStatus = `${Math.round(simulatedAchievement)}%`;

  const actualAngle = angleFromValue(safeActual);
  const targetAngle = angleFromValue(safeTarget);
  const newTargetAngle = angleFromValue(safeNewTarget);

  const targetPos = polarToCartesian(centerX, centerY, radius, targetAngle);
  const newTargetPos = polarToCartesian(centerX, centerY, radius, newTargetAngle);

  return (
    <div className="flex flex-col items-center ">
      <div className="flex items-center gap-1 mb-1">
        <h3 className="px-4 py-3 text-sm font-medium bg-gray-50 ">{title}</h3>
        <span className="relative group" style={{ cursor: 'pointer' }}>
          <svg
            className="w-4 h-4 text-gray-400 inline-block"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <circle cx="10" cy="10" r="10" />
            <text x="10" y="15" textAnchor="middle" fontSize="12" fill="white">i</text>
          </svg>
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 p-2 text-xs bg-gray-700 text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
            Realistic EBITDA estimate is based on the most realistic, risk-adjusted view across verticals — taking the minimum of target or business potential per business unit.
          </div>
        </span>
      </div>

      <svg width="220" height="130" viewBox="0 0 200 130">
        {/* Background Arc */}
        <path
          d={describeArc(centerX, centerY, radius, 0, 180)}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Actual Value Arc - Color based on achievement percentage */}
        <path
          d={describeArc(centerX, centerY, radius, 0, actualAngle)}
          stroke={statusColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* Simulated Target Marker - Only if showSimulatedTarget */}
        {showSimulatedTarget && (
          <>
            <circle 
              cx={newTargetPos.x} 
              cy={newTargetPos.y} 
              r="5" 
              fill="#8b5cf6"
            />
            <line
              x1={newTargetPos.x}
              y1={newTargetPos.y}
              x2={newTargetPos.x}
              y2={newTargetPos.y - 15}
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeDasharray="4,2"
            />
          </>
        )}

        {/* Target Marker (Predefined Target) - Rendered after simulated so it's on top */}
        <circle 
          cx={targetPos.x} 
          cy={targetPos.y} 
          r="5" 
          fill="#3b82f6"
        />
        <line
          x1={targetPos.x}
          y1={targetPos.y}
          x2={targetPos.x}
          y2={targetPos.y - 15}
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="2,1"
        />

        {/* Labels: 0, Max */}
        <text x="20" y="123" fontSize="11" fontWeight="medium">0</text>
        <text x="180" y="123" fontSize="11" fontWeight="medium" textAnchor="end"> Q4 Target: {formattedMax}</text>
        
        {/* Target Value Label */}
        <text 
          x={targetPos.x} 
          y={targetPos.y - 18} 
          fontSize="11" 
          textAnchor="middle" 
          fill="#3b82f6"
          fontWeight="medium"
        >
          {formattedTarget}
        </text>

        {/* New Target Value Label - Only if showSimulatedTarget */}
        {showSimulatedTarget && (
          <text 
            x={newTargetPos.x} 
            y={newTargetPos.y - 18} 
            fontSize="11" 
            textAnchor="middle" 
            fill="#8b5cf6"
            fontWeight="medium"
          >
            {formattedNewTarget}
          </text>
        )}

        {/* Center Actual with improved styling */}
        <text x="100" y="92" textAnchor="middle" fontSize="26" fontWeight="bold">
          {formattedActual}
        </text>
      </svg>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full max-w-md">
        {/* Left column */}
<div className="text-sm font-medium text-gray-800 flex items-center gap-2">
  vs Predefined Target: 
  <span
    style={{ color: safeActual >= safeTarget ? "#10b981" : "#ef4444" }}
    className="flex items-center gap-1"
  >
    {Math.abs(Number(achievementStatus.replace('%', ''))).toFixed(0)}%
    {safeActual >= safeTarget ? (
      <span style={{ color: "#10b981" }}>&uarr;</span>
    ) : (
      <span style={{ color: "#ef4444" }}>&darr;</span>
    )}
  </span>
</div>
        <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
          vs {previousQuarterLabel} Actual: 
          <span style={{ color: QoQ_growth > 0 ? "#10b981" : "#ef4444" }} className="flex items-center gap-1">
            {Math.abs(QoQ_growth).toFixed(0)}%
            {QoQ_growth > 0 ? (
              <span style={{color: "#10b981"}}>&uarr;</span>
            ) : (
              <span style={{color: "#ef4444"}}>&darr;</span>
            )}
          </span>
        </div>
        {/* Right column */}
{showSimulatedTarget ? (
  <div className="text-sm font-medium text-gray-800 flex items-center gap-2 min-h-[24px]">
    vs Simulated Target: 
    <span
      style={{ color: simulatedArrowUp ? "#10b981" : "#ef4444" }}
      className="flex items-center gap-1"
    >
      {Math.abs(Number(simulatedAchievementStatus.replace('%', ''))).toFixed(0)}%
      {simulatedArrowUp ? (
        <span style={{ color: "#10b981" }}>&uarr;</span>
      ) : (
        <span style={{ color: "#ef4444" }}>&darr;</span>
      )}
    </span>
  </div>
) : (
  <div className="min-h-[24px]">&nbsp;</div>
)}
        <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
          vs {previousQuarterLabel} Target: 
          <span style={{ color: QoQ_growth_target > 0 ? "#10b981" : "#ef4444" }} className="flex items-center gap-1">
            {Math.abs(QoQ_growth_target).toFixed(0)}%
            {QoQ_growth_target > 0 ? (
              <span style={{color: "#10b981"}}>&uarr;</span>
            ) : (
              <span style={{color: "#ef4444"}}>&darr;</span>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-2 mt-4 text-xs w-full max-w-md">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
          <span>Predefined Target {metric} for {periodLabel}</span>
        </div>
        {showSimulatedTarget && (
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
            <span>Simulated Target {metric} for {periodLabel}</span>
          </div>
        )}
        {/* Legend for status */}
        <div className="flex gap-4 mt-4 text-xs items-center col-span-2">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#10b981" }}></div>
            <span className="whitespace-nowrap">On Target</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#f59e0b" }}></div>
            <span className="whitespace-nowrap">Alert</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ef4444" }}></div>
            <span className="whitespace-nowrap">Off Target</span>
          </div>
          {/* Info icon with tooltip */}
          <span className="relative group ml-2" style={{ cursor: 'pointer' }}>
            <svg
              className="w-4 h-4 text-gray-400 inline-block"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <circle cx="10" cy="10" r="10" />
              <text x="10" y="15" textAnchor="middle" fontSize="12" fill="white">i</text>
            </svg>
            <div
              className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-72 p-2 text-xs bg-gray-700 text-white rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto z-50 transition"
              style={{ minWidth: '220px', textAlign: 'left' }}
            >
              <div>
                <b>Status Calculation:</b><br />
                Status = (Realistic EBITDA Estimate / Predefined Target) × 100
              </div>
              <div className="mt-2">
                <b>On Target:</b> Status &gt;= 100%<br />
                <b>Alert:</b> Status &gt;= 90% and &lt; 100%<br />
                <b>Off Target:</b> Status &lt; 90%
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;