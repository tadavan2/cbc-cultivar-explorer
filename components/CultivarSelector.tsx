import React from 'react';
import { getAvailableCultivarsFromCSV, getCultivarInfo, getSmartComparisonCultivars } from '../data/chartData';
import { useTranslation } from './LanguageContext';

interface CultivarSelectorProps {
  selectedCultivar: string;
  onCultivarChange: (cultivarId: string) => void;
  comparisonCultivar?: string;
  onComparisonChange?: (cultivarId: string | undefined) => void;
}

const CultivarSelector: React.FC<CultivarSelectorProps> = ({
  selectedCultivar,
  onCultivarChange,
  comparisonCultivar,
  onComparisonChange
}) => {
  const availableCultivars = getAvailableCultivarsFromCSV();
  const smartComparisonCultivars = getSmartComparisonCultivars(selectedCultivar);
  const { t } = useTranslation();
  
  // Group cultivars by type
  const cultivarsByType = availableCultivars.reduce((groups, cultivarId) => {
    const info = getCultivarInfo(cultivarId);
    if (!groups[info.type]) {
      groups[info.type] = [];
    }
    groups[info.type].push({ id: cultivarId, info });
    return groups;
  }, {} as { [type: string]: { id: string; info: { type: string; season: string } }[] });

  // Get the label for the selected cultivar
  const selectedCultivarLabel = selectedCultivar
    ? selectedCultivar.charAt(0).toUpperCase() + selectedCultivar.slice(1).replace(/-/g, ' ')
    : '';

  const buttonStyle = {
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '8px',
    border: '1px solid rgba(156, 163, 175, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-body, system-ui)',
    background: 'rgba(31, 41, 55, 0.8)',
    color: '#9CA3AF',
    backdropFilter: 'blur(10px)',
  };

  const selectedButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
  };

  const comparisonButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
  };

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)',
        backdropFilter: 'blur(10px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
      }}
    >
      {/* Header with Reset button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ 
          color: '#ffffff', 
          margin: '0',
          fontSize: '18px',
          fontFamily: 'var(--font-body, system-ui)'
        }}>
          Select Cultivars
        </h3>
        
        {/* Reset Button */}
        {(comparisonCultivar || onComparisonChange) && (
          <button
            onClick={() => {
              if (onComparisonChange) {
                onComparisonChange(undefined);
              }
            }}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: 'var(--font-body, system-ui)',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
            }}
          >
            Reset
          </button>
        )}
      </div>
      
      {Object.entries(cultivarsByType).map(([type, cultivars]) => (
        <div key={type} style={{ marginBottom: '20px' }}>
          <h4 style={{ 
            color: '#9CA3AF', 
            marginBottom: '8px', 
            fontSize: '14px',
            fontFamily: 'var(--font-body, system-ui)'
          }}>
            {type} ({cultivars[0].info.season})
          </h4>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px',
            marginBottom: '12px'
          }}>
            {cultivars.map(({ id, info }) => (
              <button
                key={id}
                onClick={() => onCultivarChange(id)}
                style={selectedCultivar === id ? selectedButtonStyle : buttonStyle}
                title={`${id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ')} - ${info.season}`}
              >
                {id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ')}
              </button>
            ))}
          </div>
          
          {/* Only show comparison options for the selected cultivar's type */}
          {onComparisonChange && cultivars.some(c => c.id === selectedCultivar) && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ 
                color: '#6B7280', 
                fontSize: '12px', 
                marginBottom: '4px',
                fontFamily: 'var(--font-body, system-ui)'
              }}>
                {t('compare').replace('{cultivar}', selectedCultivarLabel)}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button
                  onClick={() => onComparisonChange(undefined)}
                  style={!comparisonCultivar ? selectedButtonStyle : buttonStyle}
                >
                  {t('none')}
                </button>
                {smartComparisonCultivars.map((id) => (
                  <button
                    key={`compare-${id}`}
                    onClick={() => onComparisonChange(id)}
                    style={comparisonCultivar === id ? comparisonButtonStyle : buttonStyle}
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CultivarSelector; 