import { FilterState } from '../types/cultivar';
import { allFlowerTypes, allAttributes, allAttribute2, cultivars } from '../data/cultivars';

interface CultivarFilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function CultivarFilterPanel({ filters, onFiltersChange }: CultivarFilterPanelProps) {
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

  // Dynamic filtering: Get available options based on current selections
  const getAvailableOptions = () => {
    // Start with all cultivars
    let filteredCultivars = cultivars;
    
    // Apply current filters
    if (filters.flowerType.length > 0) {
      filteredCultivars = filteredCultivars.filter(c => filters.flowerType.includes(c.flowerType));
    }
    if (filters.marketType.length > 0) {
      filteredCultivars = filteredCultivars.filter(c => filters.marketType.includes(c.marketType));
    }
    if (filters.attributes.length > 0) {
      filteredCultivars = filteredCultivars.filter(c => filters.attributes.some(attr => c.attributes.includes(attr)));
    }
    if (filters.attribute2.length > 0) {
      filteredCultivars = filteredCultivars.filter(c => filters.attribute2.some(attr => c.attribute2.includes(attr)));
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
  const traits = Array.from(new Set(allTraits)); // Remove duplicates

  // Filter group items to only show available options
  const filterGroups = [
    {
      title: 'Flower Type',
      items: allFlowerTypes.filter(ft => availableOptions.flowerTypes.includes(ft))
        .map(flowerType => ({
          category: 'flowerType' as keyof FilterState,
          value: flowerType,
          label: flowerType === 'DN' ? 'Day-Neutral' : 'Short-Day',
          icon: '',
          isActive: filters.flowerType.includes(flowerType),
          isAvailable: availableOptions.flowerTypes.includes(flowerType)
        }))
    },
    {
      title: 'Disease Resistance',
      items: diseaseResistances
        .filter(attr => availableOptions.attributes.includes(attr) || availableOptions.attribute2.includes(attr))
        .map(attribute => {
          // For disease resistance, we need to check both arrays since some cultivars
          // have the same resistance in different categories
          const inAttributes = availableOptions.attributes.includes(attribute);
          const inAttribute2 = availableOptions.attribute2.includes(attribute);
          
          // If it's available in both, prefer attributes for consistency
          // If only in one, use that one
          const category = inAttributes ? 'attributes' : 'attribute2';
          const isAvailable = inAttributes || inAttribute2;
          
          return {
            category: category as keyof FilterState,
            value: attribute,
            label: attribute.charAt(0).toUpperCase() + attribute.slice(1),
            icon: getAttributeIcon(attribute),
            isActive: filters.attributes.includes(attribute) || filters.attribute2.includes(attribute),
            isAvailable: isAvailable
          };
        })
    },
    {
      title: 'Planting Season',
      items: plantingSeasons
        .filter(mt => availableOptions.marketTypes.includes(mt))
        .map(marketType => ({
          category: 'marketType' as keyof FilterState,
          value: marketType,
          label: marketType.charAt(0).toUpperCase() + marketType.slice(1),
          icon: getAttributeIcon(marketType),
          isActive: filters.marketType.includes(marketType),
          isAvailable: availableOptions.marketTypes.includes(marketType)
        }))
    },
    {
      title: 'Traits',
      items: traits
        .filter(trait => {
          const isInAttributes = allAttributes.includes(trait);
          const availableSet = isInAttributes ? availableOptions.attributes : availableOptions.attribute2;
          return availableSet.includes(trait);
        })
        .map(trait => {
          const isInAttributes = allAttributes.includes(trait);
          const category = isInAttributes ? 'attributes' : 'attribute2';
          return {
            category: category as keyof FilterState,
            value: trait,
            label: trait.charAt(0).toUpperCase() + trait.slice(1),
            icon: getAttributeIcon(trait),
            isActive: filters[category].includes(trait),
            isAvailable: isInAttributes ? availableOptions.attributes.includes(trait) : availableOptions.attribute2.includes(trait)
          };
        })
    }
  ].filter(group => group.items.length > 0); // Only show groups that have items

  return (
    <div className="h-full flex flex-col" style={{padding: '1px'}}>
      
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
                marginTop: '8px',
                marginBottom: '8px'
              }}
            >
              Clear All ({activeFilterCount})
            </button>
          </div>
        </div>
      )}
      
      {/* Filter Groups - Full height with top padding */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden" style={{paddingTop: '16px', paddingLeft: '6px', paddingRight: '6px'}}>
        <div className="flex flex-col">
          {filterGroups.map((group, groupIndex) => (
            <div key={group.title} className="mb-6">
              {/* Group Header */}
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#9CA3AF',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
                paddingLeft: '4px',
                fontFamily: 'var(--font-body)'
              }}>
                {group.title}
              </div>
              
              {/* Group Items */}
              <div className="flex flex-col space-y-1 mb-4">
                {group.items.map((option) => (
                  <button
                    key={`${option.category}-${option.value}`}
                    onClick={() => toggleFilter(option.category, option.value)}
                    disabled={!option.isAvailable && !option.isActive}
                    className={`
                      w-full filter-button-glass text-left transition-all duration-300 whitespace-nowrap
                      ${option.isActive ? 'active-glass' : ''}
                      ${!option.isAvailable && !option.isActive ? 'opacity-40 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-semibold flex-1 glass-text">{option.label}</span>
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