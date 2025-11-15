/**
 * Chart Data and Comparison Logic
 * 
 * PURPOSE:
 * Provides chart data for performance comparison visualizations.
 * Handles both hardcoded data and dynamic CSV loading.
 * 
 * CHART METRICS:
 * - Yield: Cumulative line chart + monthly bars (Y-axis max: 3000, cultivar-specific overrides)
 * - Firmness: Trend line + monthly bars (Y-axis max: 10, cultivar-specific ranges)
 * - Size: Trend line + monthly bars (Y-axis max: 25)
 * - Appearance: Trend line + monthly bars (Y-axis max: 10)
 * 
 * DATA SOURCES:
 * 1. Hardcoded data: cultivarChartData object (fallback/default data)
 * 2. CSV files: public/data/csv/{cultivarId}.csv (preferred, loaded dynamically)
 * 
 * KEY FUNCTIONS:
 * - getChartData(): Main function to retrieve chart data for a cultivar/metric
 * - loadCultivarDataFromCSV(): Loads chart data from CSV file
 * - getChartDataFromCSV(): Wrapper that tries CSV first, falls back to hardcoded
 * - getDefaultComparisonCultivar(): Returns default comparison cultivar for each cultivar
 * - getAvailableCultivars(): Returns list of cultivars with chart data
 * 
 * COMPARISON LOGIC:
 * Each cultivar can be compared with specific other cultivars.
 * Default comparisons are defined per cultivar (e.g., alturas vs monterey).
 * 
 * CULTIVAR-SPECIFIC CONFIGURATIONS:
 * - cultivarYieldMax: Override Y-axis max for yield charts
 * - cultivarFirmnessRange: Custom firmness ranges for specific cultivars
 * 
 * RELATED FILES:
 * - components/CultivarChart.tsx: Chart visualization component
 * - components/CultivarDetailCardV2.tsx: Uses this for chart data
 * - public/data/csv/{id}.csv: CSV data source files
 * - data/csvParser.ts: CSV parsing utilities
 */

import { Cultivar } from '../types/cultivar';

// Chart data interfaces
export interface MonthlyDataPoint {
  month: string;
  value: number;
}

export interface CultivarChartData {
  cultivarId: string;
  cultivarName: string;
  yield: MonthlyDataPoint[];
  firmness: MonthlyDataPoint[];
  size: MonthlyDataPoint[];
  appearance: MonthlyDataPoint[];
}

export interface ChartMetric {
  id: string;
  label: string;
  unit: string;
  yAxisMax: number;
  showCumulative: boolean; // true for yield, false for others
  color: string;
  cultivarFirmnessRange?: [number, number]; // Optional firmness range for specific cultivars
}

// Chart data response interface
export interface ChartDataResponse {
  data: any[];
  metric: ChartMetric;
  primaryCultivar: string;
  comparisonCultivar?: string | null;
}

// Chart metrics configuration
export const chartMetrics: { [key: string]: ChartMetric } = {
  yield: {
    id: 'yield',
    label: 'Yield (grams/plant)',
    unit: 'grams/plant',
    yAxisMax: 1000,
    showCumulative: true,
    color: '#3B82F6'
  },
  firmness: {
    id: 'firmness',
    label: 'Firmness (lbs/force)',
    unit: 'lbs/force',
    yAxisMax: 2.0,
    showCumulative: false,
    color: '#10B981'
  },
  size: {
    id: 'size',
    label: 'Size (grams)',
    unit: 'grams',
    yAxisMax: 25,
    showCumulative: false,
    color: '#F59E0B'
  },
  appearance: {
    id: 'appearance',
    label: 'Appearance Score (1-10)',
    unit: 'score',
    yAxisMax: 5,
    showCumulative: false,
    color: '#8B5CF6'
  }
};

