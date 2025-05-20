//// version-1
// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   fetchSimulationData, 
//   periodOptions, 
//   benchmarkOptions, 
//   metricOptions, 
//   type SimulationData 
// } from '../services/api';
// import FilterDropdown from '../components/FilterDropdown';
// import GaugeChart from '../components/GaugeChart';
// import TrendAnalysis from '../components/TrendAnalysis';
// import BusinessVerticalRisk from '../components/BusinessVerticalRisk';
// import ScoreSummary from '../components/ScoreSummary';
// import SharedLegend from '../components/SharedLegend';
// import { toast } from '@/components/ui/use-toast';

// // Define the interface for business vertical target with change flag
// interface BusinessVerticalTargetWithFlag {
//   value: number;
//   changed: number; // 1 for changed, 0 for unchanged
// }

// const Index = () => {
//   const [period, setPeriod] = useState<string>("Q1 2025");
//   const [benchmark, setBenchmark] = useState<string>("Similar Competitors");
//   const [metric, setMetric] = useState<string>("EBITDA");
//   const [data, setData] = useState<SimulationData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [updating, setUpdating] = useState<boolean>(false);
//   const [isResetting, setIsResetting] = useState(false);

//   const handleReset = async () => {
//     setIsResetting(true);
//     try {
//       // Call API to reset simulation (no business verticals passed)
//       await loadData(period, benchmark, metric, undefined);
//     } catch (error) {
//       console.error("Failed to reset targets", error);
//     } finally {
//       setIsResetting(false);
//     }
//   };

//   const loadData = useCallback(async (
//     currentPeriod: string = period,
//     currentBenchmark: string = benchmark,
//     currentMetric: string = metric,
//     allBusinessVerticalTargets?: Record<string, BusinessVerticalTargetWithFlag>
//   ) => {
//     const isUpdate = allBusinessVerticalTargets !== undefined;
//     if (isUpdate) {
//       setUpdating(true);
//     } else {
//       setLoading(true);
//     }
    
//     try {
//       const result = await fetchSimulationData(
//         currentPeriod, 
//         currentBenchmark, 
//         currentMetric,
//         allBusinessVerticalTargets
//       );
      
//       // Log the entire data response
//       console.log('Full API response:', result);
      
//       // Specifically log the business vertical trend data
//       if (result.trendAnalysis.businessVerticals) {
//         console.log('Business Vertical Trend Data:', {
//           quarters: result.trendAnalysis.businessVerticals.quarters,
//           actual: result.trendAnalysis.businessVerticals.actualValues,
//           target: result.trendAnalysis.businessVerticals.targetValues
//         });
//       } else {
//         console.warn('No businessVerticals data found in trendAnalysis');
//       }
      
//       setData(result);
//     } catch (error) {
//       console.error('Error fetching simulation data:', error);
//       toast({
//         title: 'Error loading data',
//         description: 'Failed to load simulation data. Please try again later.',
//         variant: 'destructive'
//       });
//     } finally {
//       if (isUpdate) {
//         setUpdating(false);
//       } else {
//         setLoading(false);
//       }
//     }
//   }, [period, benchmark, metric]);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   const handlePeriodChange = (value: string) => {
//     setPeriod(value);
//     loadData(value, benchmark, metric);
//   };

//   const handleBenchmarkChange = (value: string) => {
//     setBenchmark(value);
//     loadData(period, value, metric);
//   };

//   const handleMetricChange = (value: string) => {
//     setMetric(value);
//     loadData(period, benchmark, value);
//   };
//   const getPreviousQuarter = (period: string) => {
//   const match = period.match(/Q([1-4]) (\d{4})/);
//   if (!match) return period;
//   let quarter = parseInt(match[1], 10);
//   let year = parseInt(match[2], 10);
//   if (quarter === 1) {
//     quarter = 4;
//     year -= 1;
//   } else {
//     quarter -= 1;
//   }
//   return `Q${quarter} ${year}`;
// };

