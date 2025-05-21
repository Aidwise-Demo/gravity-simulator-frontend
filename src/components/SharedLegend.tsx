import React from "react";

const RISK_COLORS = {
  "Low-Risk": "rgba(34,197,94,0.12)",      // green (same as TrendAnalysis)
  "Medium-Risk": "rgba(217, 186, 32, 0.49)", // yellow (same as TrendAnalysis)
  "High-Risk": "rgba(239, 68, 68, 0.29)", // red (same as TrendAnalysis)
};

const SharedLegend = () => (
  <div className="flex flex-wrap gap-4 justify-end py-2 pr-5 border-t border-gray-200 bg-gray-50">
    <LegendItem color="#3182ce" label="Actual" />
    <LegendItem color="#3182ce" label="Business Potential" dashed />
    <LegendItem color="#9e38a1" label="Predefined Target" />
    <LegendItem color="#9e38a1" label="Simulated Target" dashed />
    <LegendItem color="#64748b" label="Industry Average" />
    <LegendItem color="#64748b" label="Projected Industry Average" dashed />
    {/* Risk Legends */}
    <RiskLegend color={RISK_COLORS["Low-Risk"]} label="Low-Risk" />
    <RiskLegend color={RISK_COLORS["Medium-Risk"]} label="Medium-Risk" />
    <RiskLegend color={RISK_COLORS["High-Risk"]} label="High-Risk" />
  </div>
);

const LegendItem = ({ color, label, dashed = false }) => (
  <div className="flex items-center gap-1">
    <svg width="24" height="6">
      <line
        x1="0"
        y1="3"
        x2="24"
        y2="3"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={dashed ? "6 4" : "0"}
      />
    </svg>
    <span className="text-xs">{label}</span>
  </div>
);

const RiskLegend = ({ color, label }) => (
  <div className="flex items-center gap-1">
    <span
      className="inline-block rounded-sm"
      style={{
        width: 12,
        height: 12,
        background: color,
        border: "1px solid #d1d5db",
        marginRight: 4,
      }}
    />
    <span className="text-xs">{label}</span>
  </div>
);

export default SharedLegend;