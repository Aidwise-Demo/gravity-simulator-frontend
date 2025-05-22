import React from "react";

interface PeriodSummaryProps {
  period: string;
  metric: string;
  actualValue: number;
  targetValue: number;
  simulatedTarget: number;
  industryAverage?: number;
}

const formatValue = (value: number) => {
  if (value === undefined || value === null || isNaN(value)) return "NA";
  if (value >= 1e9) return (value / 1e9).toFixed(2) + "B";
  if (value >= 1e6) return (value / 1e6).toFixed(2) + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(2) + "K";
  return value.toString();
};

const PeriodSummary: React.FC<PeriodSummaryProps> = ({
  period,
  metric,
  actualValue,
  targetValue,
  simulatedTarget,
  industryAverage
}) => {
  // Calculations
  const safeActual = isNaN(actualValue) || actualValue < 0 ? 0 : actualValue;
  const safeTarget = isNaN(targetValue) || targetValue <= 0 ? 1 : targetValue;
  const safeSimTarget = isNaN(simulatedTarget) || simulatedTarget <= 0 ? 1 : simulatedTarget;
  const safeIndustryAvg = industryAverage === undefined || isNaN(industryAverage) ? undefined : industryAverage;

  const vsPredefinedTarget = ((safeActual - safeTarget) / safeTarget) * 100;
  const vsSimulatedTarget = ((safeActual - safeSimTarget) / safeSimTarget) * 100;
  const vsIndustryAverage =
    safeIndustryAvg !== undefined && safeIndustryAvg !== 0
      ? ((safeActual - safeIndustryAvg) / safeIndustryAvg) * 100
      : undefined;

  return (
  <div className="rounded-lg pr-1 flex flex-col gap-2 ">
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-gray-600">{period} Business Potential:  </span>
        <span className="text-[10px] text-gray-600">{formatValue(safeActual)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-gray-600">vs Predefined Target:</span>
        <span className="text-[10px] text-gray-600">
          {vsPredefinedTarget >= 0 ? "+" : ""}
          {vsPredefinedTarget.toFixed(1)}%
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-gray-600">vs Simulated Target:</span>
        <span className="text-[10px] text-gray-600">
          {vsSimulatedTarget >= 0 ? "+" : ""}
          {vsSimulatedTarget.toFixed(1)}%
        </span>
      </div>
      {safeIndustryAvg !== undefined && (
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-600">vs Projected Industry Avg:</span>
          <span className="text-[10px] text-gray-600">
            {vsIndustryAverage !== undefined && (vsIndustryAverage >= 0 ? "+" : "")}
            {vsIndustryAverage !== undefined ? vsIndustryAverage.toFixed(1) : "NA"}%
          </span>
        </div>
      )}
    </div>
  </div>
);
}

export default PeriodSummary;