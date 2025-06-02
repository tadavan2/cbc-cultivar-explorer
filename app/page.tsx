'use client';

import { useState, useEffect } from 'react';
import { Cultivar, FilterState } from '../types/cultivar';
import { cultivars } from '../data/cultivars';
import TopNav from '../components/TopNav';
import CultivarDetailCardV2 from '../components/CultivarDetailCardV2';
import CultivarFilterPanel from '../components/CultivarFilterPanel';

export default function Home() {
  const [selectedCultivar, setSelectedCultivar] = useState<Cultivar>(cultivars[0]);
  const [filters, setFilters] = useState<FilterState>({
    flowerType: [],
    marketType: [],
    attributes: [],
    attribute2: []
  });

  // Mobile drawer states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCultivarDrawerOpen, setIsCultivarDrawerOpen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size and orientation
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      const landscape = window.innerWidth > window.innerHeight && mobile;
      setIsMobile(mobile);
      setIsLandscape(landscape);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkScreenSize, 100); // Delay for orientation change
    });

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('orientationchange', checkScreenSize);
    };
  }, []);

  // Filter cultivars based on active filters
  const filteredCultivars = cultivars.filter(cultivar => {
    // ALWAYS include the debug cultivar (intro page) regardless of filters
    if (cultivar.id === 'debug') return true;
    
    // Apply normal filtering logic to other cultivars
    if (filters.flowerType.length > 0 && !filters.flowerType.includes(cultivar.flowerType)) return false;
    if (filters.marketType.length > 0 && !filters.marketType.includes(cultivar.marketType)) return false;
    if (filters.attributes.length > 0 && !filters.attributes.some(attr => cultivar.attributes.includes(attr))) return false;
    if (filters.attribute2.length > 0 && !filters.attribute2.some(attr => cultivar.attribute2.includes(attr))) return false;
    return true;
  });

  // Close drawers when clicking outside
  const handleBackdropClick = () => {
    setIsFilterDrawerOpen(false);
    setIsCultivarDrawerOpen(false);
  };

  if (isMobile) {
    return (
      <>
        {/* IMPROVED: Fixed positioned filter handle with bouncing animation and white circle */}
        <button
          onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
          className="mobile-drawer-button"
          style={{
            position: 'fixed',
            top: isLandscape ? '55px' : '55px',
            right: isFilterDrawerOpen ? (isLandscape ? '220px' : '160px') : '12px',
            transform: 'none',
            background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white circle
            backdropFilter: 'blur(10px) saturate(180%)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%', // Perfect circle
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            width: '56px',
            height: '56px',
            transition: 'right 0.6s ease, transform 0.3s ease',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 136, 0.2)',
            // Bouncing animation
            animation: isFilterDrawerOpen ? 'none' : 'gentle-bounce 2s ease-in-out infinite'
          }}
        >
          <svg 
            style={{
              width: '24px',
              height: '24px',
              fill: 'rgba(255, 255, 255, 0.9)',
              transform: isFilterDrawerOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.4s ease',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
            }}
            viewBox="0 0 24 24"
          >
            <defs>
              <linearGradient id="buttonGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
                <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.7)" />
              </linearGradient>
            </defs>
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="url(#buttonGradient1)" />
          </svg>
        </button>

        {/* IMPROVED: Fixed positioned cultivar drawer handle with bouncing animation - FIXED CENTERING */}
        <button
          onClick={() => setIsCultivarDrawerOpen(!isCultivarDrawerOpen)}
          className="mobile-drawer-button"
          style={{
            position: 'fixed',
            bottom: isCultivarDrawerOpen ? (isLandscape ? 'calc(50vh - 16px)' : '114px') : '16px',
            left: '50%',
            // FIXED: Always use the same transform, never let it be undefined
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white circle
            backdropFilter: 'blur(10px) saturate(180%)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%', // Perfect circle
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            width: '56px',
            height: '56px',
            transition: 'bottom 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // FIXED: Only animate bottom position
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 136, 0.2)',
            // Bouncing animation - only when drawer is closed
            animation: isCultivarDrawerOpen ? 'none' : 'gentle-bounce 2s ease-in-out infinite 0.5s', // Slight delay
            transformOrigin: 'center center',
            // FIXED: Ensure animation doesn't override the centering during transition
            willChange: 'bottom, transform' // Optimize for transitions
          }}
        >
          <svg 
            style={{
              width: '24px',
              height: '24px',
              fill: 'rgba(255, 255, 255, 0.9)',
              transform: isCultivarDrawerOpen ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.4s ease',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
            }}
            viewBox="0 0 24 24"
          >
            <defs>
              <linearGradient id="buttonGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
                <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.7)" />
              </linearGradient>
            </defs>
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="url(#buttonGradient2)" />
          </svg>
        </button>

        <div className="dark-theme h-screen w-screen overflow-hidden flex flex-col">
          {/* Mobile Header - Reduced height */}
          <div className={`${isLandscape ? 'mobile-header-landscape' : 'mobile-header-portrait'}`}>
            <TopNav isMobile={true} isLandscape={isLandscape} />
          </div>

          {/* Main Content Area - PROPERLY CENTERED */}
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0">
              <div 
                className={`w-full ${isLandscape ? 'p-4' : 'p-6'}`}
                style={{
                  height: `calc(100vh - ${isLandscape ? '48px' : '64px'})`
                }}
              >
                <CultivarDetailCardV2 cultivar={selectedCultivar} />
              </div>
            </div>
          </div>

          {/* Filter Drawer - NO CLOSE BUTTON */}
          <div className={`filter-drawer ${isFilterDrawerOpen ? 'filter-drawer-open' : ''} ${isFilterDrawerOpen && isCultivarDrawerOpen ? 'filter-drawer-pushed-up' : ''}`}>
            <div className="filter-drawer-content">
              <div className="flex items-center justify-center p-4 border-b border-white/10">
                <button
                  onClick={() => setFilters({
                    flowerType: [],
                    marketType: [],
                    attributes: [],
                    attribute2: []
                  })}
                  className="premium-button text-sm font-semibold"
                  style={{
                    padding: '12px 24px',
                    fontSize: '14px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#ffffff',
                    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Clear All
                </button>
              </div>
              <CultivarFilterPanel 
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </div>

          {/* Cultivar Cards Drawer - SIMPLIFIED HEIGHT */}
          <div 
            className={`cultivar-drawer ${isCultivarDrawerOpen ? 'cultivar-drawer-open' : ''}`}
          >
            <div className="cultivar-drawer-content h-full flex flex-col">              
              {/* Cards at bottom with proper spacing */}
              <div className="px-4 py-4 h-full">
                <div className="flex overflow-x-auto pb-2 h-full items-end">
                  {filteredCultivars.map((cultivar, index) => (
                    <div
                      key={cultivar.id}
                      onClick={() => {
                        setSelectedCultivar(cultivar);
                        setIsCultivarDrawerOpen(false);
                      }}
                      className={`
                        flex-shrink-0 cultivar-card-mobile cursor-pointer relative
                        ${selectedCultivar.id === cultivar.id ? 'selected-glass' : ''}
                      `}
                      style={{
                        marginRight: index < filteredCultivars.length - 1 ? '12px' : '0'
                      }}
                    >
                      {cultivar.id === 'adelanto' ? (
                        <div className="flex items-center justify-center h-full p-2">
                          <img 
                            src="/images/icons/adelanto_card_icon.png" 
                            alt="Adelanto Icon"
                            className="w-full h-full object-contain max-w-[95px] max-h-[95px] drop-shadow-lg"
                          />
                        </div>
                      ) : cultivar.id === 'debug' ? (
                        <div className="flex items-center justify-center h-full p-2">
                          <img 
                            src="/images/icons/open_card_icon.png" 
                            alt="CBC Cultivar Explorer Icon"
                            className="w-full h-full object-contain max-w-[95px] max-h-[95px] drop-shadow-lg"
                          />
                        </div>
                      ) : cultivar.id === 'alhambra' ? (
                        <div className="flex items-center justify-center h-full p-2">
                          <img 
                            src="/images/icons/alhambra_card_icon.png" 
                            alt="Alhambra Icon"
                            className="w-full h-full object-contain max-w-[95px] max-h-[95px] drop-shadow-lg"
                          />
                        </div>
                      ) : cultivar.id === 'alturas' ? (
                        <div className="flex items-center justify-center h-full p-2">
                          <img 
                            src="/images/icons/alturas_card_icon.png" 
                            alt="Alturas Icon"
                            className="w-full h-full object-contain max-w-[95px] max-h-[95px] drop-shadow-lg"
                          />
                        </div>
                      ) : cultivar.id === 'artesia' ? (
                        <div className="flex items-center justify-center h-full p-2">
                          <img 
                            src="/images/icons/artesia_card_icon.png" 
                            alt="Artesia Icon"
                            className="w-full h-full object-contain max-w-[95px] max-h-[95px] drop-shadow-lg"
                          />
                        </div>
                      ) : cultivar.id === 'belvedere' ? (
                        <div className="flex items-center justify-center h-full p-2">
                          <img 
                            src="/images/icons/belvedere_card_icon.png" 
                            alt="Belvedere Icon"
                            className="w-full h-full object-contain max-w-[95px] max-h-[95px] drop-shadow-lg"
                          />
                        </div>
                      ) : cultivar.id === 'brisbane' ? (
                        <div className="flex items-center justify-center h-full p-2">
                          <img 
                            src="/images/icons/brisbane_card_icon.png" 
                            alt="Brisbane Icon"
                            className="w-full h-full object-contain max-w-[95px] max-h-[95px] drop-shadow-lg"
                          />
                        </div>
                      ) : cultivar.id === 'castaic' ? (
                        <div className="flex items-center justify-center h-full p-2">
                          <img 
                            src="/images/icons/castaic_card_icon.png" 
                            alt="Castaic Icon"
                            className="w-full h-full object-contain max-w-[95px] max-h-[95px] drop-shadow-lg"
                          />
                        </div>
                      ) : cultivar.id === 'carpinteria' ? (
                        <div className="flex items-center justify-center h-full p-2">
                          <img 
                            src="/images/icons/carpinteria_card_icon.png" 
                            alt="Carpinteria Icon"
                            className="w-full h-full object-contain max-w-[95px] max-h-[95px] drop-shadow-lg"
                          />
                        </div>
                      ) : cultivar.id === 'sweet-carolina' ? (
                        <div className="flex items-center justify-center h-full p-2">
                          <img 
                            src="/images/icons/sweetcarolina_card_icon.png" 
                            alt="Sweet Carolina Icon"
                            className="w-full h-full object-contain max-w-[95px] max-h-[95px] drop-shadow-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-2">
                          <div className="text-2xl mb-1 drop-shadow-lg">{cultivar.emoji}</div>
                          <div className="cultivar-tag-mobile truncate w-full px-1 glass-text text-xs">
                            {cultivar.name}
                          </div>
                        </div>
                      )}
                      {selectedCultivar.id === cultivar.id && (
                        <div className="absolute top-1 right-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full pulse-glow-glass shadow-lg"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop for drawers */}
          {(isFilterDrawerOpen || isCultivarDrawerOpen) && (
            <div 
              className="fixed inset-0 bg-black/50 z-30"
              onClick={handleBackdropClick}
            />
          )}
        </div>
      </>
    );
  }

  // Desktop Layout (unchanged)
  return (
    <div className="dark-theme h-screen w-screen overflow-hidden flex flex-col scrollbar-hidden">
      <TopNav />
      
      {/* Main Layout Container */}
      <div className="flex-1 flex h-full w-full overflow-hidden">
        {/* Main Content Area - flex-1 to take remaining space */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Detail Card Area - 70% height to accommodate larger bottom panel */}
          <div className="h-[99%] overflow-hidden" style={{padding: '24px 24px 12px 24px'}}>
            <CultivarDetailCardV2 cultivar={selectedCultivar} />
          </div>
          
          {/* Bottom Cultivar Cards - 30% height for larger cards - NO TOP PADDING */}
          <div className="h-[30%] min-h-[200px] bg-gradient-to-r from-gray-900/10 via-gray-800/15 to-gray-900/10 backdrop-blur-sm flex items-center">
            <div 
              className="flex h-full items-center justify-start overflow-x-auto scrollbar-hidden w-full"
              style={{
                padding: '0 24px 8px 24px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {filteredCultivars.map((cultivar, index) => (
                <div
                  key={cultivar.id}
                  onClick={() => setSelectedCultivar(cultivar)}
                  className={`
                    flex-shrink-0 w-25 h-25 cultivar-card-glass cursor-pointer relative
                    ${selectedCultivar.id === cultivar.id ? 'selected-glass' : ''}
                  `}
                  style={{
                    marginRight: index < filteredCultivars.length - 1 ? '12px' : '0'
                  }}
                >
                  {cultivar.id === 'adelanto' ? (
                    // Special layout for Adelanto with custom icon only
                    <div className="flex items-center justify-center h-full p-2">
                      <img 
                        src="/images/icons/adelanto_card_icon.png" 
                        alt="Adelanto Icon"
                        className="w-full h-full object-contain max-w-[130px] max-h-[130px] drop-shadow-lg"
                      />
                    </div>
                  ) : cultivar.id === 'debug' ? (
                    // Special layout for CBC Cultivar Explorer with custom icon only
                    <div className="flex items-center justify-center h-full p-2">
                      <img 
                        src="/images/icons/open_card_icon.png" 
                        alt="CBC Cultivar Explorer Icon"
                        className="w-full h-full object-contain max-w-[130px] max-h-[130px] drop-shadow-lg"
                      />
                    </div>
                  ) : cultivar.id === 'alhambra' ? (
                    // Special layout for Alhambra with custom icon only
                    <div className="flex items-center justify-center h-full p-2">
                      <img 
                        src="/images/icons/alhambra_card_icon.png" 
                        alt="Alhambra Icon"
                        className="w-full h-full object-contain max-w-[130px] max-h-[130px] drop-shadow-lg"
                      />
                    </div>
                  ) : cultivar.id === 'alturas' ? (
                    // Special layout for Alturas with custom icon only
                    <div className="flex items-center justify-center h-full p-2">
                      <img 
                        src="/images/icons/alturas_card_icon.png" 
                        alt="Alturas Icon"
                        className="w-full h-full object-contain max-w-[130px] max-h-[130px] drop-shadow-lg"
                      />
                    </div>
                  ) : cultivar.id === 'artesia' ? (
                    // Special layout for Artesia with custom icon only
                    <div className="flex items-center justify-center h-full p-2">
                      <img 
                        src="/images/icons/artesia_card_icon.png" 
                        alt="Artesia Icon"
                        className="w-full h-full object-contain max-w-[130px] max-h-[130px] drop-shadow-lg"
                      />
                    </div>
                  ) : cultivar.id === 'belvedere' ? (
                    // Special layout for Belvedere with custom icon only
                    <div className="flex items-center justify-center h-full p-2">
                      <img 
                        src="/images/icons/belvedere_card_icon.png" 
                        alt="Belvedere Icon"
                        className="w-full h-full object-contain max-w-[130px] max-h-[130px] drop-shadow-lg"
                      />
                    </div>
                  ) : cultivar.id === 'brisbane' ? (
                    <div className="flex items-center justify-center h-full p-2">
                      <img 
                        src="/images/icons/brisbane_card_icon.png" 
                        alt="Brisbane Icon"
                        className="w-full h-full object-contain max-w-[130px] max-h-[130px] drop-shadow-lg"
                      />
                    </div>
                  ) : cultivar.id === 'castaic' ? (
                    <div className="flex items-center justify-center h-full p-2">
                      <img 
                        src="/images/icons/castaic_card_icon.png" 
                        alt="Castaic Icon"
                        className="w-full h-full object-contain max-w-[130px] max-h-[130px] drop-shadow-lg"
                      />
                    </div>
                  ) : cultivar.id === 'carpinteria' ? (
                    <div className="flex items-center justify-center h-full p-2">
                      <img 
                        src="/images/icons/carpinteria_card_icon.png" 
                        alt="Carpinteria Icon"
                        className="w-full h-full object-contain max-w-[130px] max-h-[130px] drop-shadow-lg"
                      />
                    </div>
                  ) : cultivar.id === 'sweet-carolina' ? (
                    <div className="flex items-center justify-center h-full p-2">
                      <img 
                        src="/images/icons/sweetcarolina_card_icon.png" 
                        alt="Sweet Carolina Icon"
                        className="w-full h-full object-contain max-w-[130px] max-h-[130px] drop-shadow-lg"
                      />
                    </div>
                  ) : (
                    // Default layout for other cultivars
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <div className="text-4xl mb-3 drop-shadow-lg">{cultivar.emoji}</div>
                      <div className="cultivar-tag truncate w-full px-2 glass-text">
                        {cultivar.name}
                      </div>
                    </div>
                  )}
                  {selectedCultivar.id === cultivar.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full pulse-glow-glass shadow-lg"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-2xl pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Filter Panel - Fixed width on desktop */}
        <div className="w-80 h-full border-l border-white/10 bg-gradient-to-b from-gray-900/10 via-gray-800/15 to-gray-900/10 backdrop-blur-sm overflow-hidden">
          <CultivarFilterPanel 
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>
    </div>
  );
}

