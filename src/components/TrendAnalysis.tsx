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
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  title,
  quarters,
  actualValues,
  targetValues
}) => {
  // Format value function
  const formatValue = (value) => {
    if (value === null || value === undefined || value === '' || value === 'NA') {
      return 'NA';
    }
    
    if (typeof value === 'number') {
      if (value >= 1000000000) {
        return (value / 1000000000).toFixed(1) + 'B';
      } else if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      } else {
        return value.toFixed(1);
      }
    }
    
    return value;
  };

  // Prepare data for recharts
  const data = quarters.map((quarter, index) => ({
    quarter,
    actual: actualValues[index],
    target: targetValues[index]
  }));
  
  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-2 text-sm font-medium">{title}</h3>
      <div className="flex-1 min-h-180">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis
              dataKey="quarter"
              tick={{ fontSize: 10 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              width={25}
              tickFormatter={formatValue}
            />
            <Tooltip 
              formatter={(value, name) => [formatValue(value), name]}
              labelFormatter={(label) => `Quarter: ${label}`}
            />
            <Legend
              align="right"
              verticalAlign="top"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#3182ce"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#38a169"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendAnalysis;