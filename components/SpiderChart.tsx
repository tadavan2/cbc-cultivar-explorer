import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from './LanguageContext';

interface SpiderChartProps {
  cultivarId: string;
  comparisonCultivarId?: string;
  height?: number;
}

interface SpiderTraitData {
  trait: string;
  fullMark: number;
  [key: string]: number | string; // Dynamic cultivar values
}

const SpiderChart: React.FC<SpiderChartProps> = ({
  cultivarId,
  comparisonCultivarId,
  height = 300
}) => {
  const { t } = useTranslation();
  const [spiderData, setSpiderData] = useState<SpiderTraitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load spider trait data from CSV
  useEffect(() => {
    const loadSpiderData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/data/csv/spider_traits.csv');
        const csvText = await response.text();
        
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        
        // Parse CSV data
        const csvData: { [cultivarId: string]: { [trait: string]: number } } = {};
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          const cultivar = values[0];
          csvData[cultivar] = {};
          
          for (let j = 1; j < headers.length; j++) {
            csvData[cultivar][headers[j].trim()] = parseFloat(values[j]);
          }
        }
        
        // Transform data for radar chart
        const traitNames = headers.slice(1).map(h => h.trim()); // Remove 'cultivar_id' and trim whitespace
        const radarData: SpiderTraitData[] = traitNames.map(trait => {
          const translated = t(trait);
          const label = translated !== trait ? translated : trait.charAt(0).toUpperCase() + trait.slice(1).replace('_', ' ');
          const dataPoint: SpiderTraitData = {
            trait: label,
            fullMark: 5,
          };
          
          // Add primary cultivar data
          if (csvData[cultivarId]) {
            dataPoint[cultivarId] = csvData[cultivarId][trait] || 0;
          }
          
          // Add comparison cultivar data
          if (comparisonCultivarId && csvData[comparisonCultivarId]) {
            dataPoint[comparisonCultivarId] = csvData[comparisonCultivarId][trait] || 0;
          }
          
          return dataPoint;
        });
        
        setSpiderData(radarData);
      } catch (err) {
        setError('Failed to load spider chart data');
        console.error('Spider chart loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSpiderData();
  }, [cultivarId, comparisonCultivarId, t]);

  if (loading) {
    return (
      <div style={{
        padding: '20px',
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
            width: '30px',
            height: '30px',
            border: '3px solid rgba(34, 197, 94, 0.3)',
            borderTop: '3px solid #22c55e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }} />
          <p style={{ fontSize: '12px' }}>Loading traits...</p>
        </div>
      </div>
    );
  }

  if (error || spiderData.length === 0) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#EF4444',
        background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)',
        backdropFilter: 'blur(10px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ fontSize: '12px' }}>{error || 'Trait data unavailable'}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)',
        backdropFilter: 'blur(10px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        padding: '4px',
        marginTop: '16px'
      }}
    >
      {/* Chart Container */}
      <div style={{ width: '100%', height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={spiderData} margin={{ top: 1, right: 1, bottom: 1, left: 1 }}>
            <PolarGrid 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth={2}
            />
            <PolarAngleAxis 
              dataKey="trait"
              tick={{ 
                fill: '#FFFFFF', 
                fontSize: 13, 
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: '500',
                textAnchor: 'middle'
              }} 
              tickSize={15}
              className="capitalize"
              style={{ userSelect: 'none' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 5]} 
              tick={{ 
                fill: '#9CA3AF', 
                fontSize: 10, 
                fontFamily: 'var(--font-body, system-ui)' 
              }}
              tickCount={6}
            />
            
            {/* Primary cultivar radar */}
            <Radar
              name={cultivarId.charAt(0).toUpperCase() + cultivarId.slice(1)}
              dataKey={cultivarId}
              stroke="#5B7FDB"
              fill="rgba(91, 127, 219, 0.1)"
              strokeWidth={4}
              dot={{ fill: '#5B7FDB', strokeWidth: 2, r: 4 }}
            />
            
            {/* Comparison cultivar radar */}
            {comparisonCultivarId && (
              <Radar
                name={comparisonCultivarId.charAt(0).toUpperCase() + comparisonCultivarId.slice(1)}
                dataKey={comparisonCultivarId}
                stroke="#8BA574"
                fill="rgba(139, 165, 116, 0.1)"
                strokeWidth={4}
                dot={{ fill: '#8BA574', strokeWidth: 2, r: 4 }}
              />
            )}
            
            {/* Legend */}
            <Legend
              wrapperStyle={{ 
                color: '#9CA3AF', 
                fontFamily: 'var(--font-body, system-ui)',
                fontSize: '14px'
              }}
              layout="horizontal"
              verticalAlign="top"
              align="right"
              iconType="line"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpiderChart; 