// Cultivar-specific yield y-axis maximums (overrides default 1000)
export const cultivarYieldMax: { [cultivarId: string]: number } = {
  'alturas': 1250,        // High yielding, peak values ~2400
  'castaic': 1100,        // High yielding short-day
  'carpinteria': 1000,    // Moderate-high yielding
  'adelanto': 900,       // Early high yielding 
  'belvedere': 900,       // Lower yielding but premium
  'alhambra': 500,        // Summer plant, lower yield
  'artesia': 1000,        // Moderate yielding
  'brisbane': 1000,
  'sweet-carolina': 500, // Moderate yielding
  // Others will use default 1000
};

// Cultivar-specific firmness y-axis ranges (overrides default [0.75, 1.75])
export const cultivarFirmnessRange: { [cultivarId: string]: [number, number] } = {
  'alturas': [1, 1.4],
  'castaic': [1.1, 1.5], 
  'carpinteria': [1, 1.5],
  'adelanto': [1.1, 1.6],
  'belvedere': [1, 1.6],
  'alhambra': [1, 1.4],
  'artesia': [1, 1.6],
  'brisbane': [1, 1.4],
  // Others will use default [0.75, 1.75]
};

// Base cultivar data - can be loaded from CSV/Excel
export const cultivarChartData: { [cultivarId: string]: CultivarChartData } = {
  alturas: {
    cultivarId: 'alturas',
    cultivarName: 'Alturas',
    yield: [
      { month: 'Sep', value: 1406 },
      { month: 'Oct', value: 2413 },
      { month: 'Nov', value: 671 },
      { month: 'Dec', value: 589 },
      { month: 'Jan', value: 223 }
    ],
    firmness: [
      { month: 'Sep', value: 8.2 },
      { month: 'Oct', value: 8.5 },
      { month: 'Nov', value: 8.3 },
      { month: 'Dec', value: 8.1 },
      { month: 'Jan', value: 8.0 }
    ],
    size: [
      { month: 'Sep', value: 18.5 },
      { month: 'Oct', value: 19.1 },
      { month: 'Nov', value: 18.8 },
      { month: 'Dec', value: 17.2 },
      { month: 'Jan', value: 17.5 }
    ],
    appearance: [
      { month: 'Sep', value: 9.1 },
      { month: 'Oct', value: 9.3 },
      { month: 'Nov', value: 9.0 },
      { month: 'Dec', value: 8.7 },
      { month: 'Jan', value: 8.8 }
    ]
  },
  debug: {
  cultivarId: 'debug',
  cultivarName: 'Debug',
  yield: [
    { month: 'Sep', value: 1406 },
    { month: 'Oct', value: 2413 },
    { month: 'Nov', value: 671 },
    { month: 'Dec', value: 589 },
    { month: 'Jan', value: 223 }
  ],
  firmness: [
    { month: 'Sep', value: 8.2 },
    { month: 'Oct', value: 8.5 },
    { month: 'Nov', value: 8.3 },
    { month: 'Dec', value: 8.1 },
    { month: 'Jan', value: 8.0 }
  ],
  size: [
    { month: 'Sep', value: 18.5 },
    { month: 'Oct', value: 19.1 },
    { month: 'Nov', value: 18.8 },
    { month: 'Dec', value: 17.2 },
    { month: 'Jan', value: 17.5 }
  ],
  appearance: [
    { month: 'Sep', value: 9.1 },
    { month: 'Oct', value: 9.3 },
    { month: 'Nov', value: 9.0 },
    { month: 'Dec', value: 8.7 },
    { month: 'Jan', value: 8.8 }
  ]
  }
};

// Default comparison cultivar
export const defaultComparisonCultivar = 'alturas';

// Utility function to calculate cumulative values for yield
function calculateCumulative(data: MonthlyDataPoint[]): MonthlyDataPoint[] {
  let cumulative = 0;
  return data.map(point => {
    cumulative += point.value;
    return { month: point.month, value: cumulative };
  });
}

