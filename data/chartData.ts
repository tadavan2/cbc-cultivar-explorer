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
    label: 'Yield (kg/hectare)',
    unit: 'kg/ha',
    yAxisMax: 3000,
    showCumulative: true,
    color: '#3B82F6'
  },
  firmness: {
    id: 'firmness',
    label: 'Firmness (N)',
    unit: 'N',
    yAxisMax: 10,
    showCumulative: false,
    color: '#10B981'
  },
  size: {
    id: 'size',
    label: 'Berry Size (g)',
    unit: 'g',
    yAxisMax: 25,
    showCumulative: false,
    color: '#F59E0B'
  },
  appearance: {
    id: 'appearance',
    label: 'Appearance Score (1-10)',
    unit: 'score',
    yAxisMax: 10,
    showCumulative: false,
    color: '#8B5CF6'
  }
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
  portola: {
    cultivarId: 'portola',
    cultivarName: 'Portola',
    yield: [
      { month: 'Sep', value: 1147 },
      { month: 'Oct', value: 1440 },
      { month: 'Nov', value: 494 },
      { month: 'Dec', value: 277 },
      { month: 'Jan', value: 127 }
    ],
    firmness: [
      { month: 'Sep', value: 7.8 },
      { month: 'Oct', value: 8.1 },
      { month: 'Nov', value: 7.9 },
      { month: 'Dec', value: 7.6 },
      { month: 'Jan', value: 7.5 }
    ],
    size: [
      { month: 'Sep', value: 16.2 },
      { month: 'Oct', value: 17.8 },
      { month: 'Nov', value: 16.9 },
      { month: 'Dec', value: 15.1 },
      { month: 'Jan', value: 15.8 }
    ],
    appearance: [
      { month: 'Sep', value: 8.4 },
      { month: 'Oct', value: 8.8 },
      { month: 'Nov', value: 8.5 },
      { month: 'Dec', value: 8.1 },
      { month: 'Jan', value: 8.2 }
    ]
  },
  alhambra: {
    cultivarId: 'alhambra',
    cultivarName: 'Alhambra',
    yield: [
      { month: 'Sep', value: 1200 },
      { month: 'Oct', value: 1800 },
      { month: 'Nov', value: 580 },
      { month: 'Dec', value: 520 },
      { month: 'Jan', value: 180 }
    ],
    firmness: [
      { month: 'Sep', value: 7.9 },
      { month: 'Oct', value: 8.2 },
      { month: 'Nov', value: 8.0 },
      { month: 'Dec', value: 7.8 },
      { month: 'Jan', value: 7.7 }
    ],
    size: [
      { month: 'Sep', value: 17.2 },
      { month: 'Oct', value: 18.5 },
      { month: 'Nov', value: 17.8 },
      { month: 'Dec', value: 16.5 },
      { month: 'Jan', value: 16.8 }
    ],
    appearance: [
      { month: 'Sep', value: 8.8 },
      { month: 'Oct', value: 9.1 },
      { month: 'Nov', value: 8.9 },
      { month: 'Dec', value: 8.6 },
      { month: 'Jan', value: 8.4 }
    ]
  },
  artesia: {
    cultivarId: 'artesia',
    cultivarName: 'Artesia',
    yield: [
      { month: 'Mar', value: 310 },
      { month: 'Apr', value: 1485 },
      { month: 'May', value: 2940 },
      { month: 'Jun', value: 3647 },
      { month: 'Jul', value: 2719 },
      { month: 'Aug', value: 2412 },
      { month: 'Sep', value: 609 },
      { month: 'Oct', value: 610 }
    ],
    firmness: [
      { month: 'Mar', value: 8.1 },
      { month: 'Apr', value: 8.4 },
      { month: 'May', value: 8.7 },
      { month: 'Jun', value: 8.8 },
      { month: 'Jul', value: 8.6 },
      { month: 'Aug', value: 8.3 },
      { month: 'Sep', value: 8.1 },
      { month: 'Oct', value: 7.9 }
    ],
    size: [
      { month: 'Mar', value: 16.8 },
      { month: 'Apr', value: 18.2 },
      { month: 'May', value: 19.8 },
      { month: 'Jun', value: 20.1 },
      { month: 'Jul', value: 19.5 },
      { month: 'Aug', value: 18.9 },
      { month: 'Sep', value: 17.8 },
      { month: 'Oct', value: 17.2 }
    ],
    appearance: [
      { month: 'Mar', value: 8.5 },
      { month: 'Apr', value: 9.0 },
      { month: 'May', value: 9.3 },
      { month: 'Jun', value: 9.4 },
      { month: 'Jul', value: 9.2 },
      { month: 'Aug', value: 8.9 },
      { month: 'Sep', value: 8.7 },
      { month: 'Oct', value: 8.4 }
    ]
  },
  brisbane: {
    cultivarId: 'brisbane',
    cultivarName: 'Brisbane',
    yield: [
      { month: 'Mar', value: 280 },
      { month: 'Apr', value: 1420 },
      { month: 'May', value: 2890 },
      { month: 'Jun', value: 3520 },
      { month: 'Jul', value: 2680 },
      { month: 'Aug', value: 2350 },
      { month: 'Sep', value: 1180 },
      { month: 'Oct', value: 580 }
    ],
    firmness: [
      { month: 'Mar', value: 8.2 },
      { month: 'Apr', value: 8.5 },
      { month: 'May', value: 8.8 },
      { month: 'Jun', value: 8.9 },
      { month: 'Jul', value: 8.7 },
      { month: 'Aug', value: 8.4 },
      { month: 'Sep', value: 8.2 },
      { month: 'Oct', value: 8.0 }
    ],
    size: [
      { month: 'Mar', value: 17.1 },
      { month: 'Apr', value: 18.5 },
      { month: 'May', value: 19.9 },
      { month: 'Jun', value: 20.2 },
      { month: 'Jul', value: 19.6 },
      { month: 'Aug', value: 19.0 },
      { month: 'Sep', value: 18.1 },
      { month: 'Oct', value: 17.5 }
    ],
    appearance: [
      { month: 'Mar', value: 8.6 },
      { month: 'Apr', value: 9.1 },
      { month: 'May', value: 9.4 },
      { month: 'Jun', value: 9.5 },
      { month: 'Jul', value: 9.3 },
      { month: 'Aug', value: 9.0 },
      { month: 'Sep', value: 8.8 },
      { month: 'Oct', value: 8.5 }
    ]
  },
  adelanto: {
    cultivarId: 'adelanto',
    cultivarName: 'Adelanto',
    yield: [
      { month: 'Sep', value: 1320 },
      { month: 'Oct', value: 2180 },
      { month: 'Nov', value: 625 },
      { month: 'Dec', value: 548 },
      { month: 'Jan', value: 198 }
    ],
    firmness: [
      { month: 'Sep', value: 8.4 },
      { month: 'Oct', value: 8.7 },
      { month: 'Nov', value: 8.5 },
      { month: 'Dec', value: 8.3 },
      { month: 'Jan', value: 8.2 }
    ],
    size: [
      { month: 'Sep', value: 17.8 },
      { month: 'Oct', value: 18.9 },
      { month: 'Nov', value: 18.2 },
      { month: 'Dec', value: 16.8 },
      { month: 'Jan', value: 17.1 }
    ],
    appearance: [
      { month: 'Sep', value: 9.2 },
      { month: 'Oct', value: 9.4 },
      { month: 'Nov', value: 9.1 },
      { month: 'Dec', value: 8.9 },
      { month: 'Jan', value: 8.7 }
    ]
  },
  belvedere: {
    cultivarId: 'belvedere',
    cultivarName: 'Belvedere',
    yield: [
      { month: 'Sep', value: 1250 },
      { month: 'Oct', value: 2100 },
      { month: 'Nov', value: 590 },
      { month: 'Dec', value: 510 },
      { month: 'Jan', value: 180 }
    ],
    firmness: [
      { month: 'Sep', value: 8.3 },
      { month: 'Oct', value: 8.6 },
      { month: 'Nov', value: 8.4 },
      { month: 'Dec', value: 8.2 },
      { month: 'Jan', value: 8.1 }
    ],
    size: [
      { month: 'Sep', value: 18.1 },
      { month: 'Oct', value: 19.2 },
      { month: 'Nov', value: 18.6 },
      { month: 'Dec', value: 17.4 },
      { month: 'Jan', value: 17.7 }
    ],
    appearance: [
      { month: 'Sep', value: 9.0 },
      { month: 'Oct', value: 9.2 },
      { month: 'Nov', value: 8.9 },
      { month: 'Dec', value: 8.6 },
      { month: 'Jan', value: 8.5 }
    ]
  },
  castaic: {
    cultivarId: 'castaic',
    cultivarName: 'Castaic',
    yield: [
      { month: 'Sep', value: 1480 },
      { month: 'Oct', value: 2650 },
      { month: 'Nov', value: 720 },
      { month: 'Dec', value: 640 },
      { month: 'Jan', value: 250 }
    ],
    firmness: [
      { month: 'Sep', value: 8.1 },
      { month: 'Oct', value: 8.4 },
      { month: 'Nov', value: 8.2 },
      { month: 'Dec', value: 8.0 },
      { month: 'Jan', value: 7.9 }
    ],
    size: [
      { month: 'Sep', value: 19.2 },
      { month: 'Oct', value: 20.1 },
      { month: 'Nov', value: 19.5 },
      { month: 'Dec', value: 18.3 },
      { month: 'Jan', value: 18.8 }
    ],
    appearance: [
      { month: 'Sep', value: 8.7 },
      { month: 'Oct', value: 9.0 },
      { month: 'Nov', value: 8.8 },
      { month: 'Dec', value: 8.5 },
      { month: 'Jan', value: 8.3 }
    ]
  },
  carpinteria: {
    cultivarId: 'carpinteria',
    cultivarName: 'Carpinteria',
    yield: [
      { month: 'Mar', value: 890 },
      { month: 'Apr', value: 1650 },
      { month: 'May', value: 2180 },
      { month: 'Jun', value: 1720 },
      { month: 'Jul', value: 1450 },
      { month: 'Aug', value: 1250 },
      { month: 'Sep', value: 1100 },
      { month: 'Oct', value: 980 }
    ],
    firmness: [
      { month: 'Mar', value: 8.4 },
      { month: 'Apr', value: 8.6 },
      { month: 'May', value: 8.5 },
      { month: 'Jun', value: 8.3 },
      { month: 'Jul', value: 8.2 },
      { month: 'Aug', value: 8.1 },
      { month: 'Sep', value: 8.0 },
      { month: 'Oct', value: 8.2 }
    ],
    size: [
      { month: 'Mar', value: 17.8 },
      { month: 'Apr', value: 18.9 },
      { month: 'May', value: 19.2 },
      { month: 'Jun', value: 18.6 },
      { month: 'Jul', value: 18.3 },
      { month: 'Aug', value: 18.0 },
      { month: 'Sep', value: 17.9 },
      { month: 'Oct', value: 18.1 }
    ],
    appearance: [
      { month: 'Mar', value: 8.9 },
      { month: 'Apr', value: 9.1 },
      { month: 'May', value: 9.0 },
      { month: 'Jun', value: 8.8 },
      { month: 'Jul', value: 8.7 },
      { month: 'Aug', value: 8.6 },
      { month: 'Sep', value: 8.5 },
      { month: 'Oct', value: 8.7 }
    ]
  },
  fronteras: {
    cultivarId: 'fronteras',
    cultivarName: 'Fronteras',
    yield: [
      { month: 'Sep', value: 1200 },
      { month: 'Oct', value: 2100 },
      { month: 'Nov', value: 580 },
      { month: 'Dec', value: 490 },
      { month: 'Jan', value: 170 }
    ],
    firmness: [
      { month: 'Sep', value: 8.0 },
      { month: 'Oct', value: 8.3 },
      { month: 'Nov', value: 8.1 },
      { month: 'Dec', value: 7.9 },
      { month: 'Jan', value: 7.8 }
    ],
    size: [
      { month: 'Sep', value: 17.5 },
      { month: 'Oct', value: 18.7 },
      { month: 'Nov', value: 18.1 },
      { month: 'Dec', value: 16.9 },
      { month: 'Jan', value: 17.2 }
    ],
    appearance: [
      { month: 'Sep', value: 8.4 },
      { month: 'Oct', value: 8.7 },
      { month: 'Nov', value: 8.5 },
      { month: 'Dec', value: 8.2 },
      { month: 'Jan', value: 8.0 }
    ]
  },
  'sweet-carolina': {
    cultivarId: 'sweet-carolina',
    cultivarName: 'Sweet Carolina',
    yield: [
      { month: 'Mar', value: 420 },
      { month: 'Apr', value: 1850 },
      { month: 'May', value: 3200 },
      { month: 'Jun', value: 3840 },
      { month: 'Jul', value: 2950 },
      { month: 'Aug', value: 2580 },
      { month: 'Sep', value: 1420 },
      { month: 'Oct', value: 890 }
    ],
    firmness: [
      { month: 'Mar', value: 8.3 },
      { month: 'Apr', value: 8.6 },
      { month: 'May', value: 8.9 },
      { month: 'Jun', value: 9.0 },
      { month: 'Jul', value: 8.8 },
      { month: 'Aug', value: 8.5 },
      { month: 'Sep', value: 8.3 },
      { month: 'Oct', value: 8.1 }
    ],
    size: [
      { month: 'Mar', value: 24.7 },
      { month: 'Apr', value: 30.2 },
      { month: 'May', value: 32.1 },
      { month: 'Jun', value: 30.8 },
      { month: 'Jul', value: 28.9 },
      { month: 'Aug', value: 25.2 },
      { month: 'Sep', value: 22.3 },
      { month: 'Oct', value: 21.8 }
    ],
    appearance: [
      { month: 'Mar', value: 8.8 },
      { month: 'Apr', value: 9.2 },
      { month: 'May', value: 9.4 },
      { month: 'Jun', value: 9.3 },
      { month: 'Jul', value: 9.1 },
      { month: 'Aug', value: 8.9 },
      { month: 'Sep', value: 8.7 },
      { month: 'Oct', value: 8.5 }
    ]
  },
  'ruby-june': {
    cultivarId: 'ruby-june',
    cultivarName: 'Ruby June',
    yield: [
      { month: 'Mar', value: 380 },
      { month: 'Apr', value: 1650 },
      { month: 'May', value: 2890 },
      { month: 'Jun', value: 3420 },
      { month: 'Jul', value: 2680 },
      { month: 'Aug', value: 2320 },
      { month: 'Sep', value: 1290 },
      { month: 'Oct', value: 780 }
    ],
    firmness: [
      { month: 'Mar', value: 8.1 },
      { month: 'Apr', value: 8.4 },
      { month: 'May', value: 8.7 },
      { month: 'Jun', value: 8.8 },
      { month: 'Jul', value: 8.6 },
      { month: 'Aug', value: 8.3 },
      { month: 'Sep', value: 8.1 },
      { month: 'Oct', value: 7.9 }
    ],
    size: [
      { month: 'Mar', value: 24.1 },
      { month: 'Apr', value: 28.5 },
      { month: 'May', value: 30.1 },
      { month: 'Jun', value: 28.8 },
      { month: 'Jul', value: 26.9 },
      { month: 'Aug', value: 24.2 },
      { month: 'Sep', value: 21.8 },
      { month: 'Oct', value: 20.9 }
    ],
    appearance: [
      { month: 'Mar', value: 8.3 },
      { month: 'Apr', value: 8.7 },
      { month: 'May', value: 8.9 },
      { month: 'Jun', value: 8.8 },
      { month: 'Jul', value: 8.6 },
      { month: 'Aug', value: 8.4 },
      { month: 'Sep', value: 8.2 },
      { month: 'Oct', value: 8.0 }
    ]
  }
};

