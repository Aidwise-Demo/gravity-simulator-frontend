import React from "react";

const POINTER_COLORS = {
  "Predefined Target": "#ec4899", // Tailwind pink-500
  "Simulated Target": "#ec4899",
  "Baseline Projection": "#6366f1", // Tailwind indigo-500
  "Business Potential": "#007cf0", // Tailwind blue-600
  "Projected Industry Average": "#64748b", // Tailwind slate-500
  "cut-off": "#140ddb", // Custom cyan-500
  "Low-Risk": "#22c55e",
  "Medium-Risk": "#eab308",
  "High-Risk": "#ef4444",
};

const TriangleLegend = ({ color, label }) => (
  <div className="flex items-center gap-1">
    {/* Custom lines for Simulated/Predefined Target */}
    {label === "Simulated Target" ? (
      <span
        className="inline-block rounded"
        style={{
          width: 8, // w-2 (0.5rem)
          height: 16, // h-4 (1rem)
          background: color,
        }}
      />
    ) : label === "Predefined Target" ? (
      <span
        className="inline-block rounded"
        style={{
          width: 4, // w-1 (0.25rem)
          height: 16, // h-4 (1rem)
          background: color,
        }}
      />
    ) : (
      <svg className="w-3 h-3" viewBox="0 0 24 24">
        <path d="M12 2L6 14h12z" fill={color} />
      </svg>
    )}
    <span className="text-xs">{label}</span>
  </div>
);

const SharedLegend = () => (
  <div className="flex flex-row w-full justify-between items-center gap-4 py-2 pr-5 border-t border-gray-200 bg-gray-50 rounded-lg">
    {/* Left 40%: Main legend items */}
    <div className="flex flex-wrap gap-3 items-center" style={{ flexBasis: "40%", minWidth: "200px" }}>
      <LegendItem color="#3182ce" label="Actual" />
      <LegendItem color="#3182ce" label="Business Potential" dashed />
      <LegendItem color="#9e38a1" label="Predefined Target" />
      <LegendItem color="#9e38a1" label="Simulated Target" dashed />
      <LegendItem color="#64748b" label="Industry Average" />
      <LegendItem color="#64748b" label="Projected Industry Average" dashed />
    </div>
    {/* Right 60%: Triangle and Risk legends */}
    <div className="flex flex-col items-end w-full" style={{ flexBasis: "60%", minWidth: "200px" }}>
      <div className="flex flex-wrap gap-3 items-center justify-end w-full">
        {/* Triangle legends */}
        <TriangleLegend color={POINTER_COLORS['Predefined Target']} label="Predefined Target" />
        <TriangleLegend color={POINTER_COLORS['Simulated Target']} label="Simulated Target" />
        <TriangleLegend color={POINTER_COLORS['Baseline Projection']} label="Baseline Projection" />
        <TriangleLegend color={POINTER_COLORS['Business Potential']} label="Business Potential" />
        <TriangleLegend color={POINTER_COLORS['Projected Industry Average']} label="Projected Industry Average" />
        <TriangleLegend color={POINTER_COLORS['cut-off']} label="Cut-off" />
      </div>
      <div className="flex flex-wrap gap-3 items-center justify-end w-full mt-2">
        <RiskLegend color="#22c55e" label="Low-Risk" />
        <RiskLegend color="#eab308" label="Medium-Risk" />
        <RiskLegend color="#ef4444" label="High-Risk" />
        {/* Info icon with tooltip */}
        <div className="group relative ml-2 cursor-pointer">
          <svg
            className="w-4 h-4 text-gray-500 hover:text-gray-700"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 9h1v6H9V9zm0-4h1v2H9V5zm1-5C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max max-w-xs p-2 text-xs bg-gray-700 text-white rounded shadow-lg hidden group-hover:block z-50 whitespace-pre-wrap">
            <div><strong>Predefined Target</strong>: Projected target set for the current period.</div>
            <div><strong>Simulated Target</strong>: Value set by the simulator (slider).</div>
            <div><strong>Baseline Value</strong>: Actual performance for the current period.</div>
            <div><strong>Potential Value</strong>: Adjusted or estimated current value.</div>
            <div><strong>Industry Avg.</strong>: Benchmark average across similar companies.</div>
            <div><strong>Cut-off</strong>: Maximum allowed threshold or upper bound for simulation.</div>
            <div><strong>Low/Medium/High Risk</strong>: Risk levels for business verticals, indicated by color.</div>
          </div>
        </div>
      </div>
    </div>
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