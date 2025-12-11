/**
 * CultivarDetailCardV2 - Primary Detail View Component
 * 
 * PURPOSE:
 * This is the main component for displaying detailed information about a selected cultivar.
 * It provides a rich marketing-style layout with images, charts, metrics, and interactive elements.
 * 
 * KEY FEATURES:
 * - Responsive layouts for mobile portrait, mobile landscape, and desktop
 * - Image carousels with auto-rotation
 * - Performance comparison charts (yield, firmness, size, appearance)
 * - Spider/radar charts for trait comparison
 * - Info overlay system for educational content
 * - Contact form for cultivar inquiries
 * - Multi-language support (English, Spanish, Portuguese)
 * 
 * COMPONENT STRUCTURE:
 * - Banner image with cultivar name
 * - Image carousel (3-4 images)
 * - Description section with marketing content
 * - Performance metrics display
 * - Chart section with cultivar selector
 * - Spider chart for trait visualization
 * - Recommendations section
 * - Contact form
 * 
 * KEY DEPENDENCIES:
 * - data/cultivarContent.ts: Loads rich content from JSON files
 * - data/chartData.ts: Provides chart data and comparison logic
 * - data/infoOverlayContent.ts: Info overlay content and button generation
 * - components/CultivarChart.tsx: Performance comparison charts
 * - components/SpiderChart.tsx: Trait radar charts
 * - components/CultivarSelector.tsx: Cultivar selection UI
 * - components/ImageCarousel.tsx: Auto-rotating image display
 * - components/ContactForm.tsx: Inquiry form
 * - components/InfoOverlayMobile.tsx: Mobile info overlay display
 * - components/LanguageContext.tsx: i18n support
 * 
 * STATE MANAGEMENT:
 * - Uses cultivarConfig memoization for cultivar-specific settings
 * - Manages comparison cultivar selection
 * - Handles info overlay display state
 * - Loads and caches cultivar content
 * 
 * RELATED FILES:
 * - app/page.tsx: Parent component that renders this
 * - public/data/cultivars/{id}/content.json: Rich content data
 * - public/data/csv/{id}.csv: Chart data source
 */

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Cultivar } from '../types/cultivar';
import { getInfoOverlayData, InfoOverlayContent, generateButtonConfigs, cultivarSpecificInfoData } from '../data/infoOverlayContent';
import CultivarChart from './CultivarChart';
import SpiderChart from './SpiderChart';
import CultivarSelector from './CultivarSelector';
import ContactForm from './ContactForm';
import ImageCarousel from './ImageCarousel';
import InfoOverlayMobile from './InfoOverlayMobile';
import { getDefaultComparisonCultivar } from '../data/chartData';
import { getCultivarContent, CultivarContent } from '../data/cultivarContent';
import { useLanguage, useTranslation } from './LanguageContext';

interface CultivarDetailCardV2Props {
  cultivar: Cultivar;
  isMobile: boolean;
  isLandscape: boolean;
}

export default function CultivarDetailCardV2({ cultivar, isMobile, isLandscape }: CultivarDetailCardV2Props) {
  const { language } = useLanguage();
  const { t, getInfoOverlay } = useTranslation();
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);
  const [infoOverlay, setInfoOverlay] = useState<{ key: string, content: InfoOverlayContent } | null>(null);
  const [cultivarContent, setCultivarContent] = useState<CultivarContent | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(400); // Default width for SSR
  
  // Chart state management
  const [selectedCultivar, setSelectedCultivar] = useState(cultivar.id);
  const [comparisonCultivar, setComparisonCultivar] = useState<string | undefined>(undefined);

  // Cultivar-specific configuration
  const cultivarConfig = useMemo(() => {
    const configs: { [key: string]: { comparisonOptions: string[], hasDefaultComparison: boolean } } = {
      'alturas': { comparisonOptions: ['monterey', 'cabrillo', 'carpinteria'], hasDefaultComparison: true },
      'adelanto': { comparisonOptions: ['belvedere', 'castaic', 'fronteras'], hasDefaultComparison: false },
      'alhambra': { comparisonOptions: ['portola'], hasDefaultComparison: false },
      'artesia': { comparisonOptions: ['monterey', 'cabrillo'], hasDefaultComparison: false },
      'belvedere': { comparisonOptions: ['adelanto', 'castaic', 'fronteras'], hasDefaultComparison: false },
      'castaic': { comparisonOptions: ['adelanto', 'belvedere', 'fronteras'], hasDefaultComparison: false },
      'carpinteria': { comparisonOptions: ['monterey', 'cabrillo', 'alturas'], hasDefaultComparison: false },
      'brisbane': { comparisonOptions: ['monterey', 'cabrillo'], hasDefaultComparison: false },
      'sweet-carolina': { comparisonOptions: ['ruby-june'], hasDefaultComparison: false }
    };
    return configs[cultivar.id] || { comparisonOptions: [], hasDefaultComparison: false };
  }, [cultivar.id]);
  
  // Get comparison options for current cultivar
  const comparisonOptions = cultivarConfig.comparisonOptions;

  // Boolean flags for cultivar pages (kept for backward compatibility with existing code)
  const isAlturasPage = cultivar.id === 'alturas';
  const isAdelantoPage = cultivar.id === 'adelanto';
  const isAlhambraPage = cultivar.id === 'alhambra';
  const isArtesiaPage = cultivar.id === 'artesia';
  const isBelvederePage = cultivar.id === 'belvedere';
  const isCastaicPage = cultivar.id === 'castaic';
  const isCarpinteriaPage = cultivar.id === 'carpinteria';
  const isBrisbanePage = cultivar.id === 'brisbane';
  const isSweetCarolinaPage = cultivar.id === 'sweet-carolina';

  // Mobile fixed pair configuration
  const mobileFixedPair = useMemo(() => {
    const fixedPairs: { [key: string]: { primary: string, comparison: string | undefined } } = {
      'alturas': { primary: 'alturas', comparison: 'monterey' },
      'adelanto': { primary: 'adelanto', comparison: 'belvedere' },
      'alhambra': { primary: 'alhambra', comparison: 'portola' },
      'artesia': { primary: 'artesia', comparison: 'monterey' },
      'belvedere': { primary: 'belvedere', comparison: undefined },
      'castaic': { primary: 'castaic', comparison: 'fronteras' },
      'carpinteria': { primary: 'carpinteria', comparison: 'monterey' },
      'brisbane': { primary: 'brisbane', comparison: 'monterey' },
      'sweet-carolina': { primary: 'sweet-carolina', comparison: 'ruby-june' }
    };
    return fixedPairs[cultivar.id] || null;
  }, [cultivar.id]);

  // Reset comparison cultivar when switching between different cultivars
  useEffect(() => {
    setComparisonCultivar(undefined);
  }, [cultivar.id]);

  // Set initial default comparison for specific pages only once
  useEffect(() => {
    if (comparisonCultivar === undefined) {
      if (cultivarConfig.hasDefaultComparison) {
      const defaultComparison = getDefaultComparisonCultivar(cultivar.id);
        if (defaultComparison && cultivarConfig.comparisonOptions.includes(defaultComparison)) {
        setComparisonCultivar(defaultComparison);
      } else {
        setComparisonCultivar(undefined);
      }
      } else {
        // Default to None for cultivars without default comparison
      setComparisonCultivar(undefined);
    }
    }
  }, [cultivar.id, cultivarConfig, comparisonCultivar]);

  // For specific pages, ensure selectedCultivar stays locked to current cultivar
  useEffect(() => {
    if (selectedCultivar !== cultivar.id) {
      setSelectedCultivar(cultivar.id);
    }
  }, [cultivar.id, selectedCultivar]);

  // Load cultivar content on mount and when language changes
  useEffect(() => {
    const loadContent = async () => {
      setContentLoading(true);
      try {
        const content = await getCultivarContent(cultivar.id, language);
        setCultivarContent(content);
      } catch (error) {
        console.error('Error loading cultivar content:', error);
        setCultivarContent(null);
      } finally {
        setContentLoading(false);
      }
    };
    loadContent();
  }, [cultivar.id, language]);

  // Get info overlay data and button configs for this specific cultivar
  const infoData = getInfoOverlayData(cultivar.id);
  const buttonConfigs = generateButtonConfigs(cultivar);

  const handleInfoClick = (buttonType: string) => {
    const info = infoData[buttonType];
    if (info) {
      setInfoOverlay({ key: buttonType, content: info });
      setShowInfoOverlay(true);
    }
  };

  const closeInfoOverlay = () => {
    setShowInfoOverlay(false);
    setInfoOverlay(null);
  };

  // Screen width detection (keeping only screenWidth for any remaining usage)
  useEffect(() => {
    const checkScreenSize = () => {
      setScreenWidth(window.innerWidth);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('orientationchange', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('orientationchange', checkScreenSize);
    };
  }, []);



  // Special intro page layout for debug cultivar
  if (cultivar.id === 'debug') {
    // Mobile Portrait Layout for Debug
    if (isMobile && !isLandscape) {
      return (
        <div className="h-full w-full relative" style={{ margin: '0px' }}>
          <div 
            className="w-full h-full overflow-hidden"
            style={{
              background: 'transparent',
              borderRadius: '20px',
              position: 'relative',
              height: '100vh',
              width: 'calc(100vw - 16px)'
              
            }}

          >
            {/* Background Image - Mobile Portrait (show more right side for strawberry) */}
            <div 
              className="absolute inset-0"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                zIndex: 1,
                height: '100%',
                width: '100%'
              }}
            >
              <Image 
                src="/images/backgrounds/open_page_bg.jpg"
                alt="CBC Cultivar Explorer Welcome"
                width={2140} // 50% of 4281px original width
                height={1402} // 50% of 2803px original height
                className="object-cover"
                style={{ 
                  borderRadius: '20px',
                  objectPosition: '75% center', // MOBILE: Show more of the right side (strawberry)
                  maxWidth: '100%',
                  maxHeight: 'calc(100vh - 80px)',
                  marginLeft: '6px'
                }}
                priority
              />
            </div>
            
            {/* Mobile text overlay - Welcome message */}
            <div 
              className="absolute top-16 left-6"
              style={{
                zIndex: 20, // Higher z-index to ensure it shows above everything
                color: '#000000',
                fontSize: '30px',
                fontWeight: 'bold',
                fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
                pointerEvents: 'none',
                maxWidth: 'calc(100vw - 48px)', // Account for full viewport width
                padding: '8px 12px',
                borderRadius: '8px', 
                marginLeft: '18px',
                marginRight: '8px', 
                marginTop: '12px',
                marginBottom: '12px',
                backgroundColor: 'rgba(241, 0, 0, 0.5)',
              }}
            >
              CULTIVAR EXPLORER
            </div>

            {/* Mobile text overlay - Instructions */}
            <div 
              className="absolute left-6"
              style={{
                top: '100px',
                zIndex: 20, // Higher z-index to ensure it shows above everything
                color: '#ffffff',
                fontSize: '22px',
                fontWeight: '500',
                fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
                pointerEvents: 'none',
                maxWidth: 'calc(100vw - 48px)', // Account for full viewport width
                padding: '8px 12px',
                borderRadius: '8px', 
                marginLeft: '14px',
                marginRight: '8px', 
                lineHeight: '1.3',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
            >
              Tap any variety below to explore.
            </div>
            
            
            {/* Optional overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2))',
                borderRadius: '20px',
                zIndex: 2 // Lower than text
              }}
            />
          </div>
        </div>
      );
    }
    
    // Mobile Landscape Layout for Debug
    if (isMobile && isLandscape) {
      return (
        <div className="h-full w-full relative" style={{ margin: '0px' }}>
          <div 
            className="w-full h-full overflow-hidden"
            style={{
              background: 'transparent',
              borderRadius: '20px',
              position: 'relative',
              height: '100%',
              width: '100%'
            }}
          >
            {/* Background Image - Mobile Landscape */}
            <div 
              className="absolute inset-0"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                zIndex: 1,
                height: '100%',
                width: '100%'
              }}
            >
              <Image 
                src="/images/backgrounds/open_page_bg_landscape.jpg"
                alt="CBC Cultivar Explorer Welcome"
                width={1500}
                height={982}
                className="object-cover"
                style={{ 
                  borderRadius: '20px',
                  objectPosition: 'center center',
                  width: '100%',
                  height: '100%'
                }}
                priority
              />
            </div>
            
            {/* Mobile Landscape text overlay */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                zIndex: 3,
                borderRadius: '20px',
                padding: '20px'
              }}
            >
              <div className="text-center" style={{ maxWidth: '600px' }}>
                <h1 
                  className="text-2xl font-bold mb-4"
                  style={{
                    color: '#ffffff',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                    fontFamily: 'var(--font-heading, Georgia, serif)'
                  }}
                >
                  CBC Cultivar Explorer
                </h1>
                <p 
                  className="text-sm leading-relaxed"
                  style={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                    fontFamily: 'var(--font-body, system-ui)',
                    maxWidth: '400px',
                    margin: '0 auto'
                  }}
                >
                  Compare strawberry varieties and performance data to find your ideal cultivar. Tap any variety below to explore.
                </p>
              </div>
            </div>
            
            {/* Gradient overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3))',
                borderRadius: '20px',
                zIndex: 2
              }}
            />
          </div>
        </div>
      );
    }
    
    // Desktop Layout for Debug
    return (
      <div className="h-full w-full flex items-center justify-center">
        {/* Intro Page Container */}
        <div 
          className="w-full h-full overflow-hidden"
          style={{
            background: 'transparent',
            borderRadius: '20px',
            position: 'relative',
            height: '100%',
            width: '100%'
          }}
        >
          {/* Background Image - Full Container */}
          <div 
            className="absolute inset-0"
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              zIndex: 1,
              height: '100%',
              width: '100%'
            }}
          >
            <Image 
              src="/images/backgrounds/open_page_bg.jpg"
              alt="CBC Cultivar Explorer Welcome"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              className="object-cover"
              style={{ 
                borderRadius: '20px'
              }}
              priority
            />
          </div>
          
          {/* DESKTOP: Welcome and instructions */}
          <div 
            className="absolute top-8 left-20"
            style={{
              zIndex: 10,
              color: '#000000',
              fontSize: '48px',
              fontWeight: 'bold',
              fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
              pointerEvents: 'none',
              whiteSpace: 'nowrap', 
              marginLeft: '16px', 
              marginTop: '8px',
            }}
          >
            CULTIVAR EXPLORER
          </div>
          
          {/* DESKTOP: Instructions */}
          <div 
            className="absolute left-20"
            style={{
              top: '120px',
              zIndex: 10,
              color: '#000000',
              fontSize: '24px',
              fontWeight: '500',
              fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
              pointerEvents: 'none',
              maxWidth: '600px',
              lineHeight: '1.4',
              marginLeft: '16px',
            }}
          >
            Welcome to California Berry Cultivars. Click any variety below to explore detailed insights. Trait filters are available on the right.
          </div>
          
          {/* Optional overlay for better text readability if needed */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2))',
              borderRadius: '20px',
              zIndex: 2
            }}
          />
        </div>
      </div>
    );
  }

  // If we don't have cultivar content data, fall back to original layout
  if (!cultivarContent) {
    // Show loading state while content is loading
    if (contentLoading) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid rgba(34, 197, 94, 0.3)',
              borderTop: '3px solid #22c55e',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p style={{ color: '#9CA3AF' }}>Loading cultivar content...</p>
          </div>
        </div>
      );
    }
    
    // Show fallback layout if no content found
    return (
      <div className="h-full w-full max-w-4xl mx-auto">
        {/* Main Card Container - Properly Centered */}
        <div 
          className="h-full w-full overflow-y-auto"
          style={{
            background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.85) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            // Enable smooth scrolling on all devices
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          {/* Content with consistent padding */}
          <div className="p-6 space-y-6">
            
            {/* Header Section */}
            <div className="flex items-start gap-4">
              <div className="text-4xl flex-shrink-0">{cultivar.emoji}</div>
              <div className="flex-1 min-w-0">
                <h1 
                  className="text-2xl font-bold mb-3"
                  style={{
                    background: 'linear-gradient(135deg, #00ff88 0%, #00d4aa 50%, #4ade80 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {cultivar.name}
                </h1>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      color: '#ffffff'
                    }}
                  >
                    ☀️ {cultivar.flowerType === 'DN' ? 'DAY-NEUTRAL' : 'SHORT-DAY'}
                  </span>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                      color: '#ffffff'
                    }}
                  >
                    🏪 {cultivar.marketType.toUpperCase()}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed">
                  {cultivar.description}
                </p>
              </div>
            </div>

            {/* Performance Metrics Header */}
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-green-400" style={{ fontFamily: 'var(--font-body)' }}>{t('performanceMetrics')}</h2>
            </div>

            {/* Stats Grid - 2x2 Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Yield */}
              <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)' }}> {t('yield')} </div>
                <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)' }}>45.0t/ha</div>
              </div>

              {/* Size */}
              <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)' }}> {t('size')} </div>
                <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)' }}>Large</div>
              </div>

              {/* Appearance */}
              <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)' }}> {t('appearance')} </div>
                <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)' }}>Excellent</div>
              </div>

              {/* Firmness */}
              <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)' }}> {t('firmness')} </div>
                <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)' }}>High</div>
              </div>
            </div>

            {/* Key Attributes Header */}
            <div className="flex items-center gap-2">
              <span className="text-xl">🧬</span>
              <h2 className="text-lg font-semibold text-green-400">{t('keyAttributes')}</h2>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[...cultivar.attributes, ...cultivar.attribute2].slice(0, 6).map((attribute, index) => (
                <div
                  key={`${attribute}-${index}`}
                  className="p-3 rounded-lg text-center"
                  style={{
                    background: 'linear-gradient(145deg, rgba(26, 35, 50, 0.6) 0%, rgba(36, 45, 61, 0.7) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="text-lg mb-1">{getAttributeIcon(attribute)}</div>
                  <div className="text-xs text-gray-300 font-medium leading-tight">
                    {attribute}
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Chart Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Performance Comparison</h3>
                
                {/* Cultivar Selector */}
                <CultivarSelector
                  selectedCultivar={selectedCultivar}
                  onCultivarChange={setSelectedCultivar}
                  comparisonCultivar={comparisonCultivar}
                  onComparisonChange={setComparisonCultivar}
                />
                
                {/* Chart Component */}
                <CultivarChart 
                  cultivarId={selectedCultivar}
                  comparisonCultivarId={comparisonCultivar}
                  height={400}
                />
                
                {/* Spider Chart */}
                <SpiderChart 
                  cultivarId={selectedCultivar}
                  comparisonCultivarId={comparisonCultivar}
                  height={350}
                />
              </div>
            </div>

            {/* Bottom Spacing */}
            <div className="h-8"></div>
          </div>
        </div>
      </div>
    );
  }

  // Data-driven marketing layout for cultivars with content data
  // Mobile Portrait Layout - Vertical Stack
  if (isMobile && !isLandscape) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4" style={{paddingTop: '16px'}}>
        {/* Main Card Container - Mobile Portrait */}
        <div 
          className="w-full h-full scrollbar-hidden"
          style={{
            maxWidth: 'calc(100vw - 16px)',
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.3) 60%, rgba(68, 5, 177, 0.4) 100%)',            
            backdropFilter: 'blur(6px) saturate(220%)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(34, 197, 94, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            overflowY: 'auto',
            overflowX: 'visible',
            margin: '8px'
          }}
        >
          {/* Inner container */}
          <div 
            className="overflow-y-auto scrollbar-hidden"
            style={{
              margin: '2px',
              borderRadius: '20px',
              background: 'transparent',
              overflowX: 'hidden',
              position: 'relative',
              minWidth: 0,
              touchAction: 'pan-y',
              userSelect: 'none',
              height: 'calc(100% - 4px)',
              width: 'calc(100% - 4px)'
            }}
          >
            {/* Vertical Stack Layout for Mobile Portrait */}
            <div className="p-4">
              
              {/* Premium Filter-style Buttons - Desktop */}
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
                className="mb-6 scrollbar-hidden"
                style={{
                  width: '100%',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  position: 'relative',
                  zIndex: 300,
                  minWidth: '0', // allow flex children to shrink
                  height: 'auto', // Let content determine height
                  minHeight: '30px', // Ensure enough space for hover effects
                  paddingTop: '2px', // Increased padding to allow for translateY(-8px) and scale(1.05)
                  paddingBottom: '8px', // Increased padding to allow for button expansion
                  paddingLeft: '12px',
                  paddingRight: '12px', // Extra padding on sides for scale(1.05) expansion
                  overflowX: 'auto', // Horizontal scroll for buttons
                  overflowY: 'visible', // Allow vertical expansion during hover
                }}
              >
                <div className="flex flex-nowrap gap-3 min-w-max px-1" style={{ position: 'relative', zIndex: 400 }}>
                  {buttonConfigs.map((button) => (
                    <span 
                      key={button.id}
                      className={`theme-base-premium-button ${button.className} cultivar-tag whitespace-nowrap`}
                      onClick={() => handleInfoClick(button.id)}
                      style={{
                        fontSize: '0.95rem', // 15-20% smaller than 1.1rem
                        fontWeight: 700,     // bold
                        textTransform: 'uppercase', // force capitalization
                        letterSpacing: '0.02em'
                      }}
                    >
                      {button.labelKey ? t(button.labelKey) : button.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Photo carousel */}
              <ImageCarousel
                images={cultivarContent.images.carousel}
                alt={cultivarContent.displayName}
                isMobile={true}
                autoRotateInterval={6000}
                cultivarName={cultivarContent.displayName}
              />

              {/* Description section - IMPROVED: Added glass container background */}
              <div 
                className="mb-6 p-6 rounded-lg overflow-y-auto"
                style={{
                  background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.85) 0%, rgba(31, 41, 55, 0.85) 100%)',
                  backdropFilter: 'blur(15px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 255, 136, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  padding: '8px' // Added extra padding so text doesn't touch edges
                }}
              >
                <h2 
                  className="text-xl font-bold mb-4"
                  style={{
                    color: '#00ff88',
                    textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
                  }}
                >
                  {cultivarContent.description.title}
                </h2>
                <div className="space-y-4">
                  {cultivarContent.description.paragraphs.map((paragraph, index) => (
                    <p 
                      key={index}
                      className="text-sm leading-relaxed"
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        lineHeight: '1.6'
                      }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Performance Metrics Grid - Mobile */}
              <div className="mb-6">
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{
                    color: '#000000',
                  }}
                >
                  {t('performanceMetrics')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Yield */}
                  <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                    <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '8px' }}> {t('yield')} </div>
                    <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '8px' }}>{cultivarContent?.performanceMetrics?.yield || '45.0t/ha'}</div>
                  </div>
                  {/* Size */}
                  <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                    <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '8px' }}> {t('size')} </div>
                    <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '8px' }}>{cultivarContent?.performanceMetrics?.size || 'Large'}</div>
                  </div>
                  {/* Appearance */}
                  <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                    <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '8px' }}> {t('appearance')} </div>
                    <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '8px' }}>{cultivarContent?.performanceMetrics?.appearance || 'Excellent'}</div>
                  </div>
                  {/* Firmness */}
                  <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                    <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '8px' }}> {t('firmness')} </div>
                    <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '8px' }}>{cultivarContent?.performanceMetrics?.firmness || 'High'}</div>
                  </div>
                </div>
              </div>

              {/* Recommendations Section - Mobile */}
              <div className="mb-6">
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{
                    color: '#000000',
                    textShadow: 'none'
                  }}
                >
                  {t('recommendations')}
                </h3>
                <div className="space-y-4">
                  {/* Planting Date */}
                  <div 
                    className="modern-card hover:scale-105 transition-all duration-300 group cursor-pointer"
                    style={{ 
                      padding: '16px',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>{t('plantingDate')}</div>
                    <div className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-body)' }}>
                      {cultivarContent?.recommendations?.plantingDate || 'Oct 15 - Oct 30'}
                    </div>
                  </div>
                  
                  {/* Chill Recommendation - Bigger */}
                  <div 
                    className="modern-card hover:scale-105 transition-all duration-300 group cursor-pointer"
                    style={{ 
                      padding: '16px',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>{t('chillRecommendation')}</div>
                    <div className="text-sm text-white leading-relaxed" style={{ fontFamily: 'var(--font-body)', textAlign: 'justify' }}>
                      {cultivarContent?.recommendations?.chill || 'As with most day-neutrals, supplemental chill can improve quality. We recommend between 1-2 weeks of supplemental chill.'}
                    </div>
                  </div>
                  
                  {/* Fertility Recommendation */}
                  <div 
                    className="modern-card hover:scale-105 transition-all duration-300 group cursor-pointer"
                    style={{ 
                      padding: '16px',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>{t('fertilityRecommendation')}</div>
                    <div className="text-sm text-white leading-relaxed" style={{ fontFamily: 'var(--font-body)', textAlign: 'justify' }}>
                      {cultivarContent?.recommendations?.fertility || 'Pre-plant fertilizer between 500-600 lbs of 18-8-13 in sandy soils. Regular regime during fruiting season.'}
                    </div>
                  </div>
                  
                  {/* Other Recommendations */}
                  <div 
                    className="modern-card hover:scale-105 transition-all duration-300 group cursor-pointer"
                    style={{ 
                      padding: '16px',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>{t('otherRecommendations')}</div>
                    <div className="text-sm text-white leading-relaxed" style={{ fontFamily: 'var(--font-body)', textAlign: 'justify' }}>
                      {cultivarContent?.recommendations?.other || 'Follow standard sprays for powdery mildew, botrytis, and mites. Strong resistance to Fusarium.'}
                    </div>
                  </div>

                </div>
              </div>

              {/* Chart Section - Hide for Sweet Carolina */}
              <div className="mb-6">
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{
                    color: '#000000',
                    textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
                  }}
                >
                  {t('performanceData')}
                </h3>
                
                {/* Cultivar Selector - Hide for Alturas on mobile */}
                {!mobileFixedPair && (
                  <div className="mb-4">
                    <CultivarSelector
                      selectedCultivar={selectedCultivar}
                      comparisonCultivar={comparisonCultivar}
                      onCultivarChange={setSelectedCultivar}
                      onComparisonChange={setComparisonCultivar}
                    />
                  </div>
                )}
                
                {/* Chart */}
                <div className="space-y-4">
                  <CultivarChart 
                    cultivarId={mobileFixedPair?.primary || selectedCultivar}
                    comparisonCultivarId={mobileFixedPair?.comparison || comparisonCultivar}
                    height={Math.min(400, screenWidth * 1.2)}
                  />
                  
                  {/* Spider Chart */}
                  <SpiderChart 
                    cultivarId={mobileFixedPair?.primary || selectedCultivar}
                    comparisonCultivarId={mobileFixedPair?.comparison || comparisonCultivar}
                    height={Math.min(300, screenWidth * 0.9)}
                  />
                </div>
              </div>

              {/* Marketing Banner - MOVED TO BOTTOM for Mobile */}
              <div 
                className="relative mt-8 mb-4"
                style={{
                  aspectRatio: '3/1', // 3:1 ratio (width:height) for your 20736 × 6912 images
                  background: 'transparent',
                  minHeight: '60px',
                  height: 'auto', // Let aspect ratio control height
                  borderRadius: '20px',
                  width: '100%',
                  marginTop: '16px', // Added margin between spider chart and banner
                  marginBottom: '16px', // Reduced from 50px since we now have content below
                  overflow: 'visible', // Allow buttons to hover above
                  // Add glassy container effects
                  backdropFilter: 'blur(10px) saturate(180%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 255, 136, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Image Layer - LOW Z-INDEX */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', borderRadius: '20px' }}>
                  <Image 
                    src={cultivarContent.images.banner}
                    alt={`${cultivarContent.displayName} Marketing Banner`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    style={{ borderRadius: '20px' }}
                  />
                </div>
                
                {/* FUTURISTIC 2025 EFFECTS - SAME LEVEL AS IMAGE */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 200,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    pointerEvents: 'none'
                  }}
                >
                  {/* Holographic Sweep */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '200%',
                      height: '100%',
                      background: 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.3) 50%, transparent 70%)',
                      transform: 'skewX(-20deg)',
                      animation: 'holographic-sweep 12s ease-in-out infinite',
                      zIndex: 210
                    }}
                  />
                  


                  {/* Edge Glow */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      border: '1px solid rgba(0, 255, 255, 0.3)',
                      borderRadius: '20px',
                      boxShadow: 'inset 0 0 20px rgba(0, 255, 255, 0.1)',
                      animation: 'edge-pulse 5s ease-in-out infinite',
                      zIndex: 225
                    }}
                  />
                </div>
              </div>

              {/* Contact Form - MOVED TO BOTTOM for Mobile */}
              <div className="mb-6">
                <ContactForm 
                  cultivarName={cultivarContent?.displayName || cultivar.name}
                />
              </div>

              {/* Bottom spacing for mobile scrolling */}
              <div style={{ height: '100px' }}></div>
            </div>
          </div>
        </div>

        {/* Info Overlay - Mobile Portrait */}
        <InfoOverlayMobile
          isVisible={showInfoOverlay}
          content={infoOverlay}
          onClose={closeInfoOverlay}
        />
      </div>
    );
  }

  // Desktop Layout - Data-driven marketing layout
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      {/* Main Card Container - Desktop */}
      <div 
        className="w-full h-full overflow-y-auto scrollbar-hidden"
        style={{
          maxWidth: 'calc(100vw - 16px)',
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.4) 0%, rgba(51, 120, 238, 0.2) 100%)',
          backdropFilter: 'blur(10px) saturate(100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(34, 197, 94, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          padding: '6px',
        }}
      >
        {/* Inner container */}
        <div 
          className="overflow-y-auto scrollbar-hidden"
          style={{
            margin: '6px',
            borderRadius: '20px',
            background: 'transparent',
            overflowX: 'hidden',
            position: 'relative',
            minWidth: 0,
            touchAction: 'pan-y',
            userSelect: 'none',
            height: 'calc(100% - 12px)',
            width: 'calc(100% - 12px)'
          }}
        >
          {/* Content Layout */}
          <div className="p-6 h-full">
            
            {/* Main Content Grid - Add 24px gap between columns */}
            <div className="grid grid-cols-2 h-full" style={{ gap: '24px' }}>
              
              {/* Left Column */}
              <div className="flex flex-col">
                
                {/* Marketing Banner */}
                <div 
                  className="relative"
                  style={{
                    aspectRatio: '3/1',
                    background: 'transparent',
                    minHeight: '60px',
                    height: 'auto',
                    marginBottom: '12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    zIndex: 100
                  }}
                >
                  {/* Image Layer */}
                  <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', borderRadius: '20px' }}>
                    <Image 
                      src={cultivarContent.images.banner}
                      alt={`${cultivarContent.displayName} Marketing Banner`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      style={{ borderRadius: '20px' }}
                    />
                  </div>
                  
                  {/* FUTURISTIC 2025 EFFECTS */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 200,
                      borderRadius: '20px',
                      overflow: 'hidden',
                      pointerEvents: 'none'
                    }}
                  >
                    {/* Holographic Sweep */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '200%',
                        height: '100%',
                        background: 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.3) 50%, transparent 70%)',
                        transform: 'skewX(-20deg)',
                        animation: 'holographic-sweep 12s ease-in-out infinite',
                        zIndex: 210
                      }}
                    />
                    


                    {/* Edge Glow */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        border: '1px solid rgba(0, 255, 255, 0.3)',
                        borderRadius: '20px',
                        boxShadow: 'inset 0 0 20px rgba(0, 255, 255, 0.1)',
                        animation: 'edge-pulse 5s ease-in-out infinite',
                        zIndex: 225
                      }}
                    />
                  </div>
                </div>

                {/* Premium Filter-style Buttons - Desktop */}
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
                  className="mb-6 scrollbar-hidden"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    position: 'relative',
                    zIndex: 300,
                    minWidth: '0', // allow flex children to shrink
                    height: 'auto', // Let content determine height
                    minHeight: '30px', // Ensure enough space for hover effects
                    paddingTop: '2px', // Increased padding to allow for translateY(-8px) and scale(1.05)
                    paddingBottom: '8px', // Increased padding to allow for button expansion
                    paddingLeft: '12px',
                    paddingRight: '12px', // Extra padding on sides for scale(1.05) expansion
                    overflowX: 'auto', // Horizontal scroll for buttons
                    overflowY: 'visible', // Allow vertical expansion during hover
                  }}
                >
                  <div className="flex flex-nowrap gap-3 min-w-max px-1">
                    {buttonConfigs.map((button) => (
                      <span 
                        key={button.id}
                        className={`theme-base-premium-button ${button.className} cultivar-tag whitespace-nowrap`}
                        onClick={() => handleInfoClick(button.id)}
                        style={{
                          fontSize: '0.95rem', // 15-20% smaller than 1.1rem
                          fontWeight: 700,     // bold
                          textTransform: 'uppercase', // force capitalization
                          letterSpacing: '0.02em'
                        }}
                      >
                        {button.labelKey ? t(button.labelKey) : button.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description Text */}
                <div 
                  className="p-6 rounded-lg overflow-y-auto"
                  style={{
                    background: 'linear-gradient(145deg, rgba(214, 11, 11, 0.8) 0%, rgba(36, 45, 61, 0.8) 100%)',
                    backdropFilter: 'blur(2px) saturate(380%)',
                    borderRadius: '20px',
                    padding: '12px',
                    marginTop: '12px'
                  }}
                >
                  <h3 className="text-green-400 font-bold mb-4 text-lg">{cultivarContent.description.title}</h3>
                  {cultivarContent.description.paragraphs.map((paragraph: string, index: number) => (
                    <p key={index} className="text-gray-300 text-sm leading-relaxed mt-3" style={{ textAlign: 'justify' }}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Performance Metrics Grid - Desktop */}
                <div style={{ marginTop: '20px', marginLeft: '30px', marginRight: '30px' }}>
                  <div className="grid grid-cols-2">
                    {/* Row 1 */}
                    <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer" style={{ marginRight: '32px', marginBottom: '16px' }}>
                      <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '16px' }}> {t('yield')} </div>
                      <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '16px' }}>{cultivarContent?.performanceMetrics?.yield || '45.0t/ha'}</div>
                    </div>
                    <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer" style={{ marginLeft: '32px', marginBottom: '16px' }}>
                      <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '16px' }}> {t('size')} </div>
                      <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '16px' }}>{cultivarContent?.performanceMetrics?.size || 'Large'}</div>
                    </div>
                    
                    {/* Row 2 */}
                    <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer" style={{ marginRight: '32px', marginTop: '16px' }}>
                      <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '16px' }}> {t('appearance')} </div>
                      <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '16px' }}>{cultivarContent?.performanceMetrics?.appearance || 'Excellent'}</div>
                    </div>
                    <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer" style={{ marginLeft: '32px', marginTop: '16px' }}>
                      <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '16px' }}> {t('firmness')} </div>
                      <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '16px' }}>{cultivarContent?.performanceMetrics?.firmness || 'High'}</div>
                    </div>
                  </div>
                </div>

                {/* Recommendations Section - Desktop */}
                <div style={{ marginTop: '24px', marginLeft: '30px', marginRight: '30px' }}>
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{
                      color: '#000000',
                      textShadow: 'none'
                    }}
                  >
                    {t('recommendations')}
                  </h3>
                  <div className="space-y-4">
                    {/* Planting Date */}
                    <div 
                      className="modern-card hover:scale-105 transition-all duration-300 group cursor-pointer"
                      style={{ 
                        padding: '16px',
                        marginBottom: '12px'
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>{t('plantingDate')}</div>
                      <div className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-body)' }}>
                        {cultivarContent?.recommendations?.plantingDate || 'Oct 15 - Oct 30'}
                      </div>
                    </div>
                    
                    {/* Chill Recommendation - Bigger */}
                    <div 
                      className="modern-card hover:scale-105 transition-all duration-300 group cursor-pointer"
                      style={{ 
                        padding: '16px',
                        marginBottom: '12px'
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>{t('chillRecommendation')}</div>
                      <div className="text-sm text-white leading-relaxed" style={{ fontFamily: 'var(--font-body)', textAlign: 'justify' }}>
                        {cultivarContent?.recommendations?.chill || 'As with most day-neutrals, supplemental chill can improve quality. We recommend between 1-2 weeks of supplemental chill.'}
                      </div>
                    </div>
                    
                    {/* Fertility Recommendation */}
                    <div 
                      className="modern-card hover:scale-105 transition-all duration-300 group cursor-pointer"
                      style={{ 
                        padding: '16px',
                        marginBottom: '12px'
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>{t('fertilityRecommendation')}</div>
                      <div className="text-sm text-white leading-relaxed" style={{ fontFamily: 'var(--font-body)', textAlign: 'justify' }}>
                        {cultivarContent?.recommendations?.fertility || 'Pre-plant fertilizer between 500-600 lbs of 18-8-13 in sandy soils. Regular regime during fruiting season.'}
                      </div>
                    </div>
                    
                    {/* Other Recommendations */}
                    <div 
                      className="modern-card hover:scale-105 transition-all duration-300 group cursor-pointer"
                      style={{ 
                        padding: '16px',
                        marginBottom: '12px'
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>{t('otherRecommendations')}</div>
                      <div className="text-sm text-white leading-relaxed" style={{ fontFamily: 'var(--font-body)', textAlign: 'justify' }}>
                        {cultivarContent?.recommendations?.other || 'Follow standard sprays for powdery mildew, botrytis, and mites. Strong resistance to Fusarium.'}
                      </div>
                    </div>

                    {/* Contact Form */}
                    <ContactForm 
                      cultivarName={cultivarContent?.displayName || cultivar.name}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Photo Carousel and Chart */}
              <div className="flex flex-col">
                
                {/* Photo Carousel */}
                <ImageCarousel
                  images={cultivarContent.images.carousel}
                  alt={cultivarContent.displayName}
                  isMobile={false}
                  autoRotateInterval={6000}
                  showIndicators={true}
                  cultivarName={cultivarContent.displayName}
                />

                {/* Performance Chart */}
                <div style={{ marginTop: '24px' }}>
                  {/* Cultivar Selector - Hide for Sweet Carolina */}
                  { (
                  <div style={{ marginBottom: '20px' }}>
                    {isAlturasPage ? (
                      /* Alturas-specific selector */
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
                        {/* Header */}
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
                            {t('compare')} {cultivar.name}
                          </h3>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <button
                              onClick={() => setComparisonCultivar(undefined)}
                              style={{
                                padding: '12px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                borderRadius: '8px',
                                border: '1px solid rgba(156, 163, 175, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: 'var(--font-body, system-ui)',
                                background: !comparisonCultivar ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(31, 41, 55, 0.8)',
                                color: !comparisonCultivar ? '#ffffff' : '#9CA3AF',
                                boxShadow: !comparisonCultivar ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none',
                                backdropFilter: 'blur(10px)',
                              }}
                            >
                              None
                            </button>
                            {comparisonOptions.map((cultivarId) => (
                              <button
                                key={cultivarId}
                                onClick={() => setComparisonCultivar(cultivarId)}
                                style={{
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(156, 163, 175, 0.3)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  fontFamily: 'var(--font-body, system-ui)',
                                  background: comparisonCultivar === cultivarId 
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100())' 
                                    : 'rgba(31, 41, 55, 0.8)',
                                  color: comparisonCultivar === cultivarId ? '#ffffff' : '#9CA3AF',
                                  boxShadow: comparisonCultivar === cultivarId ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                {cultivarId.charAt(0).toUpperCase() + cultivarId.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : isAdelantoPage ? (
                      /* Adelanto-specific selector */
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
                        {/* Header */}
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
                            {t('compare')} {cultivar.name}
                          </h3>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <button
                              onClick={() => setComparisonCultivar(undefined)}
                              style={{
                                padding: '12px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                borderRadius: '8px',
                                border: '1px solid rgba(156, 163, 175, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: 'var(--font-body, system-ui)',
                                background: !comparisonCultivar ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(31, 41, 55, 0.8)',
                                color: !comparisonCultivar ? '#ffffff' : '#9CA3AF',
                                boxShadow: !comparisonCultivar ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none',
                                backdropFilter: 'blur(10px)',
                              }}
                            >
                              None
                            </button>
                            {comparisonOptions.map((cultivarId) => (
                              <button
                                key={cultivarId}
                                onClick={() => setComparisonCultivar(cultivarId)}
                                style={{
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(156, 163, 175, 0.3)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  fontFamily: 'var(--font-body, system-ui)',
                                  background: comparisonCultivar === cultivarId 
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100())' 
                                    : 'rgba(31, 41, 55, 0.8)',
                                  color: comparisonCultivar === cultivarId ? '#ffffff' : '#9CA3AF',
                                  boxShadow: comparisonCultivar === cultivarId ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                {cultivarId.charAt(0).toUpperCase() + cultivarId.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : isAlhambraPage ? (
                      /* Alhambra-specific selector */
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
                        {/* Header */}
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
                            {t('compare')} {cultivar.name}
                          </h3>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <button
                              onClick={() => setComparisonCultivar(undefined)}
                              style={{
                                padding: '12px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                borderRadius: '8px',
                                border: '1px solid rgba(156, 163, 175, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: 'var(--font-body, system-ui)',
                                background: !comparisonCultivar ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(31, 41, 55, 0.8)',
                                color: !comparisonCultivar ? '#ffffff' : '#9CA3AF',
                                boxShadow: !comparisonCultivar ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none',
                                backdropFilter: 'blur(10px)',
                              }}
                            >
                              None
                            </button>
                            {comparisonOptions.map((cultivarId) => (
                              <button
                                key={cultivarId}
                                onClick={() => setComparisonCultivar(cultivarId)}
                                style={{
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(156, 163, 175, 0.3)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  fontFamily: 'var(--font-body, system-ui)',
                                  background: comparisonCultivar === cultivarId 
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100())' 
                                    : 'rgba(31, 41, 55, 0.8)',
                                  color: comparisonCultivar === cultivarId ? '#ffffff' : '#9CA3AF',
                                  boxShadow: comparisonCultivar === cultivarId ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                {cultivarId.charAt(0).toUpperCase() + cultivarId.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : isArtesiaPage ? (
                      /* Artesia-specific selector */
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
                        {/* Header */}
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
                            {t('compare')} {cultivar.name}
                          </h3>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <button
                              onClick={() => setComparisonCultivar(undefined)}
                              style={{
                                padding: '12px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                borderRadius: '8px',
                                border: '1px solid rgba(156, 163, 175, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: 'var(--font-body, system-ui)',
                                background: !comparisonCultivar ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(31, 41, 55, 0.8)',
                                color: !comparisonCultivar ? '#ffffff' : '#9CA3AF',
                                boxShadow: !comparisonCultivar ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none',
                                backdropFilter: 'blur(10px)',
                              }}
                            >
                              None
                            </button>
                            {comparisonOptions.map((cultivarId) => (
                              <button
                                key={cultivarId}
                                onClick={() => setComparisonCultivar(cultivarId)}
                                style={{
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(156, 163, 175, 0.3)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  fontFamily: 'var(--font-body, system-ui)',
                                  background: comparisonCultivar === cultivarId 
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100())' 
                                    : 'rgba(31, 41, 55, 0.8)',
                                  color: comparisonCultivar === cultivarId ? '#ffffff' : '#9CA3AF',
                                  boxShadow: comparisonCultivar === cultivarId ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                {cultivarId.charAt(0).toUpperCase() + cultivarId.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : isBelvederePage ? (
                      /* Belvedere-specific selector */
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
                        {/* Header */}
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
                            {t('compare')} {cultivar.name}
                          </h3>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <button
                              onClick={() => setComparisonCultivar(undefined)}
                              style={{
                                padding: '12px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                borderRadius: '8px',
                                border: '1px solid rgba(156, 163, 175, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: 'var(--font-body, system-ui)',
                                background: !comparisonCultivar ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(31, 41, 55, 0.8)',
                                color: !comparisonCultivar ? '#ffffff' : '#9CA3AF',
                                boxShadow: !comparisonCultivar ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none',
                                backdropFilter: 'blur(10px)',
                              }}
                            >
                              None
                            </button>
                            {comparisonOptions.map((cultivarId) => (
                              <button
                                key={cultivarId}
                                onClick={() => setComparisonCultivar(cultivarId)}
                                style={{
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(156, 163, 175, 0.3)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  fontFamily: 'var(--font-body, system-ui)',
                                  background: comparisonCultivar === cultivarId 
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100())' 
                                    : 'rgba(31, 41, 55, 0.8)',
                                  color: comparisonCultivar === cultivarId ? '#ffffff' : '#9CA3AF',
                                  boxShadow: comparisonCultivar === cultivarId ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                {cultivarId.charAt(0).toUpperCase() + cultivarId.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : isCastaicPage ? (
                      /* Castaic-specific selector */
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
                        {/* Header */}
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
                            {t('compare')} {cultivar.name}
                          </h3>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <button
                              onClick={() => setComparisonCultivar(undefined)}
                              style={{
                                padding: '12px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                borderRadius: '8px',
                                border: '1px solid rgba(156, 163, 175, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: 'var(--font-body, system-ui)',
                                background: !comparisonCultivar ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(31, 41, 55, 0.8)',
                                color: !comparisonCultivar ? '#ffffff' : '#9CA3AF',
                                boxShadow: !comparisonCultivar ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none',
                                backdropFilter: 'blur(10px)',
                              }}
                            >
                              None
                            </button>
                            {comparisonOptions.map((cultivarId) => (
                              <button
                                key={cultivarId}
                                onClick={() => setComparisonCultivar(cultivarId)}
                                style={{
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(156, 163, 175, 0.3)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  fontFamily: 'var(--font-body, system-ui)',
                                  background: comparisonCultivar === cultivarId 
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100())' 
                                    : 'rgba(31, 41, 55, 0.8)',
                                  color: comparisonCultivar === cultivarId ? '#ffffff' : '#9CA3AF',
                                  boxShadow: comparisonCultivar === cultivarId ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                {cultivarId.charAt(0).toUpperCase() + cultivarId.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : isCarpinteriaPage ? (
                      /* Carpinteria-specific selector */
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
                        {/* Header */}
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
                            {t('compare')} {cultivar.name}
                          </h3>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <button
                              onClick={() => setComparisonCultivar(undefined)}
                              style={{
                                padding: '12px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                borderRadius: '8px',
                                border: '1px solid rgba(156, 163, 175, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: 'var(--font-body, system-ui)',
                                background: !comparisonCultivar ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(31, 41, 55, 0.8)',
                                color: !comparisonCultivar ? '#ffffff' : '#9CA3AF',
                                boxShadow: !comparisonCultivar ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none',
                                backdropFilter: 'blur(10px)',
                              }}
                            >
                              None
                            </button>
                            {comparisonOptions.map((cultivarId) => (
                              <button
                                key={cultivarId}
                                onClick={() => setComparisonCultivar(cultivarId)}
                                style={{
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(156, 163, 175, 0.3)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  fontFamily: 'var(--font-body, system-ui)',
                                  background: comparisonCultivar === cultivarId 
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100())' 
                                    : 'rgba(31, 41, 55, 0.8)',
                                  color: comparisonCultivar === cultivarId ? '#ffffff' : '#9CA3AF',
                                  boxShadow: comparisonCultivar === cultivarId ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                {cultivarId.charAt(0).toUpperCase() + cultivarId.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : isBrisbanePage ? (
                      /* Brisbane-specific selector */
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
                        {/* Header */}
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
                            {t('compare')} {cultivar.name}
                          </h3>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <button
                              onClick={() => setComparisonCultivar(undefined)}
                              style={{
                                padding: '12px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                borderRadius: '8px',
                                border: '1px solid rgba(156, 163, 175, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: 'var(--font-body, system-ui)',
                                background: !comparisonCultivar ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(31, 41, 55, 0.8)',
                                color: !comparisonCultivar ? '#ffffff' : '#9CA3AF',
                                boxShadow: !comparisonCultivar ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none',
                                backdropFilter: 'blur(10px)',
                              }}
                            >
                              None
                            </button>
                            {comparisonOptions.map((cultivarId) => (
                              <button
                                key={cultivarId}
                                onClick={() => setComparisonCultivar(cultivarId)}
                                style={{
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(156, 163, 175, 0.3)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  fontFamily: 'var(--font-body, system-ui)',
                                  background: comparisonCultivar === cultivarId 
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100())' 
                                    : 'rgba(31, 41, 55, 0.8)',
                                  color: comparisonCultivar === cultivarId ? '#ffffff' : '#9CA3AF',
                                  boxShadow: comparisonCultivar === cultivarId ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                {cultivarId.charAt(0).toUpperCase() + cultivarId.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : isSweetCarolinaPage ? (
                      /* Sweet Carolina-specific selector */
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
                        {/* Header */}
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
                            {t('compare')} {cultivar.name}
                          </h3>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <button
                              onClick={() => setComparisonCultivar(undefined)}
                              style={{
                                padding: '12px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                borderRadius: '8px',
                                border: '1px solid rgba(156, 163, 175, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: 'var(--font-body, system-ui)',
                                background: !comparisonCultivar ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(31, 41, 55, 0.8)',
                                color: !comparisonCultivar ? '#ffffff' : '#9CA3AF',
                                boxShadow: !comparisonCultivar ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none',
                                backdropFilter: 'blur(10px)',
                              }}
                            >
                              None
                            </button>
                            {comparisonOptions.map((cultivarId) => (
                              <button
                                key={cultivarId}
                                onClick={() => setComparisonCultivar(cultivarId)}
                                style={{
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(156, 163, 175, 0.3)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  fontFamily: 'var(--font-body, system-ui)',
                                  background: comparisonCultivar === cultivarId 
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100())' 
                                    : 'rgba(31, 41, 55, 0.8)',
                                  color: comparisonCultivar === cultivarId ? '#ffffff' : '#9CA3AF',
                                  boxShadow: comparisonCultivar === cultivarId ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                {cultivarId === 'ruby-june' ? 'Ruby June' : cultivarId.charAt(0).toUpperCase() + cultivarId.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Regular selector for other cultivars */
                      <CultivarSelector
                        selectedCultivar={selectedCultivar}
                        onCultivarChange={setSelectedCultivar}
                        comparisonCultivar={comparisonCultivar}
                        onComparisonChange={setComparisonCultivar}
                      />
                    )}
                  </div>
                  )}
                  
                  {/* Chart Component - Hide for Sweet Carolina */}
                  { (
                    <>
                  <CultivarChart 
                    cultivarId={selectedCultivar}
                    comparisonCultivarId={comparisonCultivar}
                    height={400}
                  />
                  
                  {/* Spider Chart */}
                  <SpiderChart 
                    cultivarId={selectedCultivar}
                    comparisonCultivarId={comparisonCultivar}
                    height={350}
                  />
                    </>
                  )}
                </div>

              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Info Overlay - Desktop */}
      {!isMobile && showInfoOverlay && infoOverlay && (
        (() => {
          // Determine if this overlay is cultivar-specific
          const isCultivarSpecific = Boolean(cultivarSpecificInfoData[cultivar.id]?.[infoOverlay.key]);
          const translationKey = isCultivarSpecific ? `${cultivar.id}-${infoOverlay.key}` : infoOverlay.key;
          const overlayTranslation = getInfoOverlay(translationKey) || getInfoOverlay(infoOverlay.key);
          const finalTitle = overlayTranslation?.title || infoOverlay.content.title;
          const finalContent = overlayTranslation?.content || infoOverlay.content.content;
          const finalIcon = infoOverlay.content.icon;
          return (
            <div className={`info-overlay ${showInfoOverlay ? 'show' : ''}`} onClick={closeInfoOverlay}>
              <div className="info-card" onClick={(e) => e.stopPropagation()}>
                <div className="info-card-close" onClick={closeInfoOverlay}>
                  ×
                </div>
                <div className="info-card-header">
                  <div className="info-card-icon">{finalIcon}</div>
                  <div className="info-card-title">{finalTitle}</div>
                </div>
                <div 
                  className="info-card-content" 
                  dangerouslySetInnerHTML={{ __html: finalContent }}
                />
              </div>
            </div>
          );
        })()
      )}

      {/* Info Overlay - Mobile */}
      {isMobile && infoOverlay && infoOverlay.key && infoOverlay.content && (
        <InfoOverlayMobile
          isVisible={showInfoOverlay}
          content={{
            key: infoOverlay.key,
            content: infoOverlay.content,
            cultivarId: cultivar.id,
            isCultivarSpecific: Boolean(cultivarSpecificInfoData[cultivar.id]?.[infoOverlay.key])
          }}
          onClose={closeInfoOverlay}
        />
      )}
    </div>
  );
}

function getAttributeIcon(attribute: string): string {
  const iconMap: { [key: string]: string } = {
    'fusarium resistant': '🛡️',
    'ultra early': '🌅',
    'excellent flavor': '😋',
    'premium quality': '💎',
    'organic': '🌿',
    'high yields': '📈',
    'cold tolerant': '❄️',
    'rugged': '💪',
    'Heat Tolerant': '🔥',
    'Firm Fruit': '💪',
    'Disease Resistant': '🛡️',
    'Cold Hardy': '❄️',
    'Sweet': '🍯',
    'Excellent Flavor': '😋',
    'Premium Quality': '💎'
  };
  return iconMap[attribute] || '🌱';
} 