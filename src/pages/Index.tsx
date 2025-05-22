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
//             {/* <FilterDropdown 
//               label="Industry Benchmark" 
//               value={benchmark} 
//               options={benchmarkOptions} 
//               onChange={handleBenchmarkChange} 
//             /> */}
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
//         title={`Realistic ${metric} Estimate (${period})`}
//         periodLabel={period}
//         showSimulatedTarget={true}
//         previuos_quarter_actual={data.summary.actualValue}
//         previuos_quarter_target={data.summary.targetValue}
//       />
//     </div>
//     {/* Gauge Chart 2: Previous Period */}
//     {/* <div className="flex-1 flex items-center justify-center">
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
//     </div> */}
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
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 mt-4">
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

// ------------------------------------------------------------------------------------


// version 3
// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   fetchSimulationData, 
//   periodOptions, 
//   benchmarkOptions, 
//   metricOptions,
//   businessVerticalsCompanyOptions, // Added import
//   type SimulationData 
// } from '../services/api';
// import FilterDropdown from '../components/FilterDropdown';
// import GaugeChart from '../components/GaugeChart';
// import TrendAnalysis from '../components/TrendAnalysis';
// import BusinessVerticalRisk from '../components/BusinessVerticalRisk';
// import ScoreSummary from '../components/ScoreSummary';
// import SharedLegend from '../components/SharedLegend';
// import { toast } from '@/components/ui/use-toast';
// import PeriodSummary from '@/components/PeriodSummary';

// // Define the interface for business vertical target with change flag
// interface BusinessVerticalTargetWithFlag {
//   value: number;
//   changed: number; // 1 for changed, 0 for unchanged
// }

// const Index = () => {
//   const [period, setPeriod] = useState<string>("Q1 2025");
//   const [benchmark, setBenchmark] = useState<string>("Similar Competitors");
//   const [metric, setMetric] = useState<string>("EBITDA");
//   const [businessVerticalsCompany, setBusinessVerticalsCompany] = useState<string>("Real Estate"); // Added state
//   const [data, setData] = useState<SimulationData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [updating, setUpdating] = useState<boolean>(false);
//   const [isResetting, setIsResetting] = useState(false);

//   // State for selected business vertical (for dropdown)
//   const [selectedBusinessVertical, setSelectedBusinessVertical] = useState<string>('All Verticals');