//   const handleBusinessVerticalUpdate = async (updateParams: {
//     period: string;
//     benchmark: string;
//     metric: string;
//     allBusinessVerticalTargets: Record<string, BusinessVerticalTargetWithFlag>;
//   }) => {
//     await loadData(
//       updateParams.period,
//       updateParams.benchmark,
//       updateParams.metric,
//       updateParams.allBusinessVerticalTargets
//     );
//   };

//   if (loading || !data) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-pulse text-xl">Loading dashboard data...</div>
//       </div>
//     );
//   }

//   // Check if business vertical trend data exists and has valid content
//   const hasBusinessVerticalData = data.trendAnalysis.businessVerticals && 
//     data.trendAnalysis.businessVerticals.quarters && 
//     data.trendAnalysis.businessVerticals.quarters.length > 0 &&
//     data.trendAnalysis.businessVerticals.actualValues &&
//     data.trendAnalysis.businessVerticals.targetValues;

//   return (
//     // <div className="max-w-7xl mx-auto p-4 md:p-6 bg-white relative">
//     <div className="w-full p-4 md:p-6 bg-white relative p-0 m-0">  
//     {/* Updating Overlay */}
//       {updating && (
//         <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
//           <div className="flex flex-col items-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//             <div className="text-xl font-medium">Updating dashboard...</div>
//           </div>
//         </div>
//       )}
      
//       <div className="flex flex-col space-y-4">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between">
//           <h1 className="text-2xl font-bold text-blue-500">Dubai Holdings</h1>
//           <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
//             <FilterDropdown 
//               label="Period" 
//               value={period} 
//               options={periodOptions} 
//               onChange={handlePeriodChange} 
//             />
//             <FilterDropdown 
//               label="Industry Benchmark" 
//               value={benchmark} 
//               options={benchmarkOptions} 
//               onChange={handleBenchmarkChange} 
//             />
//             <FilterDropdown 
//               label="Metric" 
//               value={metric} 
//               options={metricOptions} 
//               onChange={handleMetricChange} 
//             />
//             <button
//               onClick={handleReset}
//               disabled={isResetting}
//               className="flex items-center text-gray-600 hover:text-blue-600 transition-colors border border-gray-300 rounded px-2 py-1 hover:border-blue-400 ml-2"
//               title="Reset to default values"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
//               </svg>
//               <span className="ml-1">Reset</span>
//             </button>
//           </div>
//         </div>

