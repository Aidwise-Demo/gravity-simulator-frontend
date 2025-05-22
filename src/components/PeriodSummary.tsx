import React from "react";
import { FaInfoCircle } from "react-icons/fa";

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

  const vsSimulatedTarget = ((safeActual - safeSimTarget) / safeSimTarget) * 100;
  const vsIndustryAverage =
    safeIndustryAvg !== undefined && safeIndustryAvg !== 0
      ? ((safeActual - safeIndustryAvg) / safeIndustryAvg) * 100
      : undefined;

  return (
    <div className="rounded-lg pr-1 flex flex-row items-center gap-2">
      <span className="text-[10px] text-gray-600">
        {period} Business Potential: <span className="text-[10px] text-gray-600">{formatValue(safeActual)}</span>
      </span>
      <span className="text-[10px] text-gray-400 px-1">|</span>
      <span className="text-[10px] text-gray-600">
        vs Target: <span className="text-[10px] text-gray-600">{vsSimulatedTarget >= 0 ? "+" : ""}{vsSimulatedTarget.toFixed(1)}%</span>
      </span>
      {safeIndustryAvg !== undefined && (
        <>
          <span className="text-[10px] text-gray-400 px-1">|</span>
          <span className="text-[10px] text-gray-600">
            vs Projected Industry Avg: <span className="text-[10px] text-gray-600">
              {vsIndustryAverage !== undefined && (vsIndustryAverage >= 0 ? "+" : "")}
              {vsIndustryAverage !== undefined ? vsIndustryAverage.toFixed(1) : "NA"}%
            </span>
          </span>
        </>
      )}
      <div className="relative group ml-1">
        <FaInfoCircle className="text-gray-400 text-[10px] cursor-pointer" />
        <div className="absolute left-4 top-1 z-10 hidden group-hover:block bg-white border border-gray-300 rounded shadow-lg p-2 w-64 text-[10px] text-gray-700">
          <div className="mb-2">
            <strong>Business Potential:</strong> The actual value achieved for the selected period.
          </div>
          <div className="mb-2">
            <strong>vs Target:</strong> Percentage difference between actual value and the simulated target.
          </div>
          <div>
            <strong>vs Projected Industry Avg:</strong> Percentage difference between actual value and projected industry average.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodSummary;