import { FilterState } from '../types/cultivar';
import { allFlowerTypes, allAttributes, allAttribute2, cultivars } from '../data/cultivars';
import { useTranslation } from './LanguageContext';

interface CultivarFilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

// Helper function to determine filter button theme class based on trait type
const getFilterThemeClass = (value: string, category: string): string => {
  // Flower Type color mapping
  if (category === 'flowerType') {
    if (value === 'DN') return 'filter-theme-day-neutral'; // Day-Neutral = Yellow
    if (value === 'SD') return 'filter-theme-short-day'; // Short-Day = Orange
  }
  
  // Planting Season color mapping
  if (value === 'fall plant') return 'filter-theme-fall-plant'; // Burnt orange/fall colors
  if (value === 'summer plant') return 'filter-theme-day-neutral'; // Same yellow as day-neutral
  if (value === 'eastern fall plant') return 'filter-theme-cold-tolerant'; // Same icy blue as Sweet Carolina
  
  // Trait color mapping
  if (value === 'organic') return 'filter-theme-organic'; // Green
  if (value === 'cold tolerant') return 'filter-theme-cold-tolerant'; // Icy Blue
  if (value === 'excellent flavor') return 'filter-theme-excellent-flavor'; // Red
  if (value === 'high yields') return 'filter-theme-day-neutral'; // Same yellow
  if (value === 'ultra early') return 'filter-theme-short-day'; // Same orange
  if (value === 'premium quality') return 'filter-theme-premium-quality'; // Special golden/sparkly
  
  // Disease resistance - use yellow theme
  if (value.includes('resistant')) return 'filter-theme-day-neutral';
  
  // Default to glass for everything else
  return 'filter-button-glass';
};

export default function CultivarFilterPanel({ filters, onFiltersChange }: CultivarFilterPanelProps) {
  const { t } = useTranslation();
  const toggleFilter = (category: keyof FilterState, value: string) => {
    // Special handling for disease resistance that might be in either category
    const diseaseResistances = ['fusarium resistant', 'macrophomina resistant'] as const;
    
    if (diseaseResistances.includes(value as typeof diseaseResistances[number])) {
      // For disease resistance, check which category actually has this attribute
      // in the currently available cultivars
      const availableOptions = getAvailableOptions();
      const inAttributes = availableOptions.attributes.includes(value);
      
      // Use the category where it's actually available, preferring attributes
      const actualCategory = inAttributes ? 'attributes' : 'attribute2';
      
      const currentValues = filters[actualCategory];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      onFiltersChange({
        ...filters,
        [actualCategory]: newValues
      });
    } else {
      // Normal toggle logic for other filters
      const currentValues = filters[category];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      onFiltersChange({
        ...filters,
        [category]: newValues
      });
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      flowerType: [],
      marketType: [],
      attributes: [],
      attribute2: []
    });
  };

  const getAttributeIcon = () => {
    // Icons removed for cleaner UI
    return '';
  };

  const getAttributeLabel = (attribute: string): string => {
    if (attribute === 'fusarium resistant') return t('fusarium');
    if (attribute === 'macrophomina resistant') return t('macrophomina');
    if (attribute === 'premium quality') return t('premiumQuality');
    if (attribute === 'excellent flavor') return t('excellentFlavor');
    if (attribute === 'ultra early') return t('ultraEarly');
    if (attribute === 'organic') return t('organic');
    if (attribute === 'cold tolerant') return t('coldTolerant');
    // Default: Capitalize first letter
    return String(attribute).charAt(0).toUpperCase() + String(attribute).slice(1);
  };

  // Dynamic filtering: Get available options based on current selections
  const getAvailableOptions = () => {
    // Start with all cultivars
    let filteredCultivars = cultivars;
    
    // Apply current filters using AND logic
    if (filters.flowerType.length > 0) {
      filteredCultivars = filteredCultivars.filter(c => filters.flowerType.includes(c.flowerType));
    }
    if (filters.marketType.length > 0) {
      filteredCultivars = filteredCultivars.filter(c => filters.marketType.includes(c.marketType));
    }
    if (filters.attributes.length > 0) {
      filteredCultivars = filteredCultivars.filter(c => filters.attributes.every(attr => c.attributes.includes(attr) || c.attribute2.includes(attr)));
    }
    if (filters.attribute2.length > 0) {
      filteredCultivars = filteredCultivars.filter(c => filters.attribute2.every(attr => c.attributes.includes(attr) || c.attribute2.includes(attr)));
    }
    
    // Extract available options from filtered cultivars
    return {
      flowerTypes: Array.from(new Set(filteredCultivars.map(c => c.flowerType))),
      marketTypes: Array.from(new Set(filteredCultivars.map(c => c.marketType))),
      attributes: Array.from(new Set(filteredCultivars.flatMap(c => c.attributes))),
      attribute2: Array.from(new Set(filteredCultivars.flatMap(c => c.attribute2).filter(Boolean)))
    };
  };

  const availableOptions = getAvailableOptions();
  const activeFilterCount = Object.values(filters).flat().length;

  // Categorize attributes into logical groups
  const diseaseResistances = ['fusarium resistant', 'macrophomina resistant'] as const;
  const plantingSeasons = ['fall plant', 'summer plant', 'eastern fall plant'] as const;
  
  // Deduplicate traits by combining and removing duplicates
  const allTraits = allAttributes.filter(attr => !diseaseResistances.includes(attr as (typeof diseaseResistances)[number]))
    .concat(allAttribute2.filter(attr => !diseaseResistances.includes(attr as (typeof diseaseResistances)[number])));
  const traits: string[] = Array.from(new Set(allTraits)); // Remove duplicates

  // Filter group items to only show available options
  const filterGroups = [
    {
      title: t('flowerType'),
      items: allFlowerTypes.filter(ft => availableOptions.flowerTypes.includes(ft))
        .map(flowerType => ({
          category: 'flowerType' as keyof FilterState,
          value: flowerType,
          label: flowerType === 'DN' ? t('dayNeutral') : t('shortDay'),
          icon: '',
          isActive: filters.flowerType.includes(flowerType),
          isAvailable: availableOptions.flowerTypes.includes(flowerType)
        }))
    },
    {
      title: t('diseaseResistance'),
      items: diseaseResistances
        .filter(attr => availableOptions.attributes.includes(attr) || availableOptions.attribute2.includes(attr))
        .map(attribute => {
          const inAttributes = availableOptions.attributes.includes(attribute);
          const inAttribute2 = availableOptions.attribute2.includes(attribute);
          const category = inAttributes ? 'attributes' : 'attribute2';
          const isAvailable = inAttributes || inAttribute2;
          return {
            category: category as keyof FilterState,
            value: attribute,
            label: getAttributeLabel(attribute),
            icon: '',
            isActive: filters.attributes.includes(attribute) || filters.attribute2.includes(attribute),
            isAvailable: isAvailable
          };
        })
    },
    {
      title: t('plantingSeason'),
      items: plantingSeasons
        .filter(mt => availableOptions.marketTypes.includes(mt))
        .map(marketType => ({
          category: 'marketType' as keyof FilterState,
          value: marketType,
          label:
            marketType === 'fall plant' ? t('fallPlant') :
            marketType === 'summer plant' ? t('summerPlant') :
            marketType === 'eastern fall plant' ? t('easternFallPlant') :
            String(marketType).charAt(0).toUpperCase() + String(marketType).slice(1),
          icon: '',
          isActive: filters.marketType.includes(marketType),
          isAvailable: availableOptions.marketTypes.includes(marketType)
        }))
    },
    {
      title: t('traits'),
      items: traits
        .map((trait: string) => ({
          category: (availableOptions.attributes.includes(trait) ? 'attributes' : 'attribute2') as keyof FilterState,
          value: trait,
          label: getAttributeLabel(trait),
          icon: '',
          isActive: filters.attributes.includes(trait) || filters.attribute2.includes(trait),
          isAvailable: availableOptions.attributes.includes(trait) || availableOptions.attribute2.includes(trait)
        }))
    }
  ].filter(group => group.items.length > 0); // Only show groups that have items

  return (
    <div className="h-full flex flex-col" style={{padding: '1px', background: 'rgba(255, 255, 255, 0.9)'}}>
      
      {/* Clear All Button - At Top with separation */}
      {activeFilterCount > 0 && (
        <div className="p-6 border-b border-white/10">
          <div className="text-center">
            <button
              onClick={clearAllFilters}
              className="premium-button text-sm font-semibold"
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: 'var(--font-body)',
                marginTop: '16px',
                marginBottom: '8px'
              }}
            >
              {t('clearAll')} ({activeFilterCount})
            </button>
          </div>
        </div>
      )}
      
      {/* Filter Groups - Full height with top padding */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden" style={{paddingTop: '16px', paddingLeft: '6px', paddingRight: '6px'}}>
        <div className="flex flex-col" style={{paddingBottom: '20px'}}>
          {filterGroups.map((group, groupIndex) => (
            <div key={group.title} className="mb-6" style={{overflow: 'visible'}}>
              {/* Group Header */}
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
                paddingLeft: '4px',
                fontFamily: 'var(--font-body)'
              }}>
                {group.title}
              </div>
              
              {/* Group Items */}
              <div className="flex flex-col mb-4" style={{gap: '6px', overflow: 'visible', paddingTop: '4px', paddingBottom: '4px'}}>
                {group.items.map((option) => (
                  <button
                    key={`${option.category}-${option.value}`}
                    onClick={() => toggleFilter(option.category, option.value)}
                    disabled={!option.isAvailable && !option.isActive}
                    className={`
                      w-full ${getFilterThemeClass(option.value, option.category)} text-left transition-all duration-300 whitespace-nowrap
                      ${option.isActive ? 'selected-glass' : ''}
                      ${!option.isAvailable && !option.isActive ? 'opacity-40 cursor-not-allowed' : ''}
                    `}
                    style={{zIndex: 10, position: 'relative'}}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-semibold flex-1">{option.label}</span>
                      {option.isActive && (
                        <span className="w-3 h-3 bg-green-400 rounded-full pulse-glow-glass shadow-lg"></span>
                      )}
                    </div>
                    {/* Glass overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-xl pointer-events-none"></div>
                  </button>
                ))}
              </div>
              
              {/* Group Separator */}
              {groupIndex < filterGroups.length - 1 && (
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                  margin: '8px 0 16px 0'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 