
import axios from 'axios';

const API_URL = 'http://localhost:7000/api/gravity/simulation';

// Mock data in case the API fails
const mockData = {
  "company": "Dubai Holdings",
  "period": "Q1 2025",
  "industryBenchmark": "Similar Competitors",
  "metric": "EBITDA",
  "summary": {
    "overallValue": 1028400000,
    "actualValue": 772300000,
    "targetValue": 392100000,
    "achievementStatus": "197%"
  },
  "overallScore": {
    "scorePercent": 76,
    "targetsRatio": "2/3"
  },
  "trendAnalysis": {
    "overall": {
      "quarters": ["Q1-24", "Q2-24", "Q3-24", "Q4-24", "Q1-25"],
      "actualValues": [7000, 7200, 6900, 7500, 7723],
      "targetValues": [6800, 7400, 7600, 7900, 8000]
    },
    "businessVerticals": {
      "quarters": ["Q1-24", "Q2-24", "Q3-24", "Q4-24", "Q1-25"],
      "actual": [890, 910, 880, 920, 937],
      "target": [950, 940, 930, 940, 960]
    }
  },
  "businessVerticalTargets": [
    {
      "name": "Real Estate",
      "predictedTarget": 937,
      "current": 200,
      "currentStar": 250,
      "industryAverage": 950,
      "cutoff": 975,
      "value": 937,
      "status": "Off-Track"
    },
    {
      "name": "Investments",
      "predictedTarget": 845,
      "current": 210,
      "currentStar": 260,
      "industryAverage": 940,
      "cutoff": 970,
      "value": 845,
      "status": "Off-Track"
    },
    {
      "name": "Entertainment",
      "predictedTarget": 767,
      "current": 190,
      "currentStar": 230,
      "industryAverage": 930,
      "cutoff": 965,
      "value": 767,
      "status": "Off-Track"
    },
    {
      "name": "Ejadah",
      "predictedTarget": 243,
      "current": 100,
      "currentStar": 120,
      "industryAverage": 400,
      "cutoff": 450,
      "value": 243,
      "status": "Off-Track"
    },
    {
      "name": "Land Estates",
      "predictedTarget": 848,
      "current": 200,
      "currentStar": 240,
      "industryAverage": 920,
      "cutoff": 960,
      "value": 848,
      "status": "Off-Track"
    },
    {
      "name": "Asset Management",
      "predictedTarget": 912,
      "current": 300,
      "currentStar": 350,
      "industryAverage": 900,
      "cutoff": 950,
      "value": 912,
      "status": "On-Track"
    },
    {
      "name": "Hospitality",
      "predictedTarget": 812,
      "current": 280,
      "currentStar": 320,
      "industryAverage": 800,
      "cutoff": 850,
      "value": 812,
      "status": "On-Track"
    }
  ]
};

// Options for filters
export const periodOptions = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025", "Q2 2025"];
export const benchmarkOptions = ["Similar Competitors", "Industry Average", "Global Standards", "Regional Leaders"];
export const metricOptions = ["EBITDA", "Revenue", "EBITDA Margin"];

export interface SimulationData {
  company: string;
  period: string;
  industryBenchmark: string;
  metric: string;
  summary: {
    overallValue: number;
    actualValue: number;
    targetValue: number;
    achievementStatus: string;
  };
  overallScore: {
    scorePercent: number;
    targetsRatio: string;
  };
  trendAnalysis: {
    overall: {
      quarters: string[];
      actualValues: number[];
      targetValues: number[];
    };
    businessVerticals: {
      quarters: string[];
      actual: number[];
      target: number[];
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

export const fetchSimulationData = async (
  period: string = "Q1 2025", 
  benchmark: string = "Similar Competitors", 
  metric: string = "EBITDA",
  businessVertical?: string,
  targetValue?: number
): Promise<SimulationData> => {
  try {
    // Build request payload with optional business vertical and target
    const payload = {
      company: "Dubai Holdings",
      period,
      industryBenchmark: benchmark,
      metric
    };
    
    // Add business vertical and target if provided
    if (businessVertical && targetValue !== undefined) {
      Object.assign(payload, {
        businessVertical,
        targetValue
      });
    }
    
    const response = await axios.post(API_URL, payload);
    
    return response.data;
  } catch (error) {
    console.error("Failed to fetch simulation data. Using mock data instead.", error);
    return mockData as SimulationData;
  }
};

// Format large numbers to millions (M) remains the same...

// New function to handle target change and reload data
export const handleTargetChange = async (
  businessVertical: string,
  newTarget: number,
  currentPeriod: string,
  currentBenchmark: string,
  currentMetric: string,
  setData: (data: SimulationData) => void
): Promise<void> => {
  try {
    const updatedData = await fetchSimulationData(
      currentPeriod,
      currentBenchmark,
      currentMetric,
      businessVertical,
      newTarget
    );
    
    setData(updatedData);
  } catch (error) {
    console.error("Failed to update target value", error);
  }
};