// Function to get chart data for a specific cultivar and metric
export function getChartData(cultivarId: string, metricId: string, comparisonCultivarId?: string) {
  // Try exact match first
  let primaryData = cultivarChartData[cultivarId];
  
  // If no exact match, try lowercase
  if (!primaryData) {
    primaryData = cultivarChartData[cultivarId.toLowerCase()];
  }
  
  // If still no match, try to find a partial match
  if (!primaryData) {
    const availableKeys = Object.keys(cultivarChartData);
    const partialMatch = availableKeys.find(key => 
      key.includes(cultivarId.toLowerCase()) || cultivarId.toLowerCase().includes(key)
    );
    if (partialMatch) {
      primaryData = cultivarChartData[partialMatch];
    }
  }
  
  // Final fallback to 'alturas' if nothing found
  if (!primaryData) {
    primaryData = cultivarChartData['alturas'];
  }
  
  const comparisonData = comparisonCultivarId ? cultivarChartData[comparisonCultivarId] : null;
  let metric = chartMetrics[metricId];

  if (!primaryData || !metric) {
    return null;
  }
  
  // Apply cultivar-specific yield y-axis maximum if available
  if (metricId === 'yield' && cultivarYieldMax[cultivarId]) {
    metric = {
      ...metric,
      yAxisMax: cultivarYieldMax[cultivarId]
    };
  }
  
  // Store cultivar-specific firmness range for use in YAxis component
  if (metricId === 'firmness' && cultivarFirmnessRange[cultivarId]) {
    // Note: firmness range will be handled in the YAxis component, not via yAxisMax
    // We'll add a custom property to pass the range info
    metric = {
      ...metric,
      cultivarFirmnessRange: cultivarFirmnessRange[cultivarId]
    };
  }

  const primaryMetricData = primaryData[metricId as keyof Omit<CultivarChartData, 'cultivarId' | 'cultivarName'>];
  const comparisonMetricData = comparisonData ? 
    comparisonData[metricId as keyof Omit<CultivarChartData, 'cultivarId' | 'cultivarName'>] : null;

  // Build chart data array
  const chartData = primaryMetricData.map((point, index) => {
    const dataPoint: any = {
      month: point.month,
      [primaryData.cultivarName]: point.value
    };

    // Add comparison data if available
    if (comparisonMetricData && comparisonData) {
      const comparisonPoint = comparisonMetricData.find(cp => cp.month === point.month);
      if (comparisonPoint) {
        dataPoint[comparisonData.cultivarName] = comparisonPoint.value;
      }
    }

    // Add cumulative data for yield
    if (metric.showCumulative) {
      const primaryCumulative = calculateCumulative(primaryMetricData);
      const comparisonCumulative = comparisonMetricData ? calculateCumulative(comparisonMetricData) : null;
      
      dataPoint[`${primaryData.cultivarName}Cumulative`] = primaryCumulative[index].value;
      
      if (comparisonCumulative && comparisonData && comparisonCumulative[index]) {
        dataPoint[`${comparisonData.cultivarName}Cumulative`] = comparisonCumulative[index].value;
      }
    }

    return dataPoint;
  });

  return {
    data: chartData,
    metric,
    primaryCultivar: primaryData.cultivarName,
    comparisonCultivar: comparisonData?.cultivarName || null
  };
}

// Function to load data from CSV (for future implementation)
export async function loadChartDataFromCSV(csvFilePath: string): Promise<CultivarChartData[]> {
  // TODO: Implement CSV parsing
  // Expected CSV format:
  // cultivar,month,yield,firmness,size,appearance
  // alturas,Sep,1406,8.2,18.5,9.1
  // alturas,Oct,2413,8.5,19.1,9.3
  // ...
  return [];
}

// Function to get available cultivars for charts
export function getAvailableCultivars(): string[] {
  return Object.keys(cultivarChartData);
}

// Function to add new cultivar data (for dynamic loading)
export function addCultivarData(data: CultivarChartData) {
  cultivarChartData[data.cultivarId] = data;
}

