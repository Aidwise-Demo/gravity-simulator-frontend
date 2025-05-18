// Dashboard/index.tsx
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
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-white relative">
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
          <h1 className="text-2xl font-bold text-blue-500"> Dubai Holdings</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <FilterDropdown 
              label="Period" 
              value={period} 
              options={periodOptions} 
              onChange={handlePeriodChange} 
            />
            <FilterDropdown 
              label="Industry Benchmark" 
              value={benchmark} 
              options={benchmarkOptions} 
              onChange={handleBenchmarkChange} 
            />
            <FilterDropdown 
              label="Metric" 
              value={metric} 
              options={metricOptions} 
              onChange={handleMetricChange} 
            />
          </div>
        </div>
        
        {/* Company Name */}
        {/* <h2 className="text-blue-600 font-medium text-lg">{data.company}</h2> */}
        
        {/* Upper Section - Gauge and Trend Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gauge Chart */}
          <div>
            <GaugeChart 
              actualValue={data.summary.actualValue}
              targetValue={data.summary.targetValue}
              achievementStatus={data.summary.achievementStatus}
              overallValue={data.summary.overallValue}
              metric={metric}
            />
          </div>
          
          {/* Overall Trend Analysis */}
          <div>
            <TrendAnalysis 
              title="Overall Trend Analysis"
              quarters={data.trendAnalysis.overall.quarters}
              actualValues={data.trendAnalysis.overall.actualValues}
              targetValues={data.trendAnalysis.overall.targetValues}
            />
          </div>
          
          {/* Business Vertical Trend Analysis */}
          {hasBusinessVerticalData && (
            <div>
              <TrendAnalysis 
                title="Business Vertical Trend Analysis"
                quarters={data.trendAnalysis.businessVerticals.quarters}
                actualValues={data.trendAnalysis.businessVerticals.actualValues}
                targetValues={data.trendAnalysis.businessVerticals.targetValues}
                industryValues={data.trendAnalysis.businessVerticals.industryValues}
              />
            </div>
          )}
        </div>
        
        {/* Lower Section - Business Vertical Risk & Score Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;