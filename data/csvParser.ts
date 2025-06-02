import { CultivarChartData, MonthlyDataPoint } from './chartData';

// CSV Parser for chart data
export async function parseChartDataFromCSV(csvContent: string): Promise<{ [cultivarId: string]: CultivarChartData }> {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  // Expected headers: cultivar, month, yield, firmness, size, appearance
  const dataRows = lines.slice(1);
  const cultivarMap: { [key: string]: CultivarChartData } = {};
  
  for (const row of dataRows) {
    const values = row.split(',');
    const cultivarId = values[0].toLowerCase().trim();
    const month = values[1].trim();
    const yield_value = parseFloat(values[2]);
    const firmness = parseFloat(values[3]);
    const size = parseFloat(values[4]);
    const appearance = parseFloat(values[5]);
    
    // Initialize cultivar data if not exists
    if (!cultivarMap[cultivarId]) {
      cultivarMap[cultivarId] = {
        cultivarId,
        cultivarName: cultivarId.charAt(0).toUpperCase() + cultivarId.slice(1).replace(/-/g, ' '),
        yield: [],
        firmness: [],
        size: [],
        appearance: []
      };
    }
    
    // Add data points
    cultivarMap[cultivarId].yield.push({ month, value: yield_value });
    cultivarMap[cultivarId].firmness.push({ month, value: firmness });
    cultivarMap[cultivarId].size.push({ month, value: size });
    cultivarMap[cultivarId].appearance.push({ month, value: appearance });
  }
  
  return cultivarMap;
}

// Function to load CSV from file path
export async function loadChartDataFromCSVFile(filePath: string): Promise<{ [cultivarId: string]: CultivarChartData }> {
  try {
    // In browser environment, you'd use fetch
    const response = await fetch(filePath);
    const csvContent = await response.text();
    return parseChartDataFromCSV(csvContent);
  } catch (error) {
    console.error('Error loading CSV file:', error);
    return {};
  }
}

// Function to merge CSV data with existing data
export function mergeChartData(
  existingData: { [cultivarId: string]: CultivarChartData },
  newData: { [cultivarId: string]: CultivarChartData }
): { [cultivarId: string]: CultivarChartData } {
  return { ...existingData, ...newData };
}

// Utility function to validate CSV data structure
export function validateCSVData(csvContent: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const lines = csvContent.trim().split('\n');
  
  if (lines.length < 2) {
    errors.push('CSV must have at least a header and one data row');
    return { isValid: false, errors };
  }
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const expectedHeaders = ['cultivar', 'month', 'yield', 'firmness', 'size', 'appearance'];
  
  for (const expectedHeader of expectedHeaders) {
    if (!headers.includes(expectedHeader)) {
      errors.push(`Missing required header: ${expectedHeader}`);
    }
  }
  
  // Validate data rows
  const dataRows = lines.slice(1);
  for (let i = 0; i < dataRows.length; i++) {
    const values = dataRows[i].split(',');
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 2} has ${values.length} columns, expected ${headers.length}`);
    }
    
    // Validate numeric values for yield, firmness, size, appearance
    for (let j = 2; j < values.length; j++) {
      if (isNaN(parseFloat(values[j]))) {
        errors.push(`Row ${i + 2}, column ${headers[j]}: "${values[j]}" is not a valid number`);
      }
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

// Function to convert Excel/Google Sheets data to CSV format
export function processSpreadsheetData(spreadsheetData: any[][]): string {
  return spreadsheetData.map(row => row.join(',')).join('\n');
} 