// Dynamic CSV loading functions
export async function loadCultivarDataFromCSV(cultivarId: string): Promise<CultivarChartData | null> {
  try {
    const response = await fetch(`/data/csv/${cultivarId}.csv`);
    if (!response.ok) {
      return null;
    }
    
    const csvContent = await response.text();
    const lines = csvContent.trim().split('\n');
    const dataRows = lines.slice(1); // Skip header
    
    const cultivarData: CultivarChartData = {
      cultivarId,
      cultivarName: cultivarId.charAt(0).toUpperCase() + cultivarId.slice(1).replace(/-/g, ' '),
      yield: [],
      firmness: [],
      size: [],
      appearance: []
    };
    
    for (const row of dataRows) {
      const [cultivar, month, yield_value, firmness, size, appearance] = row.split(',');
      
      // Only add data points if the value is not empty/blank
      if (yield_value && yield_value.trim() !== '') {
      cultivarData.yield.push({ month: month.trim(), value: parseFloat(yield_value) });
      }
      
      if (firmness && firmness.trim() !== '') {
      cultivarData.firmness.push({ month: month.trim(), value: parseFloat(firmness) });
      }
      
      if (size && size.trim() !== '') {
      cultivarData.size.push({ month: month.trim(), value: parseFloat(size) });
      }
      
      if (appearance && appearance.trim() !== '') {
      cultivarData.appearance.push({ month: month.trim(), value: parseFloat(appearance) });
      }
    }
    
    return cultivarData;
  } catch (error) {
    console.error(`Error loading CSV for ${cultivarId}:`, error);
    return null;
  }
}

// Get available cultivars from CSV files
export function getAvailableCultivarsFromCSV(): string[] {
  return [
    // Day-Neutral (March-October)
    'alturas', 'san-andreas', 'cabrillo', 'monterey', 'brisbane', 'carpinteria', 'artesia',
    // Short-Day (December-May) 
    'adelanto', 'belvedere', 'castaic', 'fronteras',
    // Summer Plant Day-Neutral (October-January)
    'portola', 'alhambra'
  ];
}

// Get cultivar type and season info
export function getCultivarInfo(cultivarId: string): { type: string; season: string; months: string[] } {
  const dayNeutralCultivars = ['alturas', 'san-andreas', 'cabrillo', 'monterey', 'brisbane', 'carpinteria', 'artesia'];
  const shortDayCultivars = ['adelanto', 'belvedere', 'castaic', 'fronteras'];
  const summerPlantCultivars = ['portola', 'alhambra'];
  
  if (dayNeutralCultivars.includes(cultivarId)) {
    return { 
      type: 'Day-Neutral', 
      season: 'Spring-Fall',
      months: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
    };
  } else if (shortDayCultivars.includes(cultivarId)) {
    return { 
      type: 'Short-Day', 
      season: 'Winter-Spring',
      months: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']
    };
  } else if (summerPlantCultivars.includes(cultivarId)) {
    return { 
      type: 'Summer Plant Day-Neutral', 
      season: 'Fall-Winter',
      months: ['Oct', 'Nov', 'Dec', 'Jan']
    };
  }
  
  return { type: 'Unknown', season: 'Unknown', months: [] };
}

// Updated getChartData function to support CSV loading
export async function getChartDataFromCSV(
  cultivarId: string, 
  metric: string, 
  comparisonCultivarId?: string
): Promise<ChartDataResponse | null> {
  try {
    // Load primary cultivar data
    const primaryData = await loadCultivarDataFromCSV(cultivarId);
    if (!primaryData) {
      // Fallback to hardcoded data if CSV not available
      return getChartData(cultivarId, metric, comparisonCultivarId);
    }
    
    // Load comparison cultivar data if specified
    let comparisonData: CultivarChartData | null = null;
    if (comparisonCultivarId) {
      comparisonData = await loadCultivarDataFromCSV(comparisonCultivarId);
    }
    
    // Get metric configuration
    let metricConfig = chartMetrics[metric];
    if (!metricConfig) {
      console.error(`Unknown metric: ${metric}`);
      return null;
    }
    
    // Apply cultivar-specific yield y-axis maximum if available
    if (metric === 'yield' && cultivarYieldMax[cultivarId]) {
      metricConfig = {
        ...metricConfig,
        yAxisMax: cultivarYieldMax[cultivarId]
      };
    }
    
    // Store cultivar-specific firmness range for use in YAxis component
    if (metric === 'firmness' && cultivarFirmnessRange[cultivarId]) {
      // Note: firmness range will be handled in the YAxis component, not via yAxisMax
      // We'll add a custom property to pass the range info
      metricConfig = {
        ...metricConfig,
        cultivarFirmnessRange: cultivarFirmnessRange[cultivarId]
      };
    }
    
    // Get data for the selected metric
    const primaryMetricData = primaryData[metric as keyof CultivarChartData] as MonthlyDataPoint[];
    const comparisonMetricData = comparisonData?.[metric as keyof CultivarChartData] as MonthlyDataPoint[];
    
    // Build chart data array using the same logic as getChartData
    const chartData = primaryMetricData.map((point, index) => {
      const dataPoint: any = {
        month: point.month,
        [primaryData.cultivarName]: point.value
      };

      // Add comparison data if available
      if (comparisonMetricData && comparisonData) {
        const comparisonPoint = comparisonMetricData.find(cp => cp.month === point.month);
        if (comparisonPoint) {
          dataPoint[comparisonData.cultivarName] = comparisonPoint.value;
        }
      }

      // Add cumulative data for yield
      if (metricConfig.showCumulative) {
        const primaryCumulative = calculateCumulative(primaryMetricData);
        const comparisonCumulative = comparisonMetricData ? calculateCumulative(comparisonMetricData) : null;
        
        dataPoint[`${primaryData.cultivarName}Cumulative`] = primaryCumulative[index].value;
        
        if (comparisonCumulative && comparisonData && comparisonCumulative[index]) {
          dataPoint[`${comparisonData.cultivarName}Cumulative`] = comparisonCumulative[index].value;
        }
      }

      return dataPoint;
    });
    
    return {
      data: chartData,
      metric: metricConfig,
      primaryCultivar: primaryData.cultivarName,
      comparisonCultivar: comparisonData?.cultivarName
    };
    
  } catch (error) {
    console.error('Error loading chart data from CSV:', error);
    return getChartData(cultivarId, metric, comparisonCultivarId); // Fallback
  }
}

// Get smart comparison cultivars based on selected cultivar
export function getSmartComparisonCultivars(selectedCultivarId: string): string[] {
  const selectedInfo = getCultivarInfo(selectedCultivarId);
  const allCultivars = getAvailableCultivarsFromCSV();
  
  // Group cultivars by type for smart suggestions
  const dayNeutralCultivars = ['alturas', 'san-andreas', 'cabrillo', 'monterey', 'brisbane', 'carpinteria', 'artesia'];
  const shortDayCultivars = ['adelanto', 'belvedere', 'castaic', 'fronteras'];
  const summerPlantCultivars = ['portola', 'alhambra'];
  
  // Return cultivars of the same type, excluding the selected one
  if (dayNeutralCultivars.includes(selectedCultivarId)) {
    return dayNeutralCultivars.filter(id => id !== selectedCultivarId);
  } else if (shortDayCultivars.includes(selectedCultivarId)) {
    return shortDayCultivars.filter(id => id !== selectedCultivarId);
  } else if (summerPlantCultivars.includes(selectedCultivarId)) {
    return summerPlantCultivars.filter(id => id !== selectedCultivarId);
  }
  
  // Fallback: return all except selected
  return allCultivars.filter(id => id !== selectedCultivarId);
}

// Get default comparison cultivar for a given primary cultivar
export function getDefaultComparisonCultivar(primaryCultivarId: string): string | undefined {
  const comparisons = getSmartComparisonCultivars(primaryCultivarId);
  
  // Smart defaults based on cultivar type
  if (comparisons.includes('portola')) return 'portola'; // Good general comparison
  if (comparisons.includes('alturas')) return 'alturas'; // Flagship DN
  if (comparisons.includes('adelanto')) return 'adelanto'; // Strong SD
  
  // Return first available comparison or undefined
  return comparisons[0];
} 