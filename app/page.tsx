'use client';

import { useState, useEffect } from 'react';
import { Cultivar, FilterState } from '../types/cultivar';
import { cultivars } from '../data/cultivars';
import TopNav from '../components/TopNav';
import CultivarDetailCardV2 from '../components/CultivarDetailCardV2';
import CultivarFilterPanel from '../components/CultivarFilterPanel';

export default function Home() {
  const [selectedCultivar, setSelectedCultivar] = useState<Cultivar>(cultivars[0]);
  const [displayedCultivar, setDisplayedCultivar] = useState<Cultivar>(cultivars[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    flowerType: [],
    marketType: [],
    attributes: [],
    attribute2: []
  });

  // Mobile drawer states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCultivarDrawerOpen, setIsCultivarDrawerOpen] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle cultivar change with fade transition
  const handleCultivarChange = (newCultivar: Cultivar) => {
    if (newCultivar.id === selectedCultivar.id) return;
    
    setIsTransitioning(true);
    
    // Start fade out
    setTimeout(() => {
      setSelectedCultivar(newCultivar);
      setDisplayedCultivar(newCultivar);
      
      // MOBILE ONLY: Scroll to top during transition (after fade out, before fade in)
      if (isMobile) {
        // Find the scrollable container and scroll to top
        const mainContent = document.querySelector('.flex-1.relative.overflow-hidden');
        if (mainContent) {
          mainContent.scrollTo({ top: 0, behavior: 'auto' });
        }
        
        // Also scroll any nested scrollable content within CultivarDetailCardV2
        const scrollableElements = document.querySelectorAll('[class*="overflow-"], [class*="scroll-"]');
        scrollableElements.forEach(element => {
          if (element.scrollTop > 0) {
            element.scrollTo({ top: 0, behavior: 'auto' });
          }
        });
      }
      
      // Start fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Short delay to ensure DOM update
    }, 500); // Fade out duration
  };

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
        {/* FILTER DRAWER: Exact copy of cultivar drawer but transposed 90 degrees */}
        <button
          onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
          className="mobile-filter-drawer-button"
          style={{
            position: 'fixed',
            top: isLandscape ? '55px' : '55px',
            right: isFilterDrawerOpen ? (isLandscape ? '220px' : '160px') : '12px',
            // TRANSPOSED: No centering transform needed for right-side positioning
            transform: 'none',
            background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white pill
            backdropFilter: 'blur(10px) saturate(180%)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '28px', // Same pill radius as cultivar drawer
            padding: '0px 0px', // TRANSPOSED: vertical horizontal (was 8px 20px)
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            width: '33px', // TRANSPOSED: narrow width (was 72px height)
            height: '72px', // TRANSPOSED: tall height (was 33px width)
            transition: 'right 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Much slower like cultivar drawer
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 136, 0.2)',
            transformOrigin: 'center center',
            willChange: 'right, transform' // TRANSPOSED: right instead of bottom
          }}
        >
          {/* Airport landing strip light effect arrows - EXACT COPY of cultivar drawer but transposed */}
          <svg 
            style={{
              width: '25px', // EXACT SAME as cultivar drawer (was 25px)
              height: '35px', // EXACT SAME as cultivar drawer (was 35px) - swapped for horizontal layout
              fill: 'rgba(255, 255, 255, 0.9)',
              transition: 'transform 0.4s ease, opacity 0.3s ease',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
            }}
            viewBox="0 0 24 24"
          >
            <defs>
              <linearGradient id="buttonGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
                <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.7)" />
              </linearGradient>
            </defs>
            
            {/* EXACT COPY: Using same path coordinates as cultivar drawer but left/right arrows */}
            {isFilterDrawerOpen ? (
              /* Drawer is OPEN - show RIGHT arrows (away from screen, suggesting close) */
              <g fill="url(#buttonGradient3)">
                <path 
                  d="M8.59 16.59L13.17 12l-4.58-4.59L10 6l6 6-6 6z" 
                  className="airport-arrow-1"
                  style={{animation: 'airport-lights-right 2s ease-in-out infinite'}}
                />
                <path 
                  d="M6.59 16.59L11.17 12l-4.58-4.59L8 6l6 6-6 6z" 
                  className="airport-arrow-2"
                  style={{animation: 'airport-lights-right 2s ease-in-out infinite 0.3s'}}
                />
                <path 
                  d="M4.59 16.59L9.17 12l-4.58-4.59L6 6l6 6-6 6z" 
                  className="airport-arrow-3"
                  style={{animation: 'airport-lights-right 2s ease-in-out infinite 0.6s'}}
                />
              </g>
            ) : (
              /* Drawer is CLOSED - show LEFT arrows (toward screen, inviting open) */
              <g fill="url(#buttonGradient3)">
                <path 
                  d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" 
                  className="airport-arrow-1"
                  style={{animation: 'airport-lights-left 2s ease-in-out infinite'}}
                />
                <path 
                  d="M17.41 7.41L16 6l-6 6 6 6 1.41-1.41L12.83 12z" 
                  className="airport-arrow-2"
                  style={{animation: 'airport-lights-left 2s ease-in-out infinite 0.3s'}}
                />
                <path 
                  d="M19.41 7.41L18 6l-6 6 6 6 1.41-1.41L14.83 12z" 
                  className="airport-arrow-3"
                  style={{animation: 'airport-lights-left 2s ease-in-out infinite 0.6s'}}
                />
              </g>
            )}
          </svg>
        </button>

        {/* IMPROVED: Fixed positioned cultivar drawer handle with bouncing animation - PILL SHAPED */}
        <button
          onClick={() => {
            const newCultivarState = !isCultivarDrawerOpen;
            setIsCultivarDrawerOpen(newCultivarState);
            
            // AUTO-OPEN FILTER DRAWER: When cultivar drawer opens, auto-open filter drawer too
            if (newCultivarState) {
              setIsFilterDrawerOpen(true);
            }
          }}
          className="mobile-drawer-button"
          style={{
            position: 'fixed',
            bottom: isCultivarDrawerOpen ? (isLandscape ? 'calc(50vh - 16px)' : '114px') : '16px',
            left: '50%',
            // FIXED: Always use the same transform, never let it be undefined
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white pill
            backdropFilter: 'blur(10px) saturate(180%)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '28px', // Pill shape instead of 50%
            padding: '0px 0px', // Reduced vertical padding for shorter pill
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            width: '72px', // Same width
            height: '33px', // 25% shorter (was 44px)
            transition: 'bottom 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Back to original slow smooth timing
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 136, 0.2)',
            // NO MORE bouncing animation - user didn't like it
            transformOrigin: 'center center',
            // FIXED: Ensure animation doesn't override the centering during transition
            willChange: 'bottom, transform' // Optimize for transitions
          }}
        >
          {/* Airport landing strip light effect arrows */}
          <svg 
            style={{
              width: '35px', // 25% larger (was 28px)
              height: '25px', // 25% larger (was 20px)
              fill: 'rgba(255, 255, 255, 0.9)',
              transition: 'transform 0.4s ease, opacity 0.3s ease',
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
            
            {/* FIXED DIRECTION: When drawer is open, arrows point DOWN; when closed, arrows point UP */}
            {isCultivarDrawerOpen ? (
              /* Drawer is OPEN - show DOWN arrows with landing strip effect */
              <g fill="url(#buttonGradient2)">
                <path 
                  d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" 
                  className="airport-arrow-1"
                  style={{animation: 'airport-lights-down 2s ease-in-out infinite'}}
                />
                <path 
                  d="M7.41 6.59L12 11.17l4.59-4.58L18 8l-6 6-6-6z" 
                  className="airport-arrow-2" 
                  style={{animation: 'airport-lights-down 2s ease-in-out infinite 0.3s'}}
                />
                <path 
                  d="M7.41 4.59L12 9.17l4.59-4.58L18 6l-6 6-6-6z" 
                  className="airport-arrow-3"
                  style={{animation: 'airport-lights-down 2s ease-in-out infinite 0.6s'}}
                />
              </g>
            ) : (
              /* Drawer is CLOSED - show UP arrows with landing strip effect */
              <g fill="url(#buttonGradient2)">
                <path 
                  d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" 
                  className="airport-arrow-1"
                  style={{animation: 'airport-lights-up 2s ease-in-out infinite'}}
                />
                <path 
                  d="M7.41 17.41L12 12.83l4.59 4.58L18 16l-6-6-6 6z" 
                  className="airport-arrow-2"
                  style={{animation: 'airport-lights-up 2s ease-in-out infinite 0.3s'}}
                />
                <path 
                  d="M7.41 19.41L12 14.83l4.59 4.58L18 18l-6-6-6 6z" 
                  className="airport-arrow-3"
                  style={{animation: 'airport-lights-up 2s ease-in-out infinite 0.6s'}}
                />
              </g>
            )}
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
                className={`w-full ${isLandscape ? 'p-4' : 'p-6'} transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                style={{
                  height: `calc(100vh - ${isLandscape ? '48px' : '64px'})`
                }}
              >
                <CultivarDetailCardV2 cultivar={displayedCultivar} />
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
                        handleCultivarChange(cultivar);
                        // CLOSE BOTH DRAWERS: When cultivar is selected, close both drawers
                        setIsCultivarDrawerOpen(false);
                        setIsFilterDrawerOpen(false);
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
            <div className={`h-full transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <CultivarDetailCardV2 cultivar={displayedCultivar} />
            </div>
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
                  onClick={() => {
                    handleCultivarChange(cultivar);
                    // CLOSE BOTH DRAWERS: When cultivar is selected, close both drawers
                    setIsCultivarDrawerOpen(false);
                    setIsFilterDrawerOpen(false);
                  }}
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