// Add more cultivar data for common IDs
cultivarChartData['debug'] = {
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
};

// Default comparison cultivar
export const defaultComparisonCultivar = 'portola';

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
      console.log(`Chart: Using partial match "${partialMatch}" for cultivar "${cultivarId}"`);
    }
  }
  
  // Final fallback to 'alturas' if nothing found
  if (!primaryData) {
    primaryData = cultivarChartData['alturas'];
    console.log(`Chart: No data found for "${cultivarId}", falling back to "alturas"`);
  }
  
  const comparisonData = comparisonCultivarId ? cultivarChartData[comparisonCultivarId] : null;
  const metric = chartMetrics[metricId];

  if (!primaryData || !metric) {
    return null;
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
      dataPoint[comparisonData.cultivarName] = comparisonMetricData[index]?.value || 0;
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
  
  console.log('CSV loading not yet implemented');
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
      console.warn(`CSV file not found for cultivar: ${cultivarId}`);
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
      
      cultivarData.yield.push({ month: month.trim(), value: parseFloat(yield_value) });
      cultivarData.firmness.push({ month: month.trim(), value: parseFloat(firmness) });
      cultivarData.size.push({ month: month.trim(), value: parseFloat(size) });
      cultivarData.appearance.push({ month: month.trim(), value: parseFloat(appearance) });
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
    const metricConfig = chartMetrics[metric];
    if (!metricConfig) {
      console.error(`Unknown metric: ${metric}`);
      return null;
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
        // Safety check for array bounds - comparison cultivar might have different months
        dataPoint[comparisonData.cultivarName] = comparisonMetricData[index]?.value || 0;
      }

      // Add cumulative data for yield
      if (metricConfig.showCumulative) {
        const primaryCumulative = calculateCumulative(primaryMetricData);
        const comparisonCumulative = comparisonMetricData ? calculateCumulative(comparisonMetricData) : null;
        
        dataPoint[`${primaryData.cultivarName}Cumulative`] = primaryCumulative[index].value;
        
        // Safety check for comparison cumulative data - arrays might have different lengths
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