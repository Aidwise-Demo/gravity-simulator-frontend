// import React, { useState, useEffect } from 'react';
// import { fetchSimulationData } from '@/services/api'; // Adjust path as needed

// const TopArrow = ({ name, value, formatFunc }) => (
//   <div className="flex flex-col items-center">
//     <svg className="w-5 h-5 text-green-600 fill-current" viewBox="0 0 24 24">
//       <path d="M12 2l-6 6h12z" />
//     </svg>
//     <div className="text-xs mt-1 bg-gray-50 text-gray-800 px-2 py-1 rounded whitespace-nowrap">
//       {name} ({formatFunc(value)})
//     </div>
//   </div>
// );

// const BottomArrow = ({ name, value, formatFunc }) => (
//   <div className="flex flex-col items-center">
//     <div className="text-xs mb-1 bg-gray-50 text-gray-800 px-2 py-1 rounded whitespace-nowrap">
//       {name} ({formatFunc(value)})
//     </div>
//     <svg className="w-5 h-5 text-green-600 fill-current" viewBox="0 0 24 24">
//       <path d="M12 22l6-6H6z" />
//     </svg>
//   </div>
// );

// const BusinessVerticalRisk = ({
//   verticals: initialVerticals,
//   period = "Q1 2025",
//   benchmark = "Similar Competitors",
//   metric = "EBITDA",
//   onDataUpdate
// }) => {
//   const [verticals, setVerticals] = useState(initialVerticals);
//   const [originalTargets, setOriginalTargets] = useState({});
//   const [isDragging, setIsDragging] = useState(false);

//   useEffect(() => {
//     const targets = {};
//     initialVerticals.forEach(vertical => {
//       targets[vertical.name] = vertical.predictedTarget;
//     });
//     setOriginalTargets(targets);
//   }, [initialVerticals]);

//   const formatValue = (value) => {
//     if (value === null || value === undefined || value === '' || value === 'NA') {
//       return 'NA';
//     }
//     if (typeof value === 'number') {
//       if (value >= 1000000000) {
//         return (value / 1000000000).toFixed(1) + 'B';
//       } else if (value >= 1000000) {
//         return (value / 1000000).toFixed(1) + 'M';
//       } else if (value >= 1000) {
//         return (value / 1000).toFixed(1) + 'K';
//       } else {
//         return value.toFixed(1);
//       }
//     }
//     return value;
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'High':
//         return 'bg-red-500';
//       case 'Medium':
//         return 'bg-yellow-500';
//       case 'Low':
//         return 'bg-green-500';
//       default:
//         return 'bg-green-500';
//     }
//   };

//   const updateTargetPosition = (index, newPosition) => {
//     const updatedVerticals = [...verticals];
//     const boundedPosition = Math.max(
//       0,
//       Math.min(updatedVerticals[index].cutoff, newPosition)
//     );
//     updatedVerticals[index].predictedTarget = boundedPosition;
//     setVerticals(updatedVerticals);
//   };

//   const isValidNumber = (value) => {
//     return value !== null && value !== undefined && value !== '' && value !== 'NA';
//   };

//   const getPositionPercentage = (value, cutoff) => {
//     if (!isValidNumber(value)) return 0;
//     return Math.min((value / cutoff) * 100, 100);
//   };

//   const areValuesClose = (value1, value2, cutoff) => {
//     if (!isValidNumber(value1) || !isValidNumber(value2)) return false;
//     const pos1 = getPositionPercentage(value1, cutoff);
//     const pos2 = getPositionPercentage(value2, cutoff);
//     return Math.abs(pos1 - pos2) < 10;
//   };

//   const handleMouseUp = async (index) => {
//     setIsDragging(false);
//     const vertical = verticals[index];
//     const originalTarget = originalTargets[vertical.name];

//     if (vertical.predictedTarget !== originalTarget) {
//       try {
//         // Call onDataUpdate with all necessary parameters to trigger full refresh
//         await onDataUpdate({
//           period,
//           benchmark,
//           metric,
//           businessVertical: vertical.name,
//           targetValue: vertical.predictedTarget
//         });
        
//         setOriginalTargets(prev => ({
//           ...prev,
//           [vertical.name]: vertical.predictedTarget
//         }));
//       } catch (error) {
//         console.error("Failed to update target value", error);
//       }
//     }
//   };

