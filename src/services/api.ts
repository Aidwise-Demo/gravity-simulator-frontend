import axios from 'axios';
// 
const API_URL = 'http://localhost:7000/api/gravity/simulation';
// const API_URL = 'https://api.gravity-simulator.aidwise.in/api/gravity/simulation';

// Options for filters
export const periodOptions = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025", "Q2 2025"];
export const benchmarkOptions = ["Similar Competitors", "Industry Average", "Global Standards", "Regional Leaders"];
export const metricOptions = ["EBITDA", "Revenue", "EBITDA Margin"];
export const businessVerticalsCompanyOptions = ["Asset Management", "Community Management", "Entertainment", "Hospitality", "Land Estates", "Real Estate"];

export interface SimulationData {
  company: string;
  period: string;
  industryBenchmark: string;
  metric: string;
  businessVerticalsCompany?: string; // Added businessVerticalsCompany
  summary: {
    overallValue: number;
    actualValue: number;
    targetValue: number;
    achievementStatus: string;
    newTarget?: number; // Added from the Index component
  };
  summary_current?: {  // Added from the Index component
    overallValue: number;
    actualValue: number;
    targetValue: number;
    achievementStatus: string;
    newTarget?: number;
  };
  overallScore: {
    scorePercent: number;
    targetsRatio: string;
    targetDiff?: number; // Added from the Index component
  };
  trendAnalysis: {
    overall: {
      quarters: string[];
      actualValues: number[];
      targetValues: number[];
      simulatedTargetValues?: number[]; // Added from the Index component
      simulatedActualValues?: number[]; // Added from the Index component
    };
    businessVerticals: {
      quarters: string[];
      actualValues: number[];
      targetValues: number[];
      industryValues?: number[];
      simulatedTargetValues?: number[]; // Added from the Index component
      simulatedActualValues?: number[]; // Added from the Index component
      simulatedIndustryValues?: number[]; // Added from the Index component
    };
  };
  businessVerticalTargets: Array<{
    name: string;
    predictedTarget: number;
    current: number;
    currentStar: number;
    industryAverage: number;
    cutoff: number;
    value: number;
    status: string;
  }>;
}

// Interface for business vertical target with change flag
interface BusinessVerticalTargetWithFlag {
  value: number;
  changed: number; // 1 for changed, 0 for unchanged
}

export const fetchSimulationData = async (
  period: string = "Q1 2025", 
  benchmark: string = "Similar Competitors", 
  metric: string = "EBITDA",
  businessVerticalsCompany: string = "Real Estate", // Added default parameter
  allBusinessVerticalTargets?: Record<string, number | BusinessVerticalTargetWithFlag>
): Promise<SimulationData> => {
  try {
    // Build request payload
    const payload: any = {
      company: "Dubai Holdings",
      period,
      industryBenchmark: benchmark,
      metric,
      businessVerticalsCompany // Added to payload
    };
    
    // Add all business vertical targets if provided
    if (allBusinessVerticalTargets) {
      // Prepare business verticals with their targets and change flags
      const businessVerticals = {};
      const changedVertical = Object.keys(allBusinessVerticalTargets).find(
        key => typeof allBusinessVerticalTargets[key] === 'object' && 
        (allBusinessVerticalTargets[key] as BusinessVerticalTargetWithFlag).changed === 1
      );
      
      // Format the business verticals for the API
      Object.entries(allBusinessVerticalTargets).forEach(([name, targetInfo]) => {
        if (typeof targetInfo === 'number') {
          // If it's just a number, determine if it's the changed one based on changedVertical
          businessVerticals[name] = {
            value: targetInfo,
            changed: name === changedVertical ? 1 : 0
          };
        } else {
          // It's already an object with value and changed flag
          businessVerticals[name] = targetInfo;
        }
      });
      
      Object.assign(payload, { businessVerticals });
    }
    
    console.log('Sending payload to API:', payload);
    const response = await axios.post(API_URL, payload);
    
    return response.data;
  } catch (error) {
    console.error("Failed to fetch simulation data. Using mock data instead.", error);
    // Note: mock data implementation would be needed here
    throw error;
  }
};

// New function to handle target change and reload data
export const handleTargetChange = async (
  allBusinessVerticalTargets: Record<string, BusinessVerticalTargetWithFlag>,
  currentPeriod: string,
  currentBenchmark: string,
  currentMetric: string,
  currentBusinessVerticalsCompany: string, // Added parameter
  setData: (data: SimulationData) => void
): Promise<void> => {
  try {
    const updatedData = await fetchSimulationData(
      currentPeriod,
      currentBenchmark,
      currentMetric,
      currentBusinessVerticalsCompany, // Added to function call
      allBusinessVerticalTargets
    );
    
    setData(updatedData);
  } catch (error) {
    console.error("Failed to update target values", error);
  }
};