//   const handleReset = async () => {
//     setIsResetting(true);
//     try {
//       // Call API to reset simulation (no business verticals passed)
//       await loadData(period, benchmark, metric, businessVerticalsCompany, undefined);
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
//     currentBusinessVerticalsCompany: string = businessVerticalsCompany, // Added parameter
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
//         currentBusinessVerticalsCompany, // Added to function call
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
//   }, [period, benchmark, metric, businessVerticalsCompany]); // Added businessVerticalsCompany to dependencies

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   const handlePeriodChange = (value: string) => {
//     setPeriod(value);
//     loadData(value, benchmark, metric, businessVerticalsCompany);  };

//   const handleBenchmarkChange = (value: string) => {
//     setBenchmark(value);
//     loadData(period, value, metric, businessVerticalsCompany);
    
//   };

//     // Added handler for businessVerticalsCompany change

//   const handleBusinessVerticalsCompanyChange = (value: string) => {
//       setBusinessVerticalsCompany(value);
//       loadData(period, benchmark, metric, value);
//   }; 

//   const handleMetricChange = (value: string) => {
//     setMetric(value);
//     loadData(period, benchmark, value);
//   };

//   const getPreviousQuarter = (period: string) => {
//     const match = period.match(/Q([1-4]) (\d{4})/);
//     if (!match) return period;
//     let quarter = parseInt(match[1], 10);
//     let year = parseInt(match[2], 10);
//     if (quarter === 1) {
//       quarter = 4;
//       year -= 1;
//     } else {
//       quarter -= 1;
//     }
//     return `Q${quarter} ${year}`;
//   };

//   // Only update targets, do not reload chart data or change dropdown selection
//   const handleBusinessVerticalUpdate = async (updateParams: {
//     period: string;
//     benchmark: string;
//     metric: string;
//     businessVerticalsCompany: string;
//     allBusinessVerticalTargets: Record<string, BusinessVerticalTargetWithFlag>;
//   }) => {
//     await loadData(
//       updateParams.period,
//       updateParams.benchmark,
//       updateParams.metric,
//       updateParams.businessVerticalsCompany, // Added to function call
//       updateParams.allBusinessVerticalTargets
//     );
//     // Do NOT update selectedBusinessVertical here!
//   };

//   // Prepare dropdown options for business verticals
//   const businessVerticalOptions = React.useMemo(() => {
//     if (!data?.businessVerticalTargets) return ['All Verticals'];
//     return [
//       'All Verticals',
//       ...Object.keys(data.businessVerticalTargets).map(
//         key => data.businessVerticalTargets[key].name
//       ),
//     ];
//   }, [data]);

//   // Prepare filtered data for the business vertical chart
//   let filteredBusinessVerticalData = {
//     quarters: data?.trendAnalysis.businessVerticals?.quarters || [],
//     actualValues: data?.trendAnalysis.businessVerticals?.actualValues || {},
//     targetValues: data?.trendAnalysis.businessVerticals?.targetValues || {},
//     industryValues: data?.trendAnalysis.businessVerticals?.industryValues || {},
//     simulatedTargetValues: data?.trendAnalysis.businessVerticals?.simulatedTargetValues || {},
//     simulatedActualValues: data?.trendAnalysis.businessVerticals?.simulatedActualValues || {},
//     simulatedIndustryValues: data?.trendAnalysis.businessVerticals?.simulatedIndustryValues || {},
//   };

//   // If a specific vertical is selected, filter the chart data and always provide arrays
//   if (
//     selectedBusinessVertical !== 'All Verticals' &&
//     data?.businessVerticalTargets
//   ) {
//     const key = Object.keys(data.businessVerticalTargets).find(
//       k => data.businessVerticalTargets[k].name === selectedBusinessVertical
//     );
//     if (key) {
//       filteredBusinessVerticalData = {
//         quarters: data.trendAnalysis.businessVerticals.quarters || [],
//         actualValues: (data.trendAnalysis.businessVerticals.actualValues && data.trendAnalysis.businessVerticals.actualValues[key]) || [],
//         targetValues: (data.trendAnalysis.businessVerticals.targetValues && data.trendAnalysis.businessVerticals.targetValues[key]) || [],
//         industryValues: (data.trendAnalysis.businessVerticals.industryValues && data.trendAnalysis.businessVerticals.industryValues[key]) || [],
//         simulatedTargetValues: (data.trendAnalysis.businessVerticals.simulatedTargetValues && data.trendAnalysis.businessVerticals.simulatedTargetValues[key]) || [],
//         simulatedActualValues: (data.trendAnalysis.businessVerticals.simulatedActualValues && data.trendAnalysis.businessVerticals.simulatedActualValues[key]) || [],
//         simulatedIndustryValues: (data.trendAnalysis.businessVerticals.simulatedIndustryValues && data.trendAnalysis.businessVerticals.simulatedIndustryValues[key]) || [],
//       };
//     }
//   }

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
//     <div className="w-full p-4 md:p-6 bg-white relative p-0 m-0">  
//       {/* Updating Overlay */}
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
//               label="Metric" 
//               value={metric} 
//               options={metricOptions} 
//               onChange={handleMetricChange} 
//             />
//             {/* Added new dropdown for Business Vertical */}

//             <FilterDropdown 

//               label="Business Vertical" 

//               value={businessVerticalsCompany} 

//               options={businessVerticalsCompanyOptions} 

//               onChange={handleBusinessVerticalsCompanyChange} 

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

//         {/* Score Card and Trend Charts */}
//         {/* Score Card and Trend Charts */}
// <div className="flex flex-col lg:flex-row gap-2 mb-6">
//   {/* Score Card (20% width) */}
//   <div className="w-full lg:w-[20%] rounded-lg bg-white overflow-hidden flex flex-col h-[380px] border border-gray-200">
//     <ScoreSummary
//       scorePercent={data.overallScore.scorePercent}
//       targetsRatio={data.overallScore.targetsRatio}
//       targetDiff={data.overallScore.targetDiff}
//       actual_target={data.overallScore.actual_target}
//       metric={metric}
//       period={period}
//     />
//   </div>
//   {/* Trend Chart 1 (40% width) */}
//   <div className="w-full lg:w-[40%] rounded-lg bg-white overflow-hidden flex flex-col h-[380px] border border-gray-200 relative">
//     {/* Header with background */}
//     <div className="w-full bg-gray-50 px-4 py-2 rounded mb-4 flex items-center">
//       <span className="text-lg font-semibold text-gray-800">Overall Trend Analysis</span>
//     </div>
//     {/* PeriodSummary at top right */}
//     <div className="absolute top-1 right-1 z-10">
//       <PeriodSummary
//         period={period}
//         metric={metric}
//         actualValue={data.summary_current.actualValue}
//         targetValue={data.summary_current.targetValue}
//         simulatedTarget={data.summary_current.newTarget}
//       />
//     </div>
//     <TrendAnalysis 
//       title=""
//       quarters={data.trendAnalysis.overall.quarters}
//       actualValues={data.trendAnalysis.overall.actualValues}
//       targetValues={data.trendAnalysis.overall.targetValues}
//       simulatedTargetValues={data.trendAnalysis.overall.simulatedTargetValues}
//       simulatedActualValues={data.trendAnalysis.overall.simulatedActualValues}
//       selectedQuarter={period}
//       metric={metric}
//     />
//   </div>
//   {/* Trend Chart 2 (40% width) */}
//   {/* Trend Chart 2 (40% width) */}
// <div className="w-full lg:w-[40%] rounded-lg bg-white overflow-hidden flex flex-col h-[380px] border border-gray-200 relative">
//   {hasBusinessVerticalData && (
//   <>
//     {/* Header with background */}
//     <div className="w-full bg-gray-50 px-4 py-2 rounded mb-4 flex items-center">
//       <span className="text-lg font-semibold text-gray-800">Business Vertical Trend Analysis</span>
//     </div>
//     {/* PeriodSummary for Business Vertical */}
// <div className="absolute top-1 right-1 z-10">
//   <PeriodSummary
//     period={period}
//     metric={metric}
//     actualValue={
//       filteredBusinessVerticalData.simulatedActualValues[
//         filteredBusinessVerticalData.quarters.indexOf(period)
//       ]
//     }
//     targetValue={
//       filteredBusinessVerticalData.targetValues[
//         filteredBusinessVerticalData.quarters.indexOf(period)
//       ]
//     }
//     simulatedTarget={
//       filteredBusinessVerticalData.simulatedTargetValues[
//         filteredBusinessVerticalData.quarters.indexOf(period)
//       ]
//     }
//     industryAverage={
//       filteredBusinessVerticalData.simulatedIndustryValues[
//         filteredBusinessVerticalData.quarters.indexOf(period)
//       ]
//     }
//   />
// </div>
// <TrendAnalysis
//   title=""
//   quarters={filteredBusinessVerticalData.quarters}
//   actualValues={filteredBusinessVerticalData.actualValues}
//   targetValues={filteredBusinessVerticalData.targetValues}
//   industryValues={filteredBusinessVerticalData.industryValues}
//   simulatedTargetValues={filteredBusinessVerticalData.simulatedTargetValues}
//   simulatedActualValues={filteredBusinessVerticalData.simulatedActualValues}
//   simulatedIndustryValues={filteredBusinessVerticalData.simulatedIndustryValues}
//   selectedQuarter={period}
//   metric={metric}
//   thresholds={
//     data.thresholds &&
//     data.thresholds[metric] &&
//     data.thresholds[metric][businessVerticalsCompany]
//       ? data.thresholds[metric][businessVerticalsCompany]
//       : null
//   }
// />
//   </>
// )}
// </div>
// </div>
//         <SharedLegend />
//         {/* Lower Section - Business Vertical Risk */}
//         <div className="mt-4">
//           <BusinessVerticalRisk
//             verticals={data.businessVerticalTargets}
//             period={period}
//             benchmark={benchmark}
//             metric={metric}
//             onDataUpdate={handleBusinessVerticalUpdate}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;

import React, { useState, useEffect, useCallback } from 'react';
import { 
  fetchSimulationData, 
  periodOptions, 
  benchmarkOptions, 
  metricOptions,
  businessVerticalsCompanyOptions,
  type SimulationData 
} from '../services/api';
import FilterDropdown from '../components/FilterDropdown';
import GaugeChart from '../components/GaugeChart';
import TrendAnalysis from '../components/TrendAnalysis';
import BusinessVerticalRisk from '../components/BusinessVerticalRisk';
import ScoreSummary from '../components/ScoreSummary';
import SharedLegend from '../components/SharedLegend';
import { toast } from '@/components/ui/use-toast';
import PeriodSummary from '@/components/PeriodSummary';
import SimulatedTargetSummary from '../components/SimulatedTargetSummary';

// Define the interface for business vertical target with change flag
interface BusinessVerticalTargetWithFlag {
  value: number;
  changed: number; // 1 for changed, 0 for unchanged
}

const Index = () => {
  const [period, setPeriod] = useState<string>("Q1 2025");
  const [benchmark, setBenchmark] = useState<string>("Similar Competitors");
  const [metric, setMetric] = useState<string>("EBITDA");
  const [businessVerticalsCompany, setBusinessVerticalsCompany] = useState<string>("Real Estate");
  const [data, setData] = useState<SimulationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState(false);

  // State for selected business vertical (for dropdown)
  const [selectedBusinessVertical, setSelectedBusinessVertical] = useState<string>('All Verticals');

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await loadData(period, benchmark, metric, businessVerticalsCompany, undefined);
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
    currentBusinessVerticalsCompany: string = businessVerticalsCompany,
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
        currentBusinessVerticalsCompany,
        allBusinessVerticalTargets
      );
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
  }, [period, benchmark, metric, businessVerticalsCompany]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    loadData(value, benchmark, metric, businessVerticalsCompany);
  };

  const handleBenchmarkChange = (value: string) => {
    setBenchmark(value);
    loadData(period, value, metric, businessVerticalsCompany);
  };

  const handleBusinessVerticalsCompanyChange = (value: string) => {
    setBusinessVerticalsCompany(value);
    loadData(period, benchmark, metric, value);
  };

  const handleMetricChange = (value: string) => {
    setMetric(value);
    loadData(period, benchmark, value, businessVerticalsCompany);
  };

  // Only update targets, do not reload chart data or change dropdown selection
  const handleBusinessVerticalUpdate = async (updateParams: {
    period: string;
    benchmark: string;
    metric: string;
    businessVerticalsCompany: string;
    allBusinessVerticalTargets: Record<string, BusinessVerticalTargetWithFlag>;
  }) => {
    await loadData(
      updateParams.period,
      updateParams.benchmark,
      updateParams.metric,
      updateParams.businessVerticalsCompany,
      updateParams.allBusinessVerticalTargets
    );
  };

  // Prepare filtered data for the business vertical chart
  let filteredBusinessVerticalData = {
    quarters: data?.trendAnalysis.businessVerticals?.quarters || [],
    actualValues: data?.trendAnalysis.businessVerticals?.actualValues || {},
    targetValues: data?.trendAnalysis.businessVerticals?.targetValues || {},
    industryValues: data?.trendAnalysis.businessVerticals?.industryValues || {},
    simulatedTargetValues: data?.trendAnalysis.businessVerticals?.simulatedTargetValues || {},
    simulatedActualValues: data?.trendAnalysis.businessVerticals?.simulatedActualValues || {},
    simulatedIndustryValues: data?.trendAnalysis.businessVerticals?.simulatedIndustryValues || {},
  };

  if (
    selectedBusinessVertical !== 'All Verticals' &&
    data?.businessVerticalTargets
  ) {
    const key = Object.keys(data.businessVerticalTargets).find(
      k => data.businessVerticalTargets[k].name === selectedBusinessVertical
    );
    if (key) {
      filteredBusinessVerticalData = {
        quarters: data.trendAnalysis.businessVerticals.quarters || [],
        actualValues: (data.trendAnalysis.businessVerticals.actualValues && data.trendAnalysis.businessVerticals.actualValues[key]) || [],
        targetValues: (data.trendAnalysis.businessVerticals.targetValues && data.trendAnalysis.businessVerticals.targetValues[key]) || [],
        industryValues: (data.trendAnalysis.businessVerticals.industryValues && data.trendAnalysis.businessVerticals.industryValues[key]) || [],
        simulatedTargetValues: (data.trendAnalysis.businessVerticals.simulatedTargetValues && data.trendAnalysis.businessVerticals.simulatedTargetValues[key]) || [],
        simulatedActualValues: (data.trendAnalysis.businessVerticals.simulatedActualValues && data.trendAnalysis.businessVerticals.simulatedActualValues[key]) || [],
        simulatedIndustryValues: (data.trendAnalysis.businessVerticals.simulatedIndustryValues && data.trendAnalysis.businessVerticals.simulatedIndustryValues[key]) || [],
      };
    }
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  const hasBusinessVerticalData = data.trendAnalysis.businessVerticals && 
    data.trendAnalysis.businessVerticals.quarters && 
    data.trendAnalysis.businessVerticals.quarters.length > 0 &&
    data.trendAnalysis.businessVerticals.actualValues &&
    data.trendAnalysis.businessVerticals.targetValues;

  // Calculate the total height for left and right panels
  // ScoreSummary: h-20 (80px), 2 charts: h-[230px] each, 2 gaps (gap-2): 16px
  const totalPanelHeight = 80 + 230 + 230 + 16; // = 556px

  return (
    <div className="w-full px-8 md:px-8 py-4 bg-white relative">
      {updating && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <div className="text-xl font-medium">Updating dashboard...</div>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <h1 className="text-[18px] font-bold" style={{ color: "#006666" }}>Dubai Holdings</h1>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <FilterDropdown 
              label="Period" 
              value={period} 
              options={periodOptions} 
              onChange={handlePeriodChange} 
            />
            <FilterDropdown 
              label="Metric" 
              value={metric} 
              options={metricOptions} 
              onChange={handleMetricChange} 
            />
            <FilterDropdown 
              label="Business Vertical" 
              value={businessVerticalsCompany} 
              options={businessVerticalsCompanyOptions} 
              onChange={handleBusinessVerticalsCompanyChange} 
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

        {/* Main Split Layout */}
        <div className="flex flex-col lg:flex-row gap-2 items-end" style={{ minHeight: `${totalPanelHeight}px` }}>
          {/* Left Side: 40% */}
          <div className="w-full lg:w-[40%] flex flex-col gap-2" style={{ height: `${totalPanelHeight}px` }}>
            {/* Score Card */}
            <div className="rounded-lg bg-white overflow-hidden flex flex-col border border-gray-200 h-20">
              <ScoreSummary
                scorePercent={data.overallScore.scorePercent}
                targetsRatio={data.overallScore.targetsRatio}
                targetDiff={data.overallScore.targetDiff}
                actual_target={data.overallScore.actual_target}
                metric={metric}
                period={period}
            previuos_quarter_actual={data.summary.actualValue}
          previuos_quarter_target={data.summary.targetValue}
              />
            </div>
            {/* Overall Trend Analysis */}
            <div className="rounded-lg bg-white overflow-hidden flex flex-col border border-gray-200 relative h-[230px]">
              <div className="w-full bg-gray-50 px-4 py-2 rounded mb-2 flex items-center">
                <span className="text-[14px] font-semibold text-gray-800">Overall Trend Analysis</span>
              </div>
              <div className="absolute top-1 right-1 z-10">
                <PeriodSummary
                  period={period}
                  metric={metric}
                  actualValue={data.summary_current.actualValue}
                  targetValue={data.summary_current.targetValue}
                  simulatedTarget={data.summary_current.newTarget}
                />
              </div>
              <TrendAnalysis
                title=""
                quarters={data.trendAnalysis.overall.quarters}
                actualValues={data.trendAnalysis.overall.actualValues}
                targetValues={data.trendAnalysis.overall.targetValues}
                simulatedTargetValues={data.trendAnalysis.overall.simulatedTargetValues}
                simulatedActualValues={data.trendAnalysis.overall.simulatedActualValues}
                selectedQuarter={period}
                metric={metric}
              />
            </div>
            {/* Business Vertical Trend Analysis */}
            <div className="rounded-lg bg-white overflow-hidden flex flex-col border border-gray-200 relative h-[230px]">
              <div className="w-full bg-gray-50 px-4 py-2 rounded mb-2 flex items-center">
                <span className="text-[14px] font-medium text-gray-800">
                  Business Vertical Trend Analysis
                  {businessVerticalsCompany && businessVerticalsCompany !== 'All Verticals' && (
                    <>: <span className="font-semibold">{businessVerticalsCompany}</span></>
                  )}
                </span>
              </div>
              <div className="absolute top-1 right-1 z-10">
                <PeriodSummary
                  period={period}
                  metric={metric}
                  actualValue={
                    filteredBusinessVerticalData.simulatedActualValues[
                      filteredBusinessVerticalData.quarters.indexOf(period)
                    ]
                  }
                  targetValue={
                    filteredBusinessVerticalData.targetValues[
                      filteredBusinessVerticalData.quarters.indexOf(period)
                    ]
                  }
                  simulatedTarget={
                    filteredBusinessVerticalData.simulatedTargetValues[
                      filteredBusinessVerticalData.quarters.indexOf(period)
                    ]
                  }
                  industryAverage={
                    filteredBusinessVerticalData.simulatedIndustryValues[
                      filteredBusinessVerticalData.quarters.indexOf(period)
                    ]
                  }
                />
              </div>
              <TrendAnalysis
                title=""
                quarters={filteredBusinessVerticalData.quarters}
                actualValues={filteredBusinessVerticalData.actualValues}
                targetValues={filteredBusinessVerticalData.targetValues}
                industryValues={filteredBusinessVerticalData.industryValues}
                simulatedTargetValues={filteredBusinessVerticalData.simulatedTargetValues}
                simulatedActualValues={filteredBusinessVerticalData.simulatedActualValues}
                simulatedIndustryValues={filteredBusinessVerticalData.simulatedIndustryValues}
                selectedQuarter={period}
                metric={metric}
                thresholds={
                  data.thresholds &&
                  data.thresholds[metric] &&
                  data.thresholds[metric][businessVerticalsCompany]
                    ? data.thresholds[metric][businessVerticalsCompany]
                    : null
                }
              />
            </div>
          </div>
          {/* Right Side: 60% */}
          <div className="w-full lg:w-[60%] relative flex flex-col justify-end" style={{ height: `${totalPanelHeight}px` }}>
            {/* Add SimulatedTargetSummary at the top right */}
            <div className="absolute top-2 right-2 z-10">
              {data.overallScore.scorePercent !== data.overallScore.actual_target && (
                <SimulatedTargetSummary
                  simulatedValue={data.overallScore.scorePercent}
                  predefinedValue={data.overallScore.actual_target}
                />
              )}
            </div>
            <div className="h-full flex flex-col">
              <BusinessVerticalRisk
                verticals={data.businessVerticalTargets}
                period={period}
                benchmark={benchmark}
                metric={metric}
                onDataUpdate={handleBusinessVerticalUpdate}
              />
            </div>
          </div>
        </div>
        <SharedLegend />
      </div>
    </div>
  );
};

export default Index;