//   return (
//     <div className="w-full bg-white p-4">
//       <h2 className="text-blue-600 font-medium text-lg mb-6">
//         Business Vertical Targets - Risk Assessment & Scenario Analysis
//       </h2>
//       <div className="flex w-full text-sm font-medium mb-4">
//         <div className="w-1/4"></div>
//         <div className="w-1/5 text-center">Predefined Target<br />for Q2 2025</div>
//         <div className="w-2/5 text-center">Simulator</div>
//         <div className="w-1/5 text-right">Status</div>
//       </div>
//       {verticals.map((vertical, idx) => (
//         <div key={idx} className="mb-16">
//           <div className="flex justify-between mb-2">
//             <div className="font-medium w-1/4">{vertical.name}</div>
//             <div className="font-medium w-1/5 text-center">
//               {formatValue(vertical.predictedTarget)}
//             </div>
//             <div className="w-2/5 relative">
//               {/* Slider bar */}
//               <div className="w-full h-1.5 bg-indigo-500 rounded-full my-4"></div>

//               {/* Draggable Target Marker */}
//               <div
//                 className="absolute h-12 w-2 bg-pink-600 cursor-move -top-4 z-10"
//                 style={{
//                   left: `${getPositionPercentage(vertical.predictedTarget, vertical.cutoff)}%`,
//                   transform: 'translateX(-50%)'
//                 }}
//                 onMouseDown={(e) => {
//                   setIsDragging(true);
//                   const startX = e.clientX;
//                   const initialPos = vertical.predictedTarget;
//                   const barWidth = e.currentTarget.parentElement?.offsetWidth || 0;

//                   const handleMouseMove = (moveEvent) => {
//                     const dx = moveEvent.clientX - startX;
//                     const percentMoved = dx / barWidth;
//                     const valueChange = percentMoved * vertical.cutoff;
//                     updateTargetPosition(idx, initialPos + valueChange);
//                   };

//                   const mouseUpHandler = () => {
//                     document.removeEventListener('mousemove', handleMouseMove);
//                     document.removeEventListener('mouseup', mouseUpHandler);
//                     handleMouseUp(idx); // Call external handler safely
//                   };

//                   document.addEventListener('mousemove', handleMouseMove);
//                   document.addEventListener('mouseup', mouseUpHandler);
//                 }}
//               >
//                 <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
//                   <div className="bg-pink-600 text-white text-xs px-2 py-1 rounded">
//                     Target
//                   </div>
//                 </div>
//               </div>

//               {/* Current Position */}
//               {isValidNumber(vertical.current) && (
//                 <div
//                   className="absolute"
//                   style={{
//                     left: `${getPositionPercentage(vertical.current, vertical.cutoff)}%`,
//                     bottom: `-${areValuesClose(vertical.current, vertical.industryAverage, vertical.cutoff) ? '40px' : '20px'}`,
//                     transform: 'translateX(-50%)',
//                     marginBottom: '2px'
//                   }}
//                 >
//                   <TopArrow name="Current" value={vertical.current} formatFunc={formatValue} />
//                 </div>
//               )}

//               {/* Current* Position */}
//               {isValidNumber(vertical.currentStar) && (
//                 <div
//                   className="absolute"
//                   style={{
//                     left: `${getPositionPercentage(vertical.currentStar, vertical.cutoff)}%`,
//                     top: `-${areValuesClose(vertical.currentStar, vertical.cutoff, vertical.cutoff) ? '40px' : '20px'}`,
//                     transform: 'translateX(-50%)',
//                     marginTop: '2px'
//                   }}
//                 >
//                   <BottomArrow name="Current*" value={vertical.currentStar} formatFunc={formatValue} />
//                 </div>
//               )}

//               {/* Industry Average */}
//               {isValidNumber(vertical.industryAverage) && (
//                 <div
//                   className="absolute"
//                   style={{
//                     left: `${getPositionPercentage(vertical.industryAverage, vertical.cutoff)}%`,
//                     bottom: `-${areValuesClose(vertical.industryAverage, vertical.current, vertical.cutoff) ? '60px' : '20px'}`,
//                     transform: 'translateX(-50%)',
//                     marginBottom: '2px'
//                   }}
//                 >
//                   <TopArrow
//                     name="Industry Average"
//                     value={vertical.industryAverage}
//                     formatFunc={formatValue}
//                   />
//                 </div>
//               )}

//               {/* Cut-off */}
//               {isValidNumber(vertical.cutoff) && (
//                 <div
//                   className="absolute"
//                   style={{
//                     left: '100%',
//                     top: `-${areValuesClose(vertical.cutoff, vertical.currentStar, vertical.cutoff) ? '60px' : '20px'}`,
//                     transform: 'translateX(-50%)',
//                     marginTop: '2px'
//                   }}
//                 >
//                   <BottomArrow name="cut-off" value={vertical.cutoff} formatFunc={formatValue} />
//                 </div>
//               )}
//             </div>

//             {/* Status indicator */}
//             <div className="w-1/5 flex justify-end items-center">
//               <span className="mr-2">{vertical.status}</span>
//               <div className={`${getStatusColor(vertical.status)} w-4 h-4 rounded-full`}></div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default BusinessVerticalRisk;


import React, { useState, useEffect } from 'react';
import { fetchSimulationData } from '@/services/api'; // Adjust path if needed

// Tooltip-enhanced Triangle Pointer
const TrianglePointer = ({ value, label, formatFunc, colorClass }) => (
  <div className="flex flex-col items-center group relative">
    <svg className={`w-3.5 h-3-5 ${colorClass} fill-current`} viewBox="0 0 24 24">
      <path d="M12 2L6 14h12z" />
    </svg>
    <div className="text-[10px] mt-0.5 bg-white text-gray-900 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
      {formatFunc(value)}
    </div>
    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 z-50 whitespace-nowrap">
      {label}
    </div>
  </div>
);

// Color mapping for triangles
const POINTER_COLORS = {
  Target: 'text-pink-600',
  Current: 'text-green-600',
  'Current*': 'text-yellow-500',
  'Industry Average': 'text-blue-600',
  'cut-off': 'text-gray-500'
};

