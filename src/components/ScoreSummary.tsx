// import React from 'react';

// interface ScoreSummaryProps {
//   scorePercent: number;
//   targetsRatio: string;
//   targetDiff: number;
//   actual_target: number;
//   metric: string;
//   period: string;
// }

// // Format function for number values
// const formatValue = (value: number) => {
//   if (value === null || value === undefined || isNaN(value)) {
//     return 'NA';
//   }
//   if (value >= 1_000_000_000) {
//     return (value / 1_000_000_000).toFixed(1) + 'B';
//   } else if (value >= 1_000_000) {
//     return (value / 1_000_000).toFixed(1) + 'M';
//   } else if (value >= 1_000) {
//     return (value / 1_000).toFixed(1) + 'K';
//   } else {
//     return value.toFixed(1);
//   }
// };

// const InfoIcon = ({ tooltip }: { tooltip: string }) => (
//   <span className="group relative inline-block ml-1 align-middle cursor-pointer">
//     <svg
//       className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors duration-200 inline"
//       fill="currentColor"
//       viewBox="0 0 20 20"
//     >
//       <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v2H9v-2zm0-8h2v6H9V5z" />
//     </svg>
//     <span className="absolute right-0 left-auto mt-2 w-max max-w-xs p-2 text-xs bg-gray-800 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-pre-wrap">
//       {tooltip}
//     </span>
//   </span>
// );

// const ScoreSummary = ({
//   scorePercent,
//   targetsRatio,
//   targetDiff,
//   actual_target,
//   metric,
//   period
// }: ScoreSummaryProps) => {
//   const formattedScore = formatValue(scorePercent);
//   const formattedTargetDiff = formatValue(Math.abs(targetDiff));
//   const isPositive = actual_target - scorePercent >= 0;

//   return (
//   <div className="p-2 rounded-xl bg-white">
//     <h3 className="text-m font-semibold text-gray-800 mb-1">{metric} Target Overview {period}</h3>
    
//     <div className="mb-1 pb-4 ">
//       <div className="flex items-center justify-between mb-2">
//         <span className="text-sm font-medium text-gray-600">Predefined Target:</span>
//         <div className="flex items-center">
//           <span className="font-bold text-gray-800">{formatValue(actual_target)}</span>
//           <InfoIcon tooltip="Projected target set for the current period." />
//         </div>
//       </div>
      
//       {formatValue(actual_target) !== formattedScore && (
//         <>
//           <div className="flex items-center justify-between mb-1">
//             <span className="text-sm font-medium text-gray-600">Simulated Target:</span>
//             <div className="flex items-center">
//               <span className="font-bold text-gray-800">{formattedScore}</span>
//               <InfoIcon tooltip="Value set by the simulator (slider)." />
//             </div>
//           </div>
//           <div className={`text-sm text-right ${isPositive ? 'text-red-600' : 'text-green-600'} flex items-center justify-end`}>
//             <span>{isPositive ? '↓' : '↑'}</span>
//             <span className="ml-1">{formattedTargetDiff}% vs Predefined</span>
//           </div>
//         </>
//       )}
//     </div>
    
//     <div className="text-center">
//       <div className="mb-2">
//         <div className="text-3xl font-bold text-blue-600">{targetsRatio}</div>
//         <div className="text-sm font-medium text-gray-600 mt-1">Business verticals</div>
//       </div>
//       <div className="mt-3 py-2 px-3 bg-red-50 rounded-lg">
//         <div className="text-sm font-semibold text-red-700">Face High Target Achievement Risk</div>
//       </div>
//     </div>
//   </div>
// );
// }
// export default ScoreSummary;

import React from 'react';

interface ScoreSummaryProps {
  scorePercent: number;
  targetsRatio: string;
  targetDiff: number;
  actual_target: number;
  metric: string;
  period: string;
  previuos_quarter_target: number;
  previuos_quarter_actual: number;
}

// Format function for number values
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
    return value.toFixed(2);
  }
};

function getPreviousQuarterLabel(period: string) {
  const match = period.match(/Q([1-4]) (\d{4})/);
  if (!match) return "Prev Q";
  let quarter = parseInt(match[1], 10);
  let year = parseInt(match[2], 10);
  if (quarter === 1) {
    quarter = 4;
    year -= 1;
  } else {
    quarter -= 1;
  }
  return `Q${quarter} ${year}`;
}

const ScoreSummary = ({
  scorePercent,
  targetsRatio,
  targetDiff,
  actual_target,
  metric,
  period,
  previuos_quarter_target,
  previuos_quarter_actual
}: ScoreSummaryProps) => {
  // Safe values for calculations
  const safeActual = isNaN(actual_target) || actual_target < 0 ? 0 : actual_target;
  const safePrevActual = isNaN(previuos_quarter_actual) || previuos_quarter_actual <= 0 ? 1 : previuos_quarter_actual;
  const safePrevTarget = isNaN(previuos_quarter_target) || previuos_quarter_target <= 0 ? 1 : previuos_quarter_target;

  // QoQ growth calculations
  const QoQ_growth_target = ((safeActual - safePrevTarget) / safePrevTarget) * 100;
  const QoQ_growth_actual = ((safeActual - safePrevActual) / safePrevActual) * 100;

  const prevQuarterLabel = getPreviousQuarterLabel(period);

  // Helper for sign
  const formatWithSign = (val: number) =>
    (val > 0 ? "+" : "") + val.toFixed(1) + "%";

  return (
    <div className="p-2 rounded-xl bg-white flex flex-col min-h-[56px]">
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-2">
        <h3 className="text-[14px] font-semibold text-gray-800">
          {metric} Target {period}: <span className="text-[14px] font-bold text-gray-800">{formatValue(actual_target)}</span>
        </h3>
        <div className="text-xs font-medium text-gray-600">
          <span className="text-xl font-bold text-black-600">{targetsRatio} ‎ ‎ </span> Business verticals
        </div>
      </div>
      {/* Two column layout */}
      <div className="flex flex-row items-center justify-between flex-1">
        {/* Left: QoQ info in one line, xs size for all */}
        <div className="flex flex-row items-center gap-4">
          <span className="text-xs font-medium text-gray-600">
            vs {prevQuarterLabel} Target:{" "}
            <span className="text-xs font-bold">
              {formatWithSign(QoQ_growth_target)}
            </span>
          </span>
          <span className="text-xs font-medium text-gray-600">
            vs {prevQuarterLabel} Actual:{" "}
            <span className="text-xs font-bold">
              {formatWithSign(QoQ_growth_actual)}
            </span>
          </span>
        </div>
        {/* Right: Risk info */}
        <div className="flex flex-col items-end">
          <div className="mt-1 py-1 px-2 bg-red-50 rounded-lg">
            <div className="text-xs font-semibold text-red-700">Face High Target Achievement Risk</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreSummary;