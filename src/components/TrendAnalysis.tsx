// import React from 'react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend
// } from 'recharts';

// interface TrendAnalysisProps {
//   title: string;
//   quarters: string[];
//   actualValues: number[];
//   targetValues: number[];
// }

// const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
//   title,
//   quarters,
//   actualValues,
//   targetValues
// }) => {
//   // Format value function
//   const formatValue = (value) => {
//     if (value === null || value === undefined || value === '' || value === 'NA') {
//       return 'NA';
//     }
    
//     if (typeof value === 'number') {
//       if (value >= 1000000000) {
//         return (value / 1000000000).toFixed(1) + 'B';
//       } else if (value >= 1000000) {
//         return (value / 1000000).toFixed(1) + 'M';
//       } else if (value >= 1000) {
//         return (value / 1000).toFixed(1) + 'K';
//       } else {
//         return value.toFixed(1);
//       }
//     }
    
//     return value;
//   };

//   // Prepare data for recharts
//   const data = quarters.map((quarter, index) => ({
//     quarter,
//     actual: actualValues[index],
//     target: targetValues[index]
//   }));
  
//   return (
//     <div className="flex flex-col h-full">
//       <h3 className="mb-2 text-sm font-medium">{title}</h3>
//       <div className="flex-1 min-h-180">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             data={data}
//             margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//             <XAxis
//               dataKey="quarter"
//               tick={{ fontSize: 10 }}
//               tickLine={false}
//             />
//             <YAxis
//               tick={{ fontSize: 10 }}
//               tickLine={false}
//               width={25}
//               tickFormatter={formatValue}
//             />
//             <Tooltip 
//               formatter={(value, name) => [formatValue(value), name]}
//               labelFormatter={(label) => `Quarter: ${label}`}
//             />
//             <Legend
//               align="right"
//               verticalAlign="top"
//               iconType="circle"
//               iconSize={8}
//               wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }}
//             />
//             <Line
//               type="linear"
//               dataKey="actual"
//               stroke="#3182ce"
//               strokeWidth={2}
//               dot={{ r: 3 }}
//               activeDot={{ r: 6 }}
//               name="Actual"
//             />
//             <Line
//               type="monotone"
//               dataKey="target"
//               stroke="#9e38a1"
//               strokeWidth={2}
//               dot={{ r: 3 }}
//               activeDot={{ r: 6 }}
//               name="Target"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default TrendAnalysis;
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface TrendAnalysisProps {
  title: string;
  quarters: string[];
  actualValues: number[];
  targetValues: number[];
  industryValues?: number[];
  simulatedTargetValues?: number[];
  simulatedActualValues?: number[];
  simulatedIndustryValues?: number[];
  selectedQuarter?: string;

}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  title,
  quarters,
  actualValues,
  targetValues,
  industryValues = [],
  simulatedTargetValues = [],
  simulatedActualValues = [],
  simulatedIndustryValues = [],
   selectedQuarter
}) => {
  // Define all quarters till Q4 2025
  const allQuarters = [
    "Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024",
    "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"
  ];
  
  // Format value function
  const formatValue = (value: number) => {
    if (value === null || value === undefined || value === '' || value === 'NA') {
      return 'NA';
    }
    if (typeof value === 'number') {
      if (value >= 1000000000) {
        return (value / 1000000000).toFixed(0) + 'B';
      } else if (value >= 1000000) {
        return (value / 1000000).toFixed(0) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(0) + 'K';
      } else {
        return value.toFixed(0);
      }
    }
    return value;
  };
  
  // Merge your data into the fixed quarters array
  const data = allQuarters.map((quarter) => {
  const idx = quarters.indexOf(quarter);
  const isQ22025 = quarter === "Q2 2025";
  const dataPoint: any = {
    quarter,
    actual: isQ22025
      ? null
      : idx !== -1 && actualValues[idx] != null
      ? actualValues[idx]
      : null,
    target: idx !== -1 && targetValues[idx] != null ? targetValues[idx] : 0,
  };
  if (industryValues.length > 0) {
    dataPoint.industry = isQ22025
      ? null
      : idx !== -1 && industryValues[idx] != null
      ? industryValues[idx]
      : null;
  }
  // Only show simulatedActual for Q1 2025 and Q2 2025
  if (
    simulatedActualValues.length > 0 &&
    (quarter === "Q1 2025" || quarter === "Q2 2025")
  ) {
    dataPoint.simulatedActual =
      idx !== -1 && simulatedActualValues[idx] != null
        ? simulatedActualValues[idx]
        : null;
  } else {
    dataPoint.simulatedActual = null;
  }
  // Only show simulatedTarget for Q1 2025 and Q2 2025
  if (
    simulatedTargetValues.length > 0 &&
    (quarter === "Q1 2025" || quarter === "Q2 2025")
  ) {
    dataPoint.simulatedTarget =
      idx !== -1 && simulatedTargetValues[idx] != null
        ? simulatedTargetValues[idx]
        : null;
  } else {
    dataPoint.simulatedTarget = null;
  }
  // Only show simulatedIndustry for Q1 2025 and Q2 2025
  if (
    simulatedIndustryValues &&
    simulatedIndustryValues.length > 0 &&
    (quarter === "Q1 2025" || quarter === "Q2 2025")
  ) {
    dataPoint.simulatedIndustry =
      idx !== -1 && simulatedIndustryValues[idx] != null
        ? simulatedIndustryValues[idx]
        : null;
  } else {
    dataPoint.simulatedIndustry = null;
  }
  return dataPoint;
});
 let filteredData = data;
  if (selectedQuarter) {
    const selectedIdx = allQuarters.indexOf(selectedQuarter);
    if (selectedIdx !== -1) {
      filteredData = data.slice(0, selectedIdx + 1);
    }
  }
  
  return (
    <div className="flex flex-col h-full  overflow-hidden">
      <h3 className="px-4 py-3 text-sm font-medium bg-gray-50 ">{title}</h3>
      <div className="flex-1 p-4 ">
        <ResponsiveContainer width={430} height={260}>
          <LineChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis
              dataKey="quarter"
              type="category"
              interval={0}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              dy={10}
              padding={{ right: 20 }}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              width={30}
              axisLine={{ stroke: '#e2e8f0' }}
              tickFormatter={formatValue}
            />
            <Tooltip 
              formatter={(value, name) => [formatValue(value as number), name]}
              labelFormatter={(label) => `Quarter: ${label}`}
              contentStyle={{ 
                borderRadius: '4px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            />
            {/* <Legend
              align="right"
              verticalAlign="top"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ 
                fontSize: '9px', 
                paddingBottom: '5px',
                paddingTop: '5px'
              }}
            /> */}
         <Line
  type="linear"
  dataKey="actual"
  stroke="#3182ce"
  strokeWidth={2}
  dot={{ r: 3, strokeWidth: 1, fill: '#fff' }}
  activeDot={{ r: 6 }}
  name="Actual"
/>
<Line
  type="linear"
  dataKey="target"
  stroke="#9e38a1"
  strokeWidth={2}
  dot={{ r: 3, strokeWidth: 1, fill: '#fff' }}
  activeDot={{ r: 6 }}
  name="Predefined Target"
/>
{industryValues.length > 0 && (
  <Line
    type="linear"
    dataKey="industry"
    stroke="#64748b"
    strokeWidth={2}
    dot={{ r: 3, strokeWidth: 1, fill: '#fff' }}
    activeDot={{ r: 6 }}
    name="Industry Average"
  />
)}
{simulatedActualValues.length > 0 && (
  <Line
    type="linear"
    dataKey="simulatedActual"
    stroke="#06b6d4"
    strokeDasharray="5 3"
    strokeWidth={2}
    dot={{ r: 3, strokeWidth: 1, fill: '#06b6d4' }}
    activeDot={{ r: 6 }}
    name="Projected Actual"
  />
)}
{simulatedTargetValues.length > 0 && (
  <Line
    type="linear"
    dataKey="simulatedTarget"
    stroke="#a855f7"
    strokeDasharray="5 3"
    strokeWidth={2}
    dot={{ r: 3, strokeWidth: 1, fill: '#a855f7' }}
    activeDot={{ r: 6 }}
    name="Simulated Target"
  />
)}
{simulatedIndustryValues && simulatedIndustryValues.length > 0 && (
  <Line
    type="linear"
    dataKey="simulatedIndustry"
    stroke="#6366f1"
    strokeDasharray="5 3"
    strokeWidth={2}
    dot={{ r: 3, strokeWidth: 1, fill: '#6366f1' }}
    activeDot={{ r: 6 }}
    name="Projected Industry Average"
  />
)}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendAnalysis;