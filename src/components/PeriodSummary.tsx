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
              <div>
              <strong>Business Potential</strong>: Adjusted Projected Value for the Selected Period (based on Ongoing Initiatives):<br />
              Baseline Projection × (1 + (0.25 + factor) × factor_based_on_time_left × (0.25 + total_initiative_score))<br />
              <br />
              <strong>Where:</strong><br />
              <strong>factor</strong>: Proportion of initiatives that are currently on track<br />
              <strong>factor_based_on_time_left</strong>: Proportion of time remaining in the current year<br />
              <strong>total_initiative_score</strong>: Normalized value representing the number of ongoing initiatives, calculated as the number of initiatives for the business vertical divided by the maximum number of initiatives
            </div>
          <div className="mb-2">
            <strong>vs Target:</strong> Percentage difference between Previous quarter target value and the simulated target.By defualt it will show the percentage difference between the Previous quarter target value and the predefiend target.
          </div>
          <div>
            <strong>vs Projected Industry Avg:</strong> Percentage difference between simulated target and projected industry average.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodSummary;