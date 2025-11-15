/**
 * CBC Cultivar Explorer - Main Application Page
 * 
 * PURPOSE:
 * This is the root page component that handles the overall application layout, routing,
 * and state management. It serves as the main entry point for the Next.js app router.
 * 
 * KEY RESPONSIBILITIES:
 * - Manages selected cultivar state and view transitions
 * - Handles responsive layout detection (mobile/desktop/landscape)
 * - Renders either Homepage or CultivarDetailCardV2 based on selection
 * - Manages filter state and filtered cultivar list
 * - Provides cultivar card grid with theme-based styling
 * 
 * COMPONENT HIERARCHY:
 * - Homepage: Welcome/intro page (rendered when no cultivar selected or 'debug' selected)
 * - CultivarDetailCardV2: Detailed cultivar view with charts, images, and info
 * - TopNav: Sticky navigation bar with language switcher
 * - CultivarFilterPanel: Sidebar filter controls (desktop) or drawer (mobile)
 * - CultivarIcon: Reusable icon rendering component
 * 
 * KEY DEPENDENCIES:
 * - data/cultivars.ts: Core cultivar data definitions
 * - components/CultivarDetailCardV2.tsx: Primary detail view
 * - components/Homepage.tsx: Welcome page
 * - components/CultivarFilterPanel.tsx: Filter controls
 * - components/CultivarIcon.tsx: Icon rendering
 * - components/LanguageContext.tsx: i18n support
 * 
 * RELATED FILES:
 * - app/layout.tsx: Root layout with providers and global styles
 * - types/cultivar.ts: TypeScript type definitions
 * - app/cultivar-themes.css: Theme classes for cultivar cards
 */

'use client';

import { useState, useEffect } from 'react';
import { Cultivar, FilterState } from '../types/cultivar';
import { cultivars } from '../data/cultivars';
import TopNav from '../components/TopNav';
import CultivarDetailCardV2 from '../components/CultivarDetailCardV2';
import CultivarFilterPanel from '../components/CultivarFilterPanel';
import Homepage from '../components/Homepage';
import CultivarIcon from '../components/CultivarIcon';
import { useLanguage } from '../components/LanguageContext';

// Helper function to determine cultivar theme class - data-driven from cultivar properties
const getCultivarThemeClass = (cultivarId: string): string => {
  const cultivar = cultivars.find(c => c.id === cultivarId);
  if (!cultivar) return 'cultivar-card-glass';
  
  // Check for specific traits first (takes priority)
  const allAttributes = [...(cultivar.attributes || []), ...(cultivar.attribute2 || [])];
  if (allAttributes.includes('organic')) return 'cultivar-theme-organic';
  if (allAttributes.includes('cold tolerant')) return 'cultivar-theme-cold-tolerant';
  
  // Then check flower type
  if (cultivar.flowerType === 'DN') return 'cultivar-theme-day-neutral';
  if (cultivar.flowerType === 'SD') return 'cultivar-theme-short-day';
  
  // Default to regular glass styling
  return 'cultivar-card-glass';
};

export default function Home() {
  const [selectedCultivar, setSelectedCultivar] = useState<Cultivar>(cultivars[0]);
  const [displayedCultivar, setDisplayedCultivar] = useState<Cultivar>(cultivars[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHomepage, setIsHomepage] = useState(true); // Start on homepage
  
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
  
  // Desktop filter panel dock state - starts closed for clean entry
  const [isFilterPanelDocked, setIsFilterPanelDocked] = useState(false);
  const [isDesktopOrWideTablet, setIsDesktopOrWideTablet] = useState(false);
  const [topNavHeight, setTopNavHeight] = useState(64); // Default 64px (h-16)

  const { language } = useLanguage();

  // Handle cultivar change with fade transition
  const handleCultivarChange = (newCultivar: Cultivar) => {
    if (newCultivar.id === selectedCultivar.id && !isHomepage) return;
    
    // Switch to cultivar view
    setIsHomepage(false);
    
    // IMMEDIATE: Update the focused state right away for responsive UI
    setSelectedCultivar(newCultivar);
    setIsTransitioning(true);
    
    // DELAYED: Update the displayed content after fade transition
    setTimeout(() => {
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

  // Handle homepage navigation
  const handleHomepageClick = () => {
    setIsHomepage(true);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // Detect screen size and orientation
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = width / height;
      const landscape = ratio > 2.0 && ratio < 2.4 && width < 1200;
      const mobile = width < 740 || landscape;
      // Only true desktop/large tablets get the dock system
      const desktopOrWideTablet = width >= 740 && !mobile;
      
      setIsLandscape(landscape);
      setIsMobile(mobile);
      setIsDesktopOrWideTablet(desktopOrWideTablet);
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
    // Use AND logic - cultivar must have ALL selected attributes (check both arrays for each trait)
    if (filters.attributes.length > 0 && !filters.attributes.every(attr => 
      cultivar.attributes.includes(attr) || cultivar.attribute2.includes(attr)
    )) return false;
    if (filters.attribute2.length > 0 && !filters.attribute2.every(attr => 
      cultivar.attributes.includes(attr) || cultivar.attribute2.includes(attr)
    )) return false;
    return true;
  });

  // Close drawers when clicking outside
  const handleBackdropClick = () => {
    setIsFilterDrawerOpen(false);
    setIsCultivarDrawerOpen(false);
  };

  if (isMobile && !isDesktopOrWideTablet) {
    return (
      <>

        {/* IMPROVED: Fixed positioned cultivar drawer handle with bouncing animation - PILL SHAPED */}
        <button
          onClick={() => {
            setIsCultivarDrawerOpen(!isCultivarDrawerOpen);
          }}
          className="mobile-drawer-button"
          style={{
            position: 'fixed',
            bottom: isCultivarDrawerOpen ? (isLandscape ? '90px' : '94px') : '16px',
            left: '50%',
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



        <div className="dark-theme h-screen w-screen overflow-x-hidden overflow-y-auto flex flex-col">
          {/* Mobile Header - Reduced height */}
          <div className={`${isLandscape ? 'mobile-header-landscape' : 'mobile-header-portrait'}`}>
            <TopNav isMobile={true} isLandscape={isLandscape} />
          </div>

          {/* Main Content Area - PROPERLY CENTERED */}
          <div className="flex-1 relative overflow-x-visible overflow-y-hidden">
            <div className="absolute inset-0">
              <div 
                className={`w-full ${isLandscape ? 'p-4' : 'p-6'} transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                style={{
                  height: `calc(100vh - ${isLandscape ? '48px' : '64px'})`
                }}
              >
                {isHomepage ? (
                  <Homepage 
                    isMobile={isMobile}
                    isLandscape={isLandscape}
                  />
                ) : (
                  <CultivarDetailCardV2 
                    cultivar={displayedCultivar} 
                    isMobile={isMobile}
                    isLandscape={isLandscape}
                  />
                )}
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
                  className="theme-base-premium-button premium-button-glass text-sm font-semibold"
                  style={{
                    padding: '12px 24px',
                    fontSize: '14px'
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
              <div className="px-4 py-4 h-full relative" style={{paddingBottom: '8px'}}>
                {/* Fixed HOME button - positioned hard left */}
                <div className="absolute bottom-4 z-20" style={{ left: '16px' }}>
                  <button
                    onClick={handleHomepageClick}
                    className="cultivar-theme-home cursor-pointer relative"
                    style={{
                      width: '65px',
                      height: '65px',
                      background: 'linear-gradient(145deg, rgba(255, 0, 0, 0.9) 0%, rgba(255, 51, 0, 0.95) 100%)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <div className="flex items-center justify-center h-full" style={{ padding: '1px' }}>
                      <img 
                        src={
                          language === 'es' ? '/images/icons/open_es_card_icon.png' :
                          language === 'pt' ? '/images/icons/open_pt_card_icon.png' :
                          '/images/icons/open_card_icon.png'
                        }
                        alt="Home"
                        className="object-contain drop-shadow-lg"
                        style={{ width: '63px', height: '63px' }}
                      />
                    </div>
                  </button>
                </div>
                
                {/* Vertical divider line */}
                <div className="absolute top-4 bottom-4 w-px bg-white/20 z-10" style={{ left: '97px' }}></div>
                
                <div className="flex overflow-x-auto scrollbar-hidden pb-2 h-full items-end" style={{paddingLeft: '107px'}}>
                  {filteredCultivars.filter(cultivar => cultivar.id !== 'debug').map((cultivar, index) => (
                    <div
                      key={cultivar.id}
                      onClick={() => {
                        handleCultivarChange(cultivar);
                        // CLOSE BOTH DRAWERS: When cultivar is selected, close both drawers
                        setIsCultivarDrawerOpen(false);
                        setIsFilterDrawerOpen(false);
                      }}
                      className={`
                        flex-shrink-0 w-25 h-25 theme-base-card ${cultivar.id === 'debug' ? 'cultivar-theme-home' : getCultivarThemeClass(cultivar.id)} cursor-pointer relative
                        ${selectedCultivar.id === cultivar.id ? 'selected-glass' : ''}
                      `}
                      style={{
                        marginRight: index < filteredCultivars.length - 1 ? '12px' : '0'
                      }}
                    >
                      <CultivarIcon cultivar={cultivar} language={language} isMobile={true} />
                      {selectedCultivar.id === cultivar.id && (
                        <div className="absolute top-1 right-1 z-10">
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

  // Desktop Layout with Dockable Filter Panel (≥1024px only)
  return (
    <div className="dark-theme h-screen w-screen overflow-hidden flex flex-col scrollbar-hidden">
      <TopNav onHeightChange={setTopNavHeight} />
      
      {/* Main Layout Container */}
      <div className="flex-1 flex h-full w-full overflow-hidden relative">
        {/* Main Content Area - Dynamic width based on filter panel state */}
        <div 
          className="flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out"
          style={{
                            width: isDesktopOrWideTablet && isFilterPanelDocked ? 'calc(100% - 154px)' : '100%'
          }}
        >
          {/* Detail Card Area - Takes remaining space above bottom panel */}
          <div className="flex-1 overflow-hidden" style={{padding: '24px 24px 12px 24px', paddingBottom: '12px'}}>
            <div className={`h-full transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {isHomepage ? (
                <Homepage 
                  isMobile={isMobile}
                  isLandscape={isLandscape}
                />
              ) : (
                <CultivarDetailCardV2 
                  cultivar={displayedCultivar} 
                  isMobile={isMobile}
                  isLandscape={isLandscape}
                />
              )}
            </div>
          </div>
          
          {/* Bottom Cultivar Cards - Sticky to bottom like TopNav */}
          <div className="h-[5%] min-h-[65px] flex items-center relative flex-shrink-0" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px) saturate(180%)' }}>
            {/* Fixed navigation background panel - masks scrolling cards */}
            <div 
              style={{ 
                position: 'absolute',
                left: '0px',
                top: '0px',
                bottom: '0px',
                width: '175px',
                background: 'linear-gradient(to right, rgba(255, 255, 255, 1.0) 60%, rgba(0, 0, 0, 0.02) 100%)',
                backdropFilter: 'blur(5px) saturate(100%)',
                zIndex: 15
              }}
            ></div>
            
            {/* Left scroll indicator - positioned after HOME button and divider */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 z-20 opacity-100 hover:opacity-100 transition-all duration-200 cursor-pointer hover:scale-110"
              style={{ left: '115px' }}
              onClick={() => {
                const container = document.querySelector('.cultivar-scroll-container');
                if (container) {
                  container.scrollBy({ left: -200, behavior: 'smooth' });
                }
              }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center border border-black shadow-xl" style={{ backgroundColor: 'black', opacity: '0.5'}}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.95)" strokeWidth="3">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </div>
            </div>

            {/* Right navigation background panel - masks scrolling cards */}
            <div 
              style={{ 
                position: 'absolute',
                right: '0px',
                top: '0px',
                bottom: '0px',
                width: '50px',
                background: 'linear-gradient(to left, rgba(255, 255, 255, 1.0) 0%, rgba(0, 0, 0, 0.02) 100%)',
                backdropFilter: 'blur(5px) saturate(100%)',
                zIndex: 15
              }}
            ></div>

            {/* Right scroll indicator - positioned over the background panel */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 z-20 opacity-100 hover:opacity-100 transition-all duration-200 cursor-pointer hover:scale-110"
              style={{ right: '8px' }}
              onClick={() => {
                const container = document.querySelector('.cultivar-scroll-container');
                if (container) {
                  container.scrollBy({ left: 200, behavior: 'smooth' });
                }
              }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center border border-black shadow-xl" style={{ backgroundColor: 'black', opacity: '0.5' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.95)" strokeWidth="3">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>

            {/* Fixed HOME button - positioned hard left */}
            <div className="absolute bottom-2 z-20" style={{ left: '24px' }}>
              <button
                onClick={handleHomepageClick}
                className="cultivar-theme-home cursor-pointer relative"
                style={{
                  width: '65px',
                  height: '65px',
                  background: 'linear-gradient(145deg, rgba(255, 0, 0, 0.9) 0%, rgba(255, 51, 0, 0.95) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div className="flex items-center justify-center h-full" style={{ padding: '1px' }}>
                  <img 
                    src={
                      language === 'es' ? '/images/icons/open_es_card_icon.png' :
                      language === 'pt' ? '/images/icons/open_pt_card_icon.png' :
                      '/images/icons/open_card_icon.png'
                    }
                    alt="Home"
                    className="object-contain drop-shadow-lg"
                    style={{ width: '63px', height: '63px' }}
                  />
                </div>
              </button>
            </div>
            
            {/* Vertical divider line */}
            <div className="absolute top-2 bottom-2 w-px bg-black/30 z-10" style={{ left: '105px' }}></div>

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
              className="cultivar-scroll-container flex h-full items-center justify-start overflow-x-auto scrollbar-hidden w-full"
              style={{
                paddingLeft: '200px',
                paddingRight: '90px',
                paddingBottom: '8px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {filteredCultivars.filter(cultivar => cultivar.id !== 'debug').map((cultivar, index) => (
                <div
                  key={cultivar.id}
                  onClick={() => {
                    handleCultivarChange(cultivar);
                    // CLOSE BOTH DRAWERS: When cultivar is selected, close both drawers
                    setIsCultivarDrawerOpen(false);
                    setIsFilterDrawerOpen(false);
                  }}
                    className={`
                    flex-shrink-0 w-25 h-25 theme-base-card ${cultivar.id === 'debug' ? 'cultivar-theme-home' : getCultivarThemeClass(cultivar.id)} cursor-pointer relative
                    ${selectedCultivar.id === cultivar.id ? 'selected-glass' : ''}
                  `}
                  style={{
                    marginRight: index < filteredCultivars.length - 1 ? '12px' : '0'
                  }}
                >
                  <CultivarIcon cultivar={cultivar} language={language} isMobile={false} />
                  {selectedCultivar.id === cultivar.id && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="w-3 h-3 bg-green-400 rounded-full pulse-glow-glass shadow-lg"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-2xl pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dockable Filter Panel - Desktop and Wide Tablet Only */}
        {isDesktopOrWideTablet && (
          <>
            {/* Filter Panel Container */}
            <div 
              className="fixed bg-white/80 border-l border-white/20 overflow-hidden transition-all duration-500 ease-in-out z-40"
              style={{
                top: `${topNavHeight}px`,
                height: `calc(100vh - ${topNavHeight}px)`,
                right: isFilterPanelDocked ? '0px' : '-154px',
                width: '154px'
              }}
            >
              <CultivarFilterPanel 
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>

            {/* Dock Tab */}
            <div 
              className="filter-dock-tab"
              style={{
                right: isFilterPanelDocked ? '164px' : '10px'
              }}
              onClick={() => setIsFilterPanelDocked(!isFilterPanelDocked)}
            >
              <div className="dock-tab-content">
                {/* Direction Arrow */}
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 16 16" 
                  fill="none" 
                  className={`direction-arrow ${isFilterPanelDocked ? 'rotated' : ''}`}
                >
                  <path 
                    d="M10 4L6 8L10 12"
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </>
        )}


      </div>
    </div>
  );
}

