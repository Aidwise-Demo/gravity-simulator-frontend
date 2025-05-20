// SharedLegend.tsx
import React from "react";

const SharedLegend = () => (
  <div className="flex flex-wrap gap-4 justify-end py-2 pr-5 border-t border-gray-200 bg-gray-50">
    <LegendItem color="#3182ce" label="Actual" />
    <LegendItem color="#9e38a1" label="Predefined Target" />
    <LegendItem color="#64748b" label="Industry Average" />
    <LegendItem color="#06b6d4" label="Projected Actual" dashed />
    <LegendItem color="#a855f7" label="Simulated Target" dashed />
    <LegendItem color="#6366f1" label="Projected Industry Average" dashed />
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

export default SharedLegend;