//         {/* Gauge Charts in one box */}
// <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-6">
//   {/* Gauges Box (1/3 width) */}
//   <div className="rounded-lg shadow-md bg-white overflow-hidden p-4 flex flex-col h-full justify-center border border-gray-200">
//   <div className="flex flex-col lg:flex-row gap-2 items-center justify-center">
//     {/* Gauge Chart 1: Selected Period */}
//     <div className="flex-1 flex items-center justify-center">
//       <GaugeChart 
//         actualValue={data.summary_current.actualValue}
//         targetValue={data.summary_current.targetValue}
//         achievementStatus={data.summary_current.achievementStatus}
//         overallValue={data.summary_current.overallValue}
//         newTarget={data.summary_current.newTarget}
//         period={period}
//         metric={metric}
//         title={`Current Quarter (${period})`}
//         periodLabel={period}
//         showSimulatedTarget={true}
//       />
//     </div>
//     {/* Gauge Chart 2: Previous Period */}
//     <div className="flex-1 flex items-center justify-center">
//       <GaugeChart 
//         actualValue={data.summary.actualValue}
//         targetValue={data.summary.targetValue}
//         achievementStatus={data.summary.achievementStatus}
//         overallValue={data.summary.overallValue}
//         newTarget={data.summary.newTarget}
//         period={period}
//         metric={metric}
//         title={`Previous Quarter (${getPreviousQuarter(period)})`}
//         periodLabel={getPreviousQuarter(period)}
//         showSimulatedTarget={false}
//       />
//     </div>
//   </div>
// </div>
//   {/* Trend Chart 1 (1/3 width) */}
//   <div className="rounded-lg shadow-md bg-white overflow-hidden p-4 flex items-center justify-center border border-gray-200">
//     <TrendAnalysis 
//       title="Overall Trend Analysis"
//       quarters={data.trendAnalysis.overall.quarters}
//       actualValues={data.trendAnalysis.overall.actualValues}
//       targetValues={data.trendAnalysis.overall.targetValues}
//       simulatedTargetValues={data.trendAnalysis.overall.simulatedTargetValues}
//       simulatedActualValues={data.trendAnalysis.overall.simulatedActualValues}
//       selectedQuarter={period}
//       metric={metric}
//     />
//   </div>
//   {/* Trend Chart 2 (1/3 width) */}
//   <div className="rounded-lg shadow-md bg-white overflow-hidden p-4 flex items-center justify-center border border-gray-200">
//     {hasBusinessVerticalData && (
//       <TrendAnalysis 
//         title="Business Vertical Trend Analysis"
//         quarters={data.trendAnalysis.businessVerticals.quarters}
//         actualValues={data.trendAnalysis.businessVerticals.actualValues}
//         targetValues={data.trendAnalysis.businessVerticals.targetValues}
//         industryValues={data.trendAnalysis.businessVerticals.industryValues}
//         simulatedTargetValues={data.trendAnalysis.businessVerticals.simulatedTargetValues}
//         simulatedActualValues={data.trendAnalysis.businessVerticals.simulatedActualValues}
//         simulatedIndustryValues={data.trendAnalysis.businessVerticals.simulatedIndustryValues}
//         selectedQuarter={period}
//         metric={metric}
//       />
//     )}
//   </div>
// </div>
// <SharedLegend />
//         {/* Lower Section - Business Vertical Risk & Score Summary */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
//           {/* Business Vertical Risk Assessment */}
//           <div className="lg:col-span-3">
//             <BusinessVerticalRisk
//               verticals={data.businessVerticalTargets}
//               period={period}
//               benchmark={benchmark}
//               metric={metric}
//               onDataUpdate={handleBusinessVerticalUpdate}
//             />
//           </div>
//           {/* Score Summary */}
//           <div className="lg:col-span-1">
//             <ScoreSummary
//               scorePercent={data.overallScore.scorePercent}
//               targetsRatio={data.overallScore.targetsRatio}
//               targetDiff={data.overallScore.targetDiff}
//               metric={metric}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;



// -----------------------------------------------------------------------------------
// version-2
import React, { useState, useEffect, useCallback } from 'react';
import { 
  fetchSimulationData, 
  periodOptions, 
  benchmarkOptions, 
  metricOptions, 
  type SimulationData 
} from '../services/api';
import FilterDropdown from '../components/FilterDropdown';
import GaugeChart from '../components/GaugeChart';
import TrendAnalysis from '../components/TrendAnalysis';
import BusinessVerticalRisk from '../components/BusinessVerticalRisk';
import ScoreSummary from '../components/ScoreSummary';
import SharedLegend from '../components/SharedLegend';
import { toast } from '@/components/ui/use-toast';

// Define the interface for business vertical target with change flag
interface BusinessVerticalTargetWithFlag {
  value: number;
  changed: number; // 1 for changed, 0 for unchanged
}

