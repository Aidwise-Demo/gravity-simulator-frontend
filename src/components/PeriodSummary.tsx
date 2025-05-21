import React from "react";

interface PeriodSummaryProps {
  period: string;
  metric: string;
  actualValue: number;
  targetValue: number;
  simulatedTarget: number;
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
}) => {
  // Calculations
  const safeActual = isNaN(actualValue) || actualValue < 0 ? 0 : actualValue;
  const safeTarget = isNaN(targetValue) || targetValue <= 0 ? 1 : targetValue;
  const safeSimTarget = isNaN(simulatedTarget) || simulatedTarget <= 0 ? 1 : simulatedTarget;

  const vsPredefinedTarget = ((safeActual-safeTarget )/ safeTarget) * 100;
  const vsSimulatedTarget = ((safeActual-safeSimTarget )/ safeSimTarget) * 100 ;

  return (
    <div className="rounded-lg  pr-1 flex flex-col gap-2 ">
      {/* <div className="text-sm text-gray-500 font-medium mb-1">{period} {metric} Summary</div> */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">{period} Business Potential:  </span>
          <span className="font-semibold">  ‎ {formatValue(safeActual)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">vs Predefined Target:</span>
          <span
            className={`font-semibold ${
              vsPredefinedTarget >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {vsPredefinedTarget >= 0 ? "+" : ""}
            {vsPredefinedTarget.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">vs Simulated Target:</span>
          <span
            className={`font-semibold ${
              vsSimulatedTarget >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {vsSimulatedTarget >= 0 ? "+" : ""}
            {vsSimulatedTarget.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PeriodSummary;