import React, { useState, useEffect } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { getChartDataFromCSV, chartMetrics, ChartDataResponse } from '../data/chartData';

// Type for Recharts tick props
interface TickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string | number;
  };
}

interface CultivarChartProps {
  cultivarId: string;
  comparisonCultivarId?: string;
  height?: number;
}

const CultivarChart: React.FC<CultivarChartProps> = ({ 
  cultivarId, 
  comparisonCultivarId,
  height = 400 
}) => {
  const [selectedMetric, setSelectedMetric] = useState('yield');
  const [chartData, setChartData] = useState<ChartDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load chart data when cultivar or metric changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getChartDataFromCSV(cultivarId, selectedMetric, comparisonCultivarId);
        setChartData(data);
      } catch (err) {
        setError('Failed to load chart data');
        console.error('Chart loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [cultivarId, selectedMetric, comparisonCultivarId]);
  
  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#9CA3AF',
        background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)',
        backdropFilter: 'blur(10px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid rgba(34, 197, 94, 0.3)',
            borderTop: '3px solid #22c55e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#EF4444',
        background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)',
        backdropFilter: 'blur(10px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
      }}>
        <p>{error || 'Chart temporarily unavailable'}</p>
      </div>
    );
  }

  const { data, metric, primaryCultivar, comparisonCultivar } = chartData;

  // Inline button styles to avoid global CSS bloat
  const buttonBaseStyle = isMobile
    ? {
        padding: '5px 10px',
        fontSize: '12px',
        fontWeight: '500',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'var(--font-body, system-ui)',
      }
    : {
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '600',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'var(--font-body, system-ui)',
      };

  const activeButtonStyle = {
    ...buttonBaseStyle,
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
  };

  const inactiveButtonStyle = {
    ...buttonBaseStyle,
    background: 'rgba(75, 85, 99, 0.6)',
    color: '#9CA3AF',
    border: '1px solid rgba(156, 163, 175, 0.2)',
  };

  const inactiveButtonHoverStyle = {
    ...inactiveButtonStyle,
    background: 'rgba(75, 85, 99, 0.8)',
    color: '#D1D5DB',
  };

  const RotatedYAxisTick = (props: TickProps) => {
    const { x, y, payload } = props;
    return (
      <text
        x={x}
        y={y}
        dy={0}
        dx={12}
        textAnchor="end"
        fill="#9CA3AF"
        fontSize={12}
        fontFamily="var(--font-body, system-ui)"
        transform={`rotate(-90, ${x}, ${y})`}
      >
        {payload?.value}
      </text>
    );
  };

  return (
    <div 
      style={{
        background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)',
        backdropFilter: 'blur(10px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        padding: '12px 12px 2px 0',
      }}
    >
      {/* Metric Selector Buttons */}
      <div
        ref={(el) => {
          if (el) {
            // Add mouse wheel horizontal scrolling support
            const handleWheel = (e: WheelEvent) => {
              if (e.deltaY !== 0) {
                e.preventDefault();
                el.scrollLeft += e.deltaY;
              }
            };
            el.addEventListener('wheel', handleWheel, { passive: false });
            return () => el.removeEventListener('wheel', handleWheel);
          }
        }}
        style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          whiteSpace: 'nowrap',
          marginBottom: '8px',
        }}
      >
        <div style={{ display: 'inline-flex', gap: isMobile ? '6px' : '8px', justifyContent: 'flex-end', minWidth: 0 }}>
          {Object.keys(chartMetrics).map((metricKey, idx) => (
            <button
              key={metricKey}
              onClick={() => setSelectedMetric(metricKey)}
              style={{
                ...(selectedMetric === metricKey ? activeButtonStyle : inactiveButtonStyle),
                marginLeft: idx === 0 ? (isMobile ? '10px' : '18px') : 0
              }}
              onMouseEnter={(e) => {
                if (selectedMetric !== metricKey) {
                  Object.assign((e.target as HTMLButtonElement).style, inactiveButtonHoverStyle);
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMetric !== metricKey) {
                  Object.assign((e.target as HTMLButtonElement).style, inactiveButtonStyle);
                }
              }}
            >
              {chartMetrics[metricKey].label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div style={{ width: '100%', height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'var(--font-body, system-ui)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            />
            
            <YAxis
              tick={<RotatedYAxisTick />}
              label={{ 
                value: metric.label, 
                angle: -90, 
                position: 'outsideLeft',
                style: { 
                  textAnchor: 'middle', 
                  fill: '#9CA3AF', 
                  fontSize: '12px',
                  fontFamily: 'var(--font-body, system-ui)'
                }
              }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              domain={
                selectedMetric === 'firmness' ? 
                  ((metric as any)?.cultivarFirmnessRange || [0.75, 1.75]) : 
                selectedMetric === 'appearance' ? [0, 5] : 
                selectedMetric === 'size' ? [15, 60] : 
                [0, metric.yAxisMax]
              }
              ticks={
                selectedMetric === 'firmness' ? 
                  (((metric as any)?.cultivarFirmnessRange) ? 
                    [(metric as any).cultivarFirmnessRange[0], 
                     ((metric as any).cultivarFirmnessRange[0] + (metric as any).cultivarFirmnessRange[1]) / 2, 
                     (metric as any).cultivarFirmnessRange[1]] :
                    [0.75, 1.0, 1.25, 1.5, 1.75]) :
                selectedMetric === 'appearance' ? [0, 1, 2, 3, 4, 5] : 
                undefined
              }
            />
            
            <Legend 
              wrapperStyle={{ color: '#9CA3AF', fontFamily: 'var(--font-body, system-ui)' }}
              layout="horizontal"
              verticalAlign="top"
              align="right"
              iconType="line"
              content={(props) => {
                const { payload } = props;
                return (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      right: '10px', 
                      background: 'rgba(17, 24, 39, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-body, system-ui)'
                    }}
                  >
                    {payload?.map((entry, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: index < payload.length - 1 ? '4px' : '0' }}>
                        <div 
                          style={{ 
                            width: '12px', 
                            height: '12px', 
                            backgroundColor: entry.color, 
                            marginRight: '6px',
                            borderRadius: '2px'
                          }} 
                        />
                        <span style={{ color: '#9CA3AF', fontFamily: 'var(--font-body, system-ui)' }}>{entry.value}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            
            {/* Main Chart - Bar for yield, Line for others */}
            {selectedMetric === 'yield' ? (
              // Bar chart for yield
              <Bar 
                dataKey={primaryCultivar} 
                fill="#5B7FDB" 
                name={primaryCultivar}
                radius={[4, 4, 0, 0]}
              />
            ) : (
              // Line chart for firmness, size, appearance
              <Line 
                type="monotone" 
                dataKey={primaryCultivar} 
                stroke="#5B7FDB" 
                strokeWidth={4}
                dot={{ fill: '#5B7FDB', strokeWidth: 3, r: 6 }}
                name={primaryCultivar}
                connectNulls={false}
                activeDot={{ r: 8, stroke: '#5B7FDB', strokeWidth: 2 }}
              />
            )}
            
            {/* Comparison Chart - Bar for yield, Line for others */}
            {comparisonCultivar && (
              selectedMetric === 'yield' ? (
                // Bar chart for yield comparison
                <Bar 
                  dataKey={comparisonCultivar} 
                  fill="#8BA574" 
                  name={comparisonCultivar}
                  radius={[4, 4, 0, 0]}
                />
              ) : (
                // Line chart for firmness, size, appearance comparison
                <Line 
                  type="monotone" 
                  dataKey={comparisonCultivar} 
                  stroke="#8BA574" 
                  strokeWidth={4}
                  dot={{ fill: '#8BA574', strokeWidth: 3, r: 6 }}
                  name={comparisonCultivar}
                  connectNulls={false}
                  activeDot={{ r: 8, stroke: '#8BA574', strokeWidth: 2 }}
                />
              )
            )}
            
            {/* Cumulative lines - ONLY for yield */}
            {metric.showCumulative && (
              <>
                <Line 
                  type="monotone" 
                  dataKey={`${primaryCultivar}Cumulative`} 
                  stroke="#3B82F6" 
                  strokeWidth={4}
                  dot={{ fill: '#3B82F6', strokeWidth: 3, r: 8 }}
                  name={`${primaryCultivar} (Cumulative)`}
                  connectNulls={false}
                  activeDot={{ r: 10, stroke: '#3B82F6', strokeWidth: 2 }}
                />
                
                {comparisonCultivar && (
                  <Line 
                    type="monotone" 
                    dataKey={`${comparisonCultivar}Cumulative`} 
                    stroke="#10B981" 
                    strokeWidth={4}
                    dot={{ fill: '#10B981', strokeWidth: 3, r: 8 }}
                    name={`${comparisonCultivar} (Cumulative)`}
                    connectNulls={false}
                    activeDot={{ r: 10, stroke: '#10B981', strokeWidth: 2 }}
                  />
                )}
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CultivarChart; 