import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Cultivar } from '../types/cultivar';
import { getInfoOverlayData, InfoOverlayContent, generateButtonConfigs } from '../data/infoOverlayContent';
import CultivarChart from './CultivarChart';
import SpiderChart from './SpiderChart';
import CultivarSelector from './CultivarSelector';
import ContactForm from './ContactForm';
import { getDefaultComparisonCultivar } from '../data/chartData';
import { getCultivarContent, CultivarContent } from '../data/cultivarContent';

interface CultivarDetailCardV2Props {
  cultivar: Cultivar;
}

export default function CultivarDetailCardV2({ cultivar }: CultivarDetailCardV2Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);
  const [infoContent, setInfoContent] = useState<InfoOverlayContent | null>(null);
  const [cultivarContent, setCultivarContent] = useState<CultivarContent | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(400); // Default width for SSR
  
  // DEBUG: Add console logging
  console.log('DEBUG: Component render - cultivar.id:', cultivar.id, 'isMobile:', isMobile, 'isLandscape:', isLandscape);
  
  // Chart state management
  const [selectedCultivar, setSelectedCultivar] = useState(cultivar.id);
  const [comparisonCultivar, setComparisonCultivar] = useState<string | undefined>(undefined);

  // Alturas-specific logic
  const isAlturasPage = cultivar.id === 'alturas';
  const alturasComparisonOptions = useMemo(() => ['monterey', 'cabrillo', 'carpinteria'], []);
  
  // Adelanto-specific logic
  const isAdelantoPage = cultivar.id === 'adelanto';
  const adelantoComparisonOptions = ['belvedere', 'castaic', 'fronteras'];
  
  // Alhambra-specific logic
  const isAlhambraPage = cultivar.id === 'alhambra';
  const alhambraComparisonOptions = ['portola'];

  // Artesia-specific logic
  const isArtesiaPage = cultivar.id === 'artesia';
  const artesiaComparisonOptions = ['monterey', 'cabrillo'];

  // Belvedere-specific logic
  const isBelvederePage = cultivar.id === 'belvedere';
  const belvedereComparisonOptions = ['adelanto', 'castaic', 'fronteras'];

  // Castaic-specific logic
  const isCastaicPage = cultivar.id === 'castaic';
  const castaicComparisonOptions = ['adelanto', 'belvedere', 'fronteras'];

  // Carpinteria-specific logic
  const isCarpinteriaPage = cultivar.id === 'carpinteria';
  const carpinteriaComparisonOptions = ['monterey', 'cabrillo', 'alturas'];

  // Brisbane-specific logic
  const isBrisbanePage = cultivar.id === 'brisbane';
  const brisbaneComparisonOptions = ['monterey', 'cabrillo'];

  // Sweet Carolina-specific logic
  const isSweetCarolinaPage = cultivar.id === 'sweet-carolina';
  const sweetCarolinaComparisonOptions = ['ruby-june'];

  // Mobile fixed pair for Alturas
  const mobileFixedPair = isAlturasPage ? { 
    primary: 'alturas', 
    comparison: 'monterey' 
  } : isAdelantoPage ? {
    primary: 'adelanto',
    comparison: 'belvedere'
  } : isAlhambraPage ? {
    primary: 'alhambra',
    comparison: 'portola'
  } : isArtesiaPage ? {
    primary: 'artesia',
    comparison: 'monterey'
  } : isBelvederePage ? {
    primary: 'belvedere',
    comparison: undefined // Default to none for Belvedere
  } : isCastaicPage ? {
    primary: 'castaic',
    comparison: 'fronteras' // Mobile fixed pair: Castaic vs Fronteras
  } : isCarpinteriaPage ? {
    primary: 'carpinteria',
    comparison: 'monterey' // Mobile fixed pair: Carpinteria vs Monterey
  } : isBrisbanePage ? {
    primary: 'brisbane',
    comparison: 'monterey' // Mobile fixed pair: Brisbane vs Monterey
  } : isSweetCarolinaPage ? {
    primary: 'sweet-carolina',
    comparison: 'ruby-june'
  } : null;

  // Reset comparison cultivar when switching between different cultivars
  useEffect(() => {
    setComparisonCultivar(undefined);
  }, [cultivar.id]);

  // Set initial default comparison for specific pages only once
  useEffect(() => {
    if (isAlturasPage && comparisonCultivar === undefined) {
      // Only set default if no comparison is set initially
      const defaultComparison = getDefaultComparisonCultivar(cultivar.id);
      if (defaultComparison && alturasComparisonOptions.includes(defaultComparison)) {
        setComparisonCultivar(defaultComparison);
      } else {
        setComparisonCultivar('monterey');
      }
    }
    
    if (isAdelantoPage && comparisonCultivar === undefined) {
      // Default to None for Adelanto
      setComparisonCultivar(undefined);
    }
    
    if (isAlhambraPage && comparisonCultivar === undefined) {
      // Default to None for Alhambra  
      setComparisonCultivar(undefined);
    }
    
    if (isArtesiaPage && comparisonCultivar === undefined) {
      // Default to None for Artesia
      setComparisonCultivar(undefined);
    }
    
    if (isBelvederePage && comparisonCultivar === undefined) {
      // Default to None for Belvedere
      setComparisonCultivar(undefined);
    }
    
    if (isCastaicPage && comparisonCultivar === undefined) {
      // Default to None for Castaic
      setComparisonCultivar(undefined);
    }
    
    if (isCarpinteriaPage && comparisonCultivar === undefined) {
      // Default to None for Carpinteria
      setComparisonCultivar(undefined);
    }
    
    if (isBrisbanePage && comparisonCultivar === undefined) {
      // Default to None for Brisbane
      setComparisonCultivar(undefined);
    }
    
    if (isSweetCarolinaPage && comparisonCultivar === undefined) {
      // Default to None for Sweet Carolina  
      setComparisonCultivar(undefined);
    }
  }, [isAlturasPage, isAdelantoPage, isAlhambraPage, isArtesiaPage, isBelvederePage, isCastaicPage, isCarpinteriaPage, isBrisbanePage, isSweetCarolinaPage, comparisonCultivar, alturasComparisonOptions, cultivar.id]);

  // For specific pages, ensure selectedCultivar stays locked
  useEffect(() => {
    if (isAlturasPage && selectedCultivar !== 'alturas') {
      setSelectedCultivar('alturas');
    }
    if (isAdelantoPage && selectedCultivar !== 'adelanto') {
      setSelectedCultivar('adelanto');
    }
    if (isAlhambraPage && selectedCultivar !== 'alhambra') {
      setSelectedCultivar('alhambra');
    }
    if (isArtesiaPage && selectedCultivar !== 'artesia') {
      setSelectedCultivar('artesia');
    }
    if (isBelvederePage && selectedCultivar !== 'belvedere') {
      setSelectedCultivar('belvedere');
    }
    if (isCastaicPage && selectedCultivar !== 'castaic') {
      setSelectedCultivar('castaic');
    }
    if (isCarpinteriaPage && selectedCultivar !== 'carpinteria') {
      setSelectedCultivar('carpinteria');
    }
    if (isBrisbanePage && selectedCultivar !== 'brisbane') {
      setSelectedCultivar('brisbane');
    }
    if (isSweetCarolinaPage && selectedCultivar !== 'sweet-carolina') {
      setSelectedCultivar('sweet-carolina');
    }
  }, [isAlturasPage, isAdelantoPage, isAlhambraPage, isArtesiaPage, isBelvederePage, isCastaicPage, isCarpinteriaPage, isBrisbanePage, isSweetCarolinaPage, selectedCultivar]);

  // Load cultivar content on mount
  useEffect(() => {
    const loadContent = async () => {
      setContentLoading(true);
      try {
        const content = await getCultivarContent(cultivar.id);
        setCultivarContent(content);
      } catch (error) {
        console.error('Error loading cultivar content:', error);
        setCultivarContent(null);
      } finally {
        setContentLoading(false);
      }
    };
    
    loadContent();
  }, [cultivar.id]);

  // Get info overlay data and button configs for this specific cultivar
  const infoData = getInfoOverlayData(cultivar.id);
  const buttonConfigs = generateButtonConfigs(cultivar);

  const handleInfoClick = (buttonType: string) => {
    if (!isMobile) { // Only show overlay on desktop
      const info = infoData[buttonType];
      if (info) {
        setInfoContent(info);
        setShowInfoOverlay(true);
      }
    }
  };

  const closeInfoOverlay = () => {
    setShowInfoOverlay(false);
    setInfoContent(null);
  };

  // Mobile and orientation detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsMobile(width < 768);
      setIsLandscape(width > height);
      setScreenWidth(width);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('orientationchange', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('orientationchange', checkScreenSize);
    };
  }, []);

  // Auto-rotate images every 4 seconds with fade transition
  useEffect(() => {
    if (cultivarContent?.images?.carousel) {
      const images = cultivarContent.images.carousel;
        
      const interval = setInterval(() => {
        // Start fade out
        setImageOpacity(0);
        
        setTimeout(() => {
          // Change image after fade out completes
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
          // Start fade in
          setImageOpacity(1);
        }, 800); // Increased fade out time for smoother transition
        
      }, 6000); // Slowed down from 4 seconds to 6 seconds (50% slower)

      return () => clearInterval(interval);
    }
  }, [cultivarContent]);

  // Special intro page layout for debug cultivar
  console.log('DEBUG: Checking cultivar.id === debug:', cultivar.id === 'debug', 'cultivar.id:', cultivar.id);
  if (cultivar.id === 'debug') {
    console.log('DEBUG: Inside debug check - isMobile:', isMobile, 'isLandscape:', isLandscape);
    // Mobile Portrait Layout for Debug
    if (isMobile && !isLandscape) {
      console.log('DEBUG: Rendering mobile debug layout');
      return (
        <div className="h-full w-full relative" style={{ margin: '0px' }}> {/* FIXED: Negative margin to counteract parent padding */}
          <div 
            className="w-full h-full overflow-hidden"
            style={{
              background: 'transparent', // FIXED: Removed debug background
              borderRadius: '20px',
              position: 'relative',
              // FIXED: Removed debug border
              height: '100vh', // FIXED: Use full viewport height
              width: 'calc(100vw - 16px)' // FIXED: Account for horizontal margins
              
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
                  borderRadius: '20px', // FIXED: Ensure mobile rounded corners
                  objectPosition: '75% center', // MOBILE: Show more of the right side (strawberry)
                  maxWidth: '100%',
                  maxHeight: 'calc(100vh - 180px)', // FIXED: Account for horizontal margins
                  marginLeft: '6px'

                }}
                priority
                onError={() => console.log('DEBUG: Mobile image failed to load')}
                onLoad={() => console.log('DEBUG: Mobile image loaded successfully')}
              />
            </div>
            
            {/* Mobile text overlay - Welcome message */}
            <div 
              className="absolute top-16 left-6"
              style={{
                zIndex: 20, // Higher z-index to ensure it shows above everything
                color: '#000000',
                fontSize: '22px',
                fontWeight: 'bold',
                fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
                pointerEvents: 'none',
                maxWidth: 'calc(100vw - 48px)', // Account for full viewport width
                padding: '8px 12px',
                borderRadius: '8px', 
                marginLeft: '12px',
                marginRight: '55px', 
                marginTop: '12px'
              }}
            >
              CBC Cultivar Explorer
            </div>

            {/* Mobile text overlay - Instructions */}
            <div 
              className="absolute left-6"
              style={{
                top: '110px',
                zIndex: 20, // Higher z-index to ensure it shows above everything
                color: '#000000',
                fontSize: '16px',
                fontWeight: '500',
                fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
                pointerEvents: 'none',
                maxWidth: 'calc(100vw - 48px)', // Account for full viewport width
                padding: '8px 12px',
                borderRadius: '8px', 
                marginLeft: '12px',
                marginRight: '55px',
                lineHeight: '1.3'
              }}
            >
              Compare strawberry varieties and performance data to find your ideal cultivar. Tap any variety below to explore.
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
    
    // Desktop Layout for Debug
    return (
      <div className="h-full w-full flex items-center justify-center">
        {/* Intro Page Container - FIXED: Removed debug styling */}
        <div 
          className="w-full h-full overflow-hidden"
          style={{
            background: 'transparent', // FIXED: Removed debug background
            borderRadius: '20px',
            position: 'relative',
            // FIXED: Removed debug border
            height: '100%', // FIXED: Explicit height instead of min-height
            width: '100%' // FIXED: Explicit width instead of min-width
          }}
        >
          {/* Background Image - Full Container */}
          <div 
            className="absolute inset-0"
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              zIndex: 1,
              height: '100%', // FIXED: Ensure explicit height
              width: '100%' // FIXED: Ensure explicit width
            }}
          >
            <Image 
              src="/images/backgrounds/open_page_bg.jpg"
              alt="CBC Cultivar Explorer Welcome"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw" // FIXED: More specific sizes
              className="object-cover"
              style={{ 
                borderRadius: '20px'
              }}
              priority
              onError={() => console.log('DEBUG: Image failed to load')}
              onLoad={() => console.log('DEBUG: Image loaded successfully')}
            />
          </div>
          
          {/* DESKTOP: Welcome and instructions */}
          <div 
            className="absolute top-8 left-20"
            style={{
              zIndex: 10,
              color: '#000000',
              fontSize: '42px',
              fontWeight: 'bold',
              fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
              pointerEvents: 'none',
              whiteSpace: 'nowrap', 
              marginLeft: '16px', 
              marginTop: '8px',
            }}
          >
            CBC Cultivar Explorer
          </div>
          
          {/* DESKTOP: Instructions */}
          <div 
            className="absolute left-20"
            style={{
              top: '120px',
              zIndex: 10,
              color: '#000000',
              fontSize: '20px',
              fontWeight: '500',
              fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
              pointerEvents: 'none',
              maxWidth: '600px',
              lineHeight: '1.4',
              marginLeft: '16px',
            }}
          >
            Compare strawberry varieties, analyze performance data, and find the perfect cultivar for your operation. Click any variety below to explore detailed insights.
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
              <h2 className="text-lg font-semibold text-green-400" style={{ fontFamily: 'var(--font-body)' }}>PERFORMANCE METRICS</h2>
            </div>

            {/* Stats Grid - 2x2 Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Yield */}
              <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Yield</div>
                <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)' }}>45.0t/ha</div>
              </div>

              {/* Size */}
              <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Size</div>
                <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)' }}>Large</div>
              </div>

              {/* Appearance */}
              <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Appearance</div>
                <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)' }}>Excellent</div>
              </div>

              {/* Firmness */}
              <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Firmness</div>
                <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)' }}>High</div>
              </div>
            </div>

            {/* Key Attributes Header */}
            <div className="flex items-center gap-2">
              <span className="text-xl">🧬</span>
              <h2 className="text-lg font-semibold text-green-400">KEY ATTRIBUTES</h2>
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
      <div className="h-full w-full flex items-center justify-center p-4">
        {/* Main Card Container - Mobile Portrait */}
        <div 
          className="w-full h-full overflow-y-auto scrollbar-hidden"
          style={{
            maxWidth: 'calc(100vw - 16px)',
            background: 'transparent',
            backdropFilter: 'blur(2px) saturate(180%)',
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
            {/* Vertical Stack Layout for Mobile Portrait */}
            <div className="p-4">
              
              {/* Premium Filter-style Buttons - Desktop */}
              <div 
                className="mb-6 overflow-x-auto scrollbar-hidden"
                style={{
                  width: '100%',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  position: 'relative',
                  zIndex: 300,
                  minWidth: '0', // allow flex children to shrink
                }}
              >
                <div className="flex flex-nowrap gap-3 min-w-max px-1">
                  {buttonConfigs.map((button) => (
                    <span 
                      key={button.id}
                      className={`${button.className} cultivar-tag whitespace-nowrap`}
                      onClick={() => handleInfoClick(button.id)}
                    >
                      {button.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Photo carousel */}
              <div 
                className="relative mb-6"
                style={{
                  aspectRatio: '16/9',
                  background: 'transparent',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 255, 136, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  marginTop: '12px',
                  marginBottom: '12px' // Added extra 10px space below carousel
                }}
              >
                <Image 
                  src={cultivarContent.images.carousel[currentImageIndex]}
                  alt={`${cultivarContent.displayName} ${currentImageIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover transition-opacity duration-700"
                  style={{ 
                    borderRadius: '20px',
                    opacity: imageOpacity,
                    transition: 'opacity 0.8s ease-in-out' // Smoother, longer transition
                  }}
                />
              </div>

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
                    color: '#00ff88',
                    textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
                  }}
                >
                  PERFORMANCE METRICS
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Yield */}
                  <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                    <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '8px' }}>Yield</div>
                    <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '8px' }}>{cultivarContent?.performanceMetrics?.yield || '45.0t/ha'}</div>
                  </div>
                  {/* Size */}
                  <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                    <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '8px' }}>Size</div>
                    <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '8px' }}>{cultivarContent?.performanceMetrics?.size || 'Large'}</div>
                  </div>
                  {/* Appearance */}
                  <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                    <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '8px' }}>Appearance</div>
                    <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '8px' }}>{cultivarContent?.performanceMetrics?.appearance || 'Excellent'}</div>
                  </div>
                  {/* Firmness */}
                  <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer">
                    <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '8px' }}>Firmness</div>
                    <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '8px' }}>{cultivarContent?.performanceMetrics?.firmness || 'High'}</div>
                  </div>
                </div>
              </div>

              {/* Recommendations Section - Mobile */}
              <div className="mb-6">
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{
                    color: '#00ff88',
                    textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
                  }}
                >
                  RECOMMENDATIONS
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
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>Planting Date</div>
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
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>Chill Recommendation</div>
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
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>Fertility Recommendation</div>
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
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>Other Recommendations</div>
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

              {/* Chart Section - Hide for Sweet Carolina */}
              {!isSweetCarolinaPage && (
                <div className="mb-6">
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{
                      color: '#00ff88',
                      textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
                    }}
                  >
                    Performance Data
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
              )}

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
                  marginBottom: '50px', // ADDED: Extra scroll space at bottom for mobile users, REMOVE IF ADDING MORE BELOW BANNER!!!!!
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
                  
                  {/* Horizontal Data Streams */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '25%',
                      left: 0,
                      width: '100%',
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
                      animation: 'horizontal-stream 3s linear infinite',
                      zIndex: 205
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
                      animation: 'edge-pulse 3s ease-in-out infinite',
                      zIndex: 225
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
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
          background: 'transparent',
          backdropFilter: 'blur(2px) saturate(180%)',
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
                    backdropFilter: 'blur(10px) saturate(180%)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 255, 136, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
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
                    
                    {/* Horizontal Data Streams */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '25%',
                        left: 0,
                        width: '100%',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
                        animation: 'horizontal-stream 3s linear infinite',
                        zIndex: 205
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
                        animation: 'edge-pulse 3s ease-in-out infinite',
                        zIndex: 225
                      }}
                    />
                  </div>
                </div>

                {/* Premium Filter-style Buttons - Desktop */}
                <div 
                  className="mb-6 overflow-x-auto scrollbar-hidden"
                  style={{
                    width: '100%',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    position: 'relative',
                    zIndex: 300,
                    minWidth: '0', // allow flex children to shrink
                  }}
                >
                  <div className="flex flex-nowrap gap-3 min-w-max px-1">
                    {buttonConfigs.map((button) => (
                      <span 
                        key={button.id}
                        className={`${button.className} cultivar-tag whitespace-nowrap`}
                        onClick={() => handleInfoClick(button.id)}
                      >
                        {button.label}
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
                      <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '16px' }}>Yield</div>
                      <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '16px' }}>{cultivarContent?.performanceMetrics?.yield || '45.0t/ha'}</div>
                    </div>
                    <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer" style={{ marginLeft: '32px', marginBottom: '16px' }}>
                      <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '16px' }}>Size</div>
                      <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '16px' }}>{cultivarContent?.performanceMetrics?.size || 'Large'}</div>
                    </div>
                    
                    {/* Row 2 */}
                    <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer" style={{ marginRight: '32px', marginTop: '16px' }}>
                      <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '16px' }}>Appearance</div>
                      <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '16px' }}>{cultivarContent?.performanceMetrics?.appearance || 'Excellent'}</div>
                    </div>
                    <div className="modern-card p-4 text-center hover:scale-105 transition-all duration-300 group cursor-pointer" style={{ marginLeft: '32px', marginTop: '16px' }}>
                      <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-body)', paddingTop: '16px' }}>Firmness</div>
                      <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-body)', paddingBottom: '16px' }}>{cultivarContent?.performanceMetrics?.firmness || 'High'}</div>
                    </div>
                  </div>
                </div>

                {/* Recommendations Section - Desktop */}
                <div style={{ marginTop: '24px', marginLeft: '30px', marginRight: '30px' }}>
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{
                      color: '#00ff88',
                      textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
                    }}
                  >
                    RECOMMENDATIONS
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
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>Planting Date</div>
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
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>Chill Recommendation</div>
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
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>Fertility Recommendation</div>
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
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#d1d5db', marginBottom: '16px', fontWeight: 'bold' }}>Other Recommendations</div>
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
                <div 
                  className="relative overflow-hidden rounded-xl"
                  style={{
                    background: 'transparent',
                    aspectRatio: '1/1', // Height equals width dynamically
                    borderRadius: '20px',
                  }}
                >
                  {/* Image container */}
                  <div 
                    className="absolute inset-0 z-10 rounded-xl overflow-hidden"
                    style={{ height: '100%', width: '100%' }}
                  >
                    <Image 
                      src={cultivarContent.images.carousel[currentImageIndex]}
                      alt={`${cultivarContent.displayName} ${currentImageIndex + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="transition-opacity duration-700"
                      style={{ 
                        opacity: imageOpacity,
                        objectFit: 'cover',
                        objectPosition: 'center',
                        transition: 'opacity 0.8s ease-in-out' // Smoother, longer transition
                      }}
                    />
                  </div>
                  
                  {/* Carousel indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                    {cultivarContent.images.carousel.map((_: string, index: number) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white shadow-lg' 
                            : 'bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Performance Chart */}
                <div style={{ marginTop: '24px' }}>
                  {/* Cultivar Selector - Hide for Sweet Carolina */}
                  {!isSweetCarolinaPage && (
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
                            Compare Alturas
                          </h3>
                        </div>
                        
                        {/* Fixed Alturas + Comparison Selection */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Primary Cultivar (Fixed)
                          </div>
                          <button
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              borderRadius: '8px',
                              border: '1px solid rgba(34, 197, 94, 0.5)',
                              cursor: 'default',
                              fontFamily: 'var(--font-body, system-ui)',
                              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                              color: '#ffffff',
                              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                              opacity: '0.8'
                            }}
                          >
                            Alturas (Locked)
                          </button>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Compare with:
                          </div>
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
                            {alturasComparisonOptions.map((cultivarId) => (
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
                            Compare Adelanto
                          </h3>
                        </div>
                        
                        {/* Fixed Adelanto + Comparison Selection */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Primary Cultivar (Fixed)
                          </div>
                          <button
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              borderRadius: '8px',
                              border: '1px solid rgba(227, 119, 23, 0.5)',
                              cursor: 'default',
                              fontFamily: 'var(--font-body, system-ui)',
                              background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
                              color: '#ffffff',
                              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)',
                              opacity: '0.8'
                            }}
                          >
                            Adelanto (Locked)
                          </button>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Compare with:
                          </div>
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
                            {adelantoComparisonOptions.map((cultivarId) => (
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
                            Compare Alhambra
                          </h3>
                        </div>
                        
                        {/* Fixed Alhambra + Comparison Selection */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Primary Cultivar (Fixed)
                          </div>
                          <button
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              borderRadius: '8px',
                              border: '1px solid rgba(168, 85, 247, 0.5)',
                              cursor: 'default',
                              fontFamily: 'var(--font-body, system-ui)',
                              background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                              color: '#ffffff',
                              boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)',
                              opacity: '0.8'
                            }}
                          >
                            Alhambra (Locked)
                          </button>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Compare with:
                          </div>
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
                            {alhambraComparisonOptions.map((cultivarId) => (
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
                            Compare Artesia
                          </h3>
                        </div>
                        
                        {/* Fixed Artesia + Comparison Selection */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Primary Cultivar (Fixed)
                          </div>
                          <button
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              borderRadius: '8px',
                              border: '1px solid rgba(34, 197, 94, 0.5)',
                              cursor: 'default',
                              fontFamily: 'var(--font-body, system-ui)',
                              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                              color: '#ffffff',
                              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                              opacity: '0.8'
                            }}
                          >
                            Artesia (Locked)
                          </button>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Compare with:
                          </div>
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
                            {artesiaComparisonOptions.map((cultivarId) => (
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
                            Compare Belvedere
                          </h3>
                        </div>
                        
                        {/* Fixed Belvedere + Comparison Selection */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Primary Cultivar (Fixed)
                          </div>
                          <button
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              borderRadius: '8px',
                              border: '1px solid rgba(168, 85, 247, 0.5)',
                              cursor: 'default',
                              fontFamily: 'var(--font-body, system-ui)',
                              background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                              color: '#ffffff',
                              boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)',
                              opacity: '0.8'
                            }}
                          >
                            Belvedere (Locked)
                          </button>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Compare with:
                          </div>
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
                            {belvedereComparisonOptions.map((cultivarId) => (
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
                            Compare Castaic
                          </h3>
                        </div>
                        
                        {/* Fixed Castaic + Comparison Selection */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Primary Cultivar (Fixed)
                          </div>
                          <button
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              borderRadius: '8px',
                              border: '1px solid rgba(168, 85, 247, 0.5)',
                              cursor: 'default',
                              fontFamily: 'var(--font-body, system-ui)',
                              background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                              color: '#ffffff',
                              boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)',
                              opacity: '0.8'
                            }}
                          >
                            Castaic (Locked)
                          </button>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Compare with:
                          </div>
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
                            {castaicComparisonOptions.map((cultivarId) => (
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
                            Compare Carpinteria
                          </h3>
                        </div>
                        
                        {/* Fixed Carpinteria + Comparison Selection */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Primary Cultivar (Fixed)
                          </div>
                          <button
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              borderRadius: '8px',
                              border: '1px solid rgba(168, 85, 247, 0.5)',
                              cursor: 'default',
                              fontFamily: 'var(--font-body, system-ui)',
                              background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                              color: '#ffffff',
                              boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)',
                              opacity: '0.8'
                            }}
                          >
                            Carpinteria (Locked)
                          </button>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Compare with:
                          </div>
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
                            {carpinteriaComparisonOptions.map((cultivarId) => (
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
                            Compare Brisbane
                          </h3>
                        </div>
                        
                        {/* Fixed Brisbane + Comparison Selection */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Primary Cultivar (Fixed)
                          </div>
                          <button
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              borderRadius: '8px',
                              border: '1px solid rgba(168, 85, 247, 0.5)',
                              cursor: 'default',
                              fontFamily: 'var(--font-body, system-ui)',
                              background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                              color: '#ffffff',
                              boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)',
                              opacity: '0.8'
                            }}
                          >
                            Brisbane (Locked)
                          </button>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Compare with:
                          </div>
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
                            {brisbaneComparisonOptions.map((cultivarId) => (
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
                            Compare Sweet Carolina
                          </h3>
                        </div>
                        
                        {/* Fixed Sweet Carolina + Comparison Selection */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Primary Cultivar (Fixed)
                          </div>
                          <button
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              borderRadius: '8px',
                              border: '1px solid rgba(34, 197, 94, 0.5)',
                              cursor: 'default',
                              fontFamily: 'var(--font-body, system-ui)',
                              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                              color: '#ffffff',
                              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                              opacity: '0.8'
                            }}
                          >
                            Sweet Carolina (Locked)
                          </button>
                        </div>
                        
                        {/* Comparison Selection */}
                        <div>
                          <div style={{ 
                            color: '#9CA3AF', 
                            fontSize: '14px', 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-body, system-ui)'
                          }}>
                            Compare with:
                          </div>
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
                            {sweetCarolinaComparisonOptions.map((cultivarId) => (
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
                  {!isSweetCarolinaPage && (
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

      {/* Info Overlay - Desktop Only */}
      {!isMobile && showInfoOverlay && infoContent && (
        <div className={`info-overlay ${showInfoOverlay ? 'show' : ''}`} onClick={closeInfoOverlay}>
          <div className="info-card" onClick={(e) => e.stopPropagation()}>
            <div className="info-card-close" onClick={closeInfoOverlay}>
              ×
            </div>
            <div className="info-card-header">
              <div className="info-card-icon">{infoContent.icon}</div>
              <div className="info-card-title">{infoContent.title}</div>
            </div>
            <div 
              className="info-card-content" 
              dangerouslySetInnerHTML={{ __html: infoContent.content }}
            />
          </div>
        </div>
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