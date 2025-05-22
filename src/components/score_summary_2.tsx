import React from 'react';

interface score_summary_2Props {
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

const score_summary_2 = ({
  scorePercent,
  targetsRatio,
  targetDiff,
  actual_target,
  metric,
  period,
  previuos_quarter_target,
  previuos_quarter_actual
}: score_summary_2Props) => {
  // Safe values for calculations
  const safeActual = isNaN(scorePercent) || scorePercent < 0 ? 0 : scorePercent;
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
          Simulated {metric} Target {period}: <span className="text-[14px] font-bold text-gray-800">{formatValue(safeActual)}</span>
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

export default score_summary_2;