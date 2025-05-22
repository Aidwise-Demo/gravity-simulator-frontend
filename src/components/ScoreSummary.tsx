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

const ScoreSummary = ({
  scorePercent,
  targetsRatio,
  targetDiff,
  actual_target,
  metric,
  period
}: ScoreSummaryProps) => {
  return (
  <div className="p-2 rounded-xl bg-white flex flex-col min-h-[56px]">
    {/* Header with aligned 3/6 */}
    <div className="flex flex-row items-center justify-between mb-2">
      <h3 className="text-sm font-semibold text-gray-800">
        {metric} Target Overview {period}
      </h3>
      <div className="text-xs font-medium text-gray-600">
        <span className="text-xl font-bold text-black-600">{targetsRatio} ‎ ‎ </span> Business verticals
      </div>
    </div>
    
    {/* Two column layout */}
    <div className="flex flex-row items-center justify-between flex-1">
      {/* Left: 2 lines info */}
      <div className="flex flex-col items-start">
        <span className="text-xs font-medium text-gray-600">
          Predefined Target: <span className="text-lg font-bold text-gray-800">{formatValue(actual_target)}</span>
        </span>
        <div className="text-xs font-medium text-gray-600 mt-1">
          {/* Second line for left side - you can add more info here */}
        </div>
      </div>
      
      {/* Right: 2 lines info */}
      <div className="flex flex-col items-end">
        <div className="mt-1 py-1 px-2 bg-red-50 rounded-lg">
          <div className="text-xs font-semibold text-red-700">Face High Target Achievement Risk</div>
        </div>
        <div className="text-xs font-medium text-gray-600 mt-1">
          {/* Second line for right side - you can add more info here */}
        </div>
      </div>
    </div>
  </div>
);
}

export default ScoreSummary;