const Index = () => {
  const [period, setPeriod] = useState<string>("Q1 2025");
  const [benchmark, setBenchmark] = useState<string>("Similar Competitors");
  const [metric, setMetric] = useState<string>("EBITDA");
  const [data, setData] = useState<SimulationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      // Call API to reset simulation (no business verticals passed)
      await loadData(period, benchmark, metric, undefined);
    } catch (error) {
      console.error("Failed to reset targets", error);
    } finally {
      setIsResetting(false);
    }
  };

  const loadData = useCallback(async (
    currentPeriod: string = period,
    currentBenchmark: string = benchmark,
    currentMetric: string = metric,
    allBusinessVerticalTargets?: Record<string, BusinessVerticalTargetWithFlag>
  ) => {
    const isUpdate = allBusinessVerticalTargets !== undefined;
    if (isUpdate) {
      setUpdating(true);
    } else {
      setLoading(true);
    }
    
    try {
      const result = await fetchSimulationData(
        currentPeriod, 
        currentBenchmark, 
        currentMetric,
        allBusinessVerticalTargets
      );
      
      // Log the entire data response
      console.log('Full API response:', result);
      
      // Specifically log the business vertical trend data
      if (result.trendAnalysis.businessVerticals) {
        console.log('Business Vertical Trend Data:', {
          quarters: result.trendAnalysis.businessVerticals.quarters,
          actual: result.trendAnalysis.businessVerticals.actualValues,
          target: result.trendAnalysis.businessVerticals.targetValues
        });
      } else {
        console.warn('No businessVerticals data found in trendAnalysis');
      }
      
      setData(result);
    } catch (error) {
      console.error('Error fetching simulation data:', error);
      toast({
        title: 'Error loading data',
        description: 'Failed to load simulation data. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      if (isUpdate) {
        setUpdating(false);
      } else {
        setLoading(false);
      }
    }
  }, [period, benchmark, metric]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    loadData(value, benchmark, metric);
  };

  const handleBenchmarkChange = (value: string) => {
    setBenchmark(value);
    loadData(period, value, metric);
  };

  const handleMetricChange = (value: string) => {
    setMetric(value);
    loadData(period, benchmark, value);
  };
  const getPreviousQuarter = (period: string) => {
  const match = period.match(/Q([1-4]) (\d{4})/);
  if (!match) return period;
  let quarter = parseInt(match[1], 10);
  let year = parseInt(match[2], 10);
  if (quarter === 1) {
    quarter = 4;
    year -= 1;
  } else {
    quarter -= 1;
  }
  return `Q${quarter} ${year}`;
};

  const handleBusinessVerticalUpdate = async (updateParams: {
    period: string;
    benchmark: string;
    metric: string;
    allBusinessVerticalTargets: Record<string, BusinessVerticalTargetWithFlag>;
  }) => {
    await loadData(
      updateParams.period,
      updateParams.benchmark,
      updateParams.metric,
      updateParams.allBusinessVerticalTargets
    );
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  // Check if business vertical trend data exists and has valid content
  const hasBusinessVerticalData = data.trendAnalysis.businessVerticals && 
    data.trendAnalysis.businessVerticals.quarters && 
    data.trendAnalysis.businessVerticals.quarters.length > 0 &&
    data.trendAnalysis.businessVerticals.actualValues &&
    data.trendAnalysis.businessVerticals.targetValues;

  return (
    // <div className="max-w-7xl mx-auto p-4 md:p-6 bg-white relative">
    <div className="w-full p-4 md:p-6 bg-white relative p-0 m-0">  
    {/* Updating Overlay */}
      {updating && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <div className="text-xl font-medium">Updating dashboard...</div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-500">Dubai Holdings</h1>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <FilterDropdown 
              label="Period" 
              value={period} 
              options={periodOptions} 
              onChange={handlePeriodChange} 
            />
            {/* <FilterDropdown 
              label="Industry Benchmark" 
              value={benchmark} 
              options={benchmarkOptions} 
              onChange={handleBenchmarkChange} 
            /> */}
            <FilterDropdown 
              label="Metric" 
              value={metric} 
              options={metricOptions} 
              onChange={handleMetricChange} 
            />
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors border border-gray-300 rounded px-2 py-1 hover:border-blue-400 ml-2"
              title="Reset to default values"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span className="ml-1">Reset</span>
            </button>
          </div>
        </div>

        {/* Gauge Charts in one box */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-6">
  {/* Gauges Box (1/3 width) */}
  <div className="rounded-lg shadow-md bg-white overflow-hidden p-4 flex flex-col h-full justify-center border border-gray-200">
  <div className="flex flex-col lg:flex-row gap-2 items-center justify-center">
    {/* Gauge Chart 1: Selected Period */}
    <div className="flex-1 flex items-center justify-center">
      <GaugeChart 
        actualValue={data.summary_current.actualValue}
        targetValue={data.summary_current.targetValue}
        achievementStatus={data.summary_current.achievementStatus}
        overallValue={data.summary_current.overallValue}
        newTarget={data.summary_current.newTarget}
        period={period}
        metric={metric}
        title={`Realistic ${metric} Estimate (${period})`}
        periodLabel={period}
        showSimulatedTarget={true}
        previuos_quarter_actual={data.summary.actualValue}
        previuos_quarter_target={data.summary.targetValue}
      />
    </div>
    {/* Gauge Chart 2: Previous Period */}
    {/* <div className="flex-1 flex items-center justify-center">
      <GaugeChart 
        actualValue={data.summary.actualValue}
        targetValue={data.summary.targetValue}
        achievementStatus={data.summary.achievementStatus}
        overallValue={data.summary.overallValue}
        newTarget={data.summary.newTarget}
        period={period}
        metric={metric}
        title={`Previous Quarter (${getPreviousQuarter(period)})`}
        periodLabel={getPreviousQuarter(period)}
        showSimulatedTarget={false}
      />
    </div> */}
  </div>
</div>
  {/* Trend Chart 1 (1/3 width) */}
  <div className="rounded-lg shadow-md bg-white overflow-hidden p-4 flex items-center justify-center border border-gray-200">
    <TrendAnalysis 
      title="Overall Trend Analysis"
      quarters={data.trendAnalysis.overall.quarters}
      actualValues={data.trendAnalysis.overall.actualValues}
      targetValues={data.trendAnalysis.overall.targetValues}
      simulatedTargetValues={data.trendAnalysis.overall.simulatedTargetValues}
      simulatedActualValues={data.trendAnalysis.overall.simulatedActualValues}
      selectedQuarter={period}
      metric={metric}
    />
  </div>
  {/* Trend Chart 2 (1/3 width) */}
  <div className="rounded-lg shadow-md bg-white overflow-hidden p-4 flex items-center justify-center border border-gray-200">
    {hasBusinessVerticalData && (
      <TrendAnalysis 
        title="Business Vertical Trend Analysis"
        quarters={data.trendAnalysis.businessVerticals.quarters}
        actualValues={data.trendAnalysis.businessVerticals.actualValues}
        targetValues={data.trendAnalysis.businessVerticals.targetValues}
        industryValues={data.trendAnalysis.businessVerticals.industryValues}
        simulatedTargetValues={data.trendAnalysis.businessVerticals.simulatedTargetValues}
        simulatedActualValues={data.trendAnalysis.businessVerticals.simulatedActualValues}
        simulatedIndustryValues={data.trendAnalysis.businessVerticals.simulatedIndustryValues}
        selectedQuarter={period}
        metric={metric}
      />
    )}
  </div>
</div>
<SharedLegend />
        {/* Lower Section - Business Vertical Risk & Score Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 mt-4">
          {/* Business Vertical Risk Assessment */}
          <div className="lg:col-span-3">
            <BusinessVerticalRisk
              verticals={data.businessVerticalTargets}
              period={period}
              benchmark={benchmark}
              metric={metric}
              onDataUpdate={handleBusinessVerticalUpdate}
            />
          </div>
          {/* Score Summary */}
          <div className="lg:col-span-1">
            <ScoreSummary
              scorePercent={data.overallScore.scorePercent}
              targetsRatio={data.overallScore.targetsRatio}
              targetDiff={data.overallScore.targetDiff}
              metric={metric}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;