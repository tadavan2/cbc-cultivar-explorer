# Chart System Architecture

## Overview
This chart system is designed to be **streamlined, scalable, and data-driven** to avoid code bloat as you expand to 9+ cultivars. It eliminates hardcoded data and CSS bloat by using:

1. **Data-driven architecture** - All chart data in one place
2. **CSV support** - Load data from spreadsheets
3. **Automatic cumulative calculation** - No manual data duplication
4. **Inline styles** - No global CSS bloat
5. **Reusable components** - Same chart works for all cultivars

## File Structure

```
data/
├── chartData.ts           # Core data structure & functions
├── csvParser.ts           # CSV loading & validation
├── sample-chart-data.csv  # Example CSV format
└── README_ChartSystem.md  # This documentation

components/
└── CultivarChart.tsx      # Reusable chart component
```

## Key Features

### 1. Automatic Cumulative Calculation
- **Yield**: Shows monthly bars + cumulative line (automatically calculated)
- **Firmness/Size/Appearance**: Shows monthly bars + trend averages (no cumulative)
- No need to manually calculate cumulative values in your data

### 2. CSV Data Loading
You can load chart data from CSV/Excel files:

```csv
cultivar,month,yield,firmness,size,appearance
alturas,Sep,1406,8.2,18.5,9.1
alturas,Oct,2413,8.5,19.1,9.3
...
```

### 3. Zero CSS Bloat
- All chart button styles are inline (no global CSS)
- Removed ~30 lines of `premium-button-inactive` CSS
- Self-contained styling within components

### 4. Scalable for All 9 Cultivars
```tsx
// Use for any cultivar - completely dynamic
<CultivarChart 
  cultivarId="alturas"
  comparisonCultivarId="portola" 
  height={400}
/>
```

## Usage Examples

### Adding New Cultivar Data
```typescript
// Option 1: Add to chartData.ts
export const cultivarChartData = {
  // ... existing cultivars
  'new-cultivar': {
    cultivarId: 'new-cultivar',
    cultivarName: 'New Cultivar',
    yield: [/* monthly data */],
    // ... other metrics
  }
};

// Option 2: Load from CSV
const csvData = await loadChartDataFromCSVFile('/data/cultivars.csv');
// Automatically processes all cultivars in the CSV
```

### Supported Metrics
Each metric has specific configuration:

- **Yield**: Cumulative line chart + monthly bars, Y-axis max: 3000
- **Firmness**: Trend line + monthly bars, Y-axis max: 10
- **Size**: Trend line + monthly bars, Y-axis max: 25  
- **Appearance**: Trend line + monthly bars, Y-axis max: 10

### CSV Loading
```typescript
// Validate CSV format
const validation = validateCSVData(csvContent);
if (!validation.isValid) {
  console.log('Errors:', validation.errors);
}

// Parse and load
const cultivarData = await parseChartDataFromCSV(csvContent);

// Merge with existing data
const mergedData = mergeChartData(existingData, cultivarData);
```

## Benefits for Your 9-Cultivar Template

1. **No Code Duplication**: Same component works for all cultivars
2. **Data Centralization**: All chart data in CSV files or data files
3. **Easy Updates**: Update CSV → instant chart updates
4. **Performance**: Removed 200+ lines of hardcoded chart components
5. **Maintainability**: One chart component vs. 9 separate implementations
6. **CSS Cleanup**: Eliminated chart-specific global CSS

## Migration From Old System

**Before**: 
- ~200 lines of hardcoded PerformanceChart component
- ~30 lines of global CSS for chart buttons  
- Hardcoded data for Alturas vs Portola only
- Manual cumulative calculations

**After**:
- Single reusable CultivarChart component
- Data-driven from CSV or data files
- Automatic cumulative calculations
- Inline styles (no CSS bloat)
- Supports unlimited cultivars

## Next Steps

1. **Add more cultivars** to `sample-chart-data.csv`
2. **Load real data** from your Excel/Google Sheets
3. **Customize metrics** in `chartMetrics` configuration
4. **Add new chart types** by extending the metric system

The system is ready to scale to all 9+ cultivars without any code bloat! 