const BusinessVerticalRisk = ({
  verticals: initialVerticals,
  period = "Q1 2025",
  benchmark = "Similar Competitors",
  metric = "EBITDA",
  onDataUpdate
}) => {
  const [verticals, setVerticals] = useState(initialVerticals);
  const [originalTargets, setOriginalTargets] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const targets = {};
    initialVerticals.forEach(vertical => {
      targets[vertical.name] = vertical.predictedTarget;
    });
    setOriginalTargets(targets);
  }, [initialVerticals]);

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '' || value === 'NA') return 'NA';
    if (typeof value === 'number') {
      if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
      if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
      if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
      return value.toFixed(1);
    }
    return value;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-green-500';
    }
  };

  const updateTargetPosition = (index, newPosition) => {
    const updatedVerticals = [...verticals];
    const boundedPosition = Math.max(0, Math.min(updatedVerticals[index].cutoff, newPosition));
    updatedVerticals[index].predictedTarget = boundedPosition;
    setVerticals(updatedVerticals);
  };

  const isValidNumber = (value) => value !== null && value !== undefined && value !== '' && value !== 'NA';

  const getPositionPercentage = (value, cutoff) => {
    if (!isValidNumber(value)) return 0;
    return Math.min((value / cutoff) * 100, 100); // <-- FIXED: cap to 100%
  };

  const handleMouseUp = async (index) => {
    setIsDragging(false);
    const vertical = verticals[index];
    const originalTarget = originalTargets[vertical.name];

    if (vertical.predictedTarget !== originalTarget) {
      try {
        await onDataUpdate({
          period,
          benchmark,
          metric,
          businessVertical: vertical.name,
          targetValue: vertical.predictedTarget
        });
        setOriginalTargets(prev => ({
          ...prev,
          [vertical.name]: vertical.predictedTarget
        }));
      } catch (error) {
        console.error("Failed to update target value", error);
      }
    }
  };

  return (
    <div className="w-full bg-white p-4">
      <h2 className="text-blue-600 font-medium text-lg mb-6">
        Business Vertical Targets - Risk Assessment & Scenario Analysis
      </h2>

      {/* Legend */}
   <div className="flex gap-6 text-sm mb-6 items-center relative">
  {/* Legend items */}
  {Object.entries(POINTER_COLORS).map(([label, colorClass], idx) => (
    <div key={idx} className="flex items-center space-x-2">
      <svg className={`w-3.5 h-3.5 ${colorClass} fill-current`} viewBox="0 0 24 24">
        <path d="M12 2L6 14h12z" />
      </svg>
      <span>{label}</span>
    </div>
  ))}

  {/* Info icon with tooltip */}
  <div className="group relative ml-4 cursor-pointer">
    <svg
      className="w-4 h-4 text-gray-500 hover:text-gray-700"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9 9h1v6H9V9zm0-4h1v2H9V5zm1-5C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>

    {/* Tooltip */}
    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max max-w-xs p-3 text-xs bg-gray-700 text-white rounded shadow-lg hidden group-hover:block z-50 whitespace-pre-wrap">
      <div><strong>Target</strong>: Projected target set for the upcoming period.</div>
      <div><strong>Current</strong>: Actual performance for the current period.</div>
      <div><strong>Current*</strong>: Adjusted or estimated current value.</div>
      <div><strong>Industry Average</strong>: Benchmark average across similar companies.</div>
      <div><strong>Cut-off</strong>: Maximum allowed threshold or upper bound for simulation.</div>
    </div>
  </div>
</div>

      

      {/* Header */}
      <div className="flex w-full text-sm font-medium mb-4">
        <div className="w-1/4"></div>
        <div className="w-1/5 text-center">Predefined Target<br />for Q2 2025</div>
        <div className="w-2/5 text-center">Simulator</div>
        <div className="w-1/5 text-right">Status</div>
      </div>

      {verticals.map((vertical, idx) => (
        <div key={idx} className="mb-16">
          <div className="flex justify-between mb-2">
            <div className="font-medium w-1/4">{vertical.name}</div>
            <div className="font-medium w-1/5 text-center">
              {formatValue(vertical.predictedTarget)}
            </div>
            <div className="w-2/5 relative">
              <div className="w-full h-1.5 bg-indigo-500 rounded-full my-4"></div>

              {/* Target draggable marker */}
              <div
                className="absolute h-12 w-2 bg-pink-600 cursor-move -top-4 z-10"
                style={{
                  left: `${getPositionPercentage(vertical.predictedTarget, vertical.cutoff)}%`,
                  transform: 'translateX(-50%)'
                }}
                onMouseDown={(e) => {
                  setIsDragging(true);
                  const startX = e.clientX;
                  const initialPos = vertical.predictedTarget;
                  const barWidth = e.currentTarget.parentElement?.offsetWidth || 0;

                  const handleMouseMove = (moveEvent) => {
                    const dx = moveEvent.clientX - startX;
                    const percentMoved = dx / barWidth;
                    const valueChange = percentMoved * vertical.cutoff;
                    updateTargetPosition(idx, initialPos + valueChange);
                  };

                  const mouseUpHandler = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', mouseUpHandler);
                    handleMouseUp(idx);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', mouseUpHandler);
                }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-pink-600 text-white text-xs px-2 py-1 rounded">
                    {formatValue(vertical.predictedTarget)}
                  </div>
                </div>
              </div>

              {/* All triangle pointers below the bar */}
              {['current', 'currentStar', 'industryAverage', 'cutoff'].map((key, i) => (
                isValidNumber(vertical[key]) && (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${getPositionPercentage(vertical[key], vertical.cutoff)}%`,
                      top: '20px',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <TrianglePointer
                      value={vertical[key]}
                      label={
                        key === 'currentStar'
                          ? 'Current*'
                          : key === 'cutoff'
                          ? 'Cut-off'
                          : key === 'industryAverage'
                          ? 'Industry Average'
                          : key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
                      }
                      formatFunc={formatValue}
                      colorClass={
                        POINTER_COLORS[
                          key === 'currentStar'
                            ? 'Current*'
                            : key === 'cutoff'
                            ? 'cut-off'
                            : key === 'industryAverage'
                            ? 'Industry Average'
                            : key.charAt(0).toUpperCase() + key.slice(1)
                        ]
                      }
                    />
                  </div>
                )
              ))}
            </div>

            {/* Status */}
            <div className="w-1/5 flex justify-end items-center">
              {/* <span className="mr-2">{vertical.status}</span> */}
              <div className={`${getStatusColor(vertical.status)} w-4 h-4 rounded-full`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusinessVerticalRisk;
