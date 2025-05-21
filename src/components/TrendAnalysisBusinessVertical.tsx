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

interface TrendAnalysisBusinessVerticalProps {
  title?: string;
  quarters: string[];
  actualValues: number[] | Record<string, number[]>;
  targetValues?: number[] | Record<string, number[]>;
  industryValues?: number[] | Record<string, number[]>;
  simulatedTargetValues?: number[] | Record<string, number[]>;
  simulatedActualValues?: number[] | Record<string, number[]>;
  simulatedIndustryValues?: number[] | Record<string, number[]>;
  selectedBusinessVertical?: string;
}

const COLORS = [
  '#3182ce', '#9e38a1', '#64748b', '#eab308', '#ef4444', '#14b8a6', '#6366f1', '#f59e42'
];

const formatValue = (value: any) => {
  if (value === null || value === undefined || value === '' || value === 'NA') {
    return 'NA';
  }
  if (typeof value === 'number') {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';
    return value.toFixed(1);
  }
  return value;
};

const TrendAnalysisBusinessVertical: React.FC<TrendAnalysisBusinessVerticalProps> = ({
  title = '',
  quarters,
  actualValues,
  targetValues,
  industryValues,
  simulatedTargetValues,
  simulatedActualValues,
  simulatedIndustryValues,
  selectedBusinessVertical
}) => {
  // Helper to sanitize arrays
  const sanitizeArray = (arr: any[] = []) =>
    arr.map((v) => (typeof v === "number" && isFinite(v) ? v : null));

  // If actualValues is an object, render multi-line chart (All Verticals)
  const isAllVerticals = typeof actualValues === 'object' && !Array.isArray(actualValues);

  let data: any[] = [];
  let verticalKeys: string[] = [];

  if (isAllVerticals) {
    verticalKeys = Object.keys(actualValues as Record<string, number[]>);
    data = quarters.map((quarter, idx) => {
      const point: any = { quarter };
      verticalKeys.forEach(key => {
        point[key] = sanitizeArray((actualValues as Record<string, number[]>)[key])[idx];
      });
      return point;
    });
  } else {
    // Single vertical
    data = quarters.map((quarter, idx) => ({
      quarter,
      actual: sanitizeArray(actualValues as number[])[idx],
      target: targetValues ? sanitizeArray(targetValues as number[])[idx] : null,
      industry: industryValues ? sanitizeArray(industryValues as number[])[idx] : null,
      simulatedTarget: simulatedTargetValues ? sanitizeArray(simulatedTargetValues as number[])[idx] : null,
      simulatedActual: simulatedActualValues ? sanitizeArray(simulatedActualValues as number[])[idx] : null,
      simulatedIndustry: simulatedIndustryValues ? sanitizeArray(simulatedIndustryValues as number[])[idx] : null,
    }));
  }

  return (
    <div className="flex flex-col h-full w-full">
      {title && <h3 className="mb-2 text-sm font-medium">{title}</h3>}
      <div className="flex-1 min-h-180">
        <ResponsiveContainer width="100%" height={260}>
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
              tickFormatter={formatValue}
              tick={{ fontSize: 10 }}
              tickLine={false}
              width={60}
            />
            <Tooltip formatter={formatValue} />
            <Legend />
            {isAllVerticals ? (
              verticalKeys.map((key, i) => (
                <Line
                  key={key}
                  type="linear"
                  dataKey={key}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 1, fill: '#fff' }}
                  activeDot={{ r: 6 }}
                  name={key}
                  connectNulls
                />
              ))
            ) : (
              <>
                <Line
                  type="linear"
                  dataKey="actual"
                  stroke="#3182ce"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 1, fill: '#fff' }}
                  activeDot={{ r: 6 }}
                  name="Actual"
                  connectNulls
                />
                {targetValues && (
                  <Line
                    type="linear"
                    dataKey="target"
                    stroke="#9e38a1"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1, fill: '#fff' }}
                    activeDot={{ r: 6 }}
                    name="Target"
                    connectNulls
                  />
                )}
                {industryValues && (
                  <Line
                    type="linear"
                    dataKey="industry"
                    stroke="#64748b"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1, fill: '#fff' }}
                    activeDot={{ r: 6 }}
                    name="Industry"
                    connectNulls
                  />
                )}
                {simulatedTargetValues && (
                  <Line
                    type="linear"
                    dataKey="simulatedTarget"
                    stroke="#eab308"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Simulated Target"
                    connectNulls
                  />
                )}
                {simulatedActualValues && (
                  <Line
                    type="linear"
                    dataKey="simulatedActual"
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Simulated Actual"
                    connectNulls
                  />
                )}
                {simulatedIndustryValues && (
                  <Line
                    type="linear"
                    dataKey="simulatedIndustry"
                    stroke="#14b8a6"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Simulated Industry"
                    connectNulls
                  />
                )}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendAnalysisBusinessVertical;