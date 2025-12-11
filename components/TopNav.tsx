import { useLanguage } from './LanguageContext';
import React, { useRef, useEffect } from 'react';

interface TopNavProps {
  isMobile?: boolean;
  isLandscape?: boolean;
  onHeightChange?: (height: number) => void;
}

export default function TopNav({ isMobile = false, isLandscape = false, onHeightChange }: TopNavProps) {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const navRef = useRef<HTMLElement>(null);

  // Measure and report height changes
  useEffect(() => {
    const updateHeight = () => {
      if (navRef.current && onHeightChange) {
        const height = navRef.current.offsetHeight;
        onHeightChange(height);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    // Use ResizeObserver for more accurate height tracking
    const resizeObserver = new ResizeObserver(updateHeight);
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateHeight);
      resizeObserver.disconnect();
    };
  }, [onHeightChange]);

  // Language Switcher UI
  const LanguageSwitcher = () => {
    return (
      <div style={{ marginRight: 8 }}>
        <select
          aria-label="Select language"
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="theme-base-premium-button premium-button-glass"
          style={{
            padding: isMobile ? '4px 10px' : '6px 16px',
            fontSize: isMobile ? '13px' : '15px',
            fontWeight: 700,
            borderRadius: '12px',
            minWidth: isMobile ? 90 : 120,
            border: '2px solid #22c55e',
            outline: 'none',
            boxShadow: '0 4px 16px rgba(34,197,94,0.13), 0 1.5px 6px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: '#fff',
            backdropFilter: 'blur(10px) saturate(180%)',
            cursor: 'pointer',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
            marginRight: 0,
          }}
          onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 3px #22c55e55, 0 4px 16px rgba(34,197,94,0.13)'}
          onBlur={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(34,197,94,0.13), 0 1.5px 6px rgba(0,0,0,0.08)'}
        >
          {supportedLanguages.map(lang => (
            <option key={lang.code} value={lang.code} style={{ color: '#222', background: '#fff' }}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <nav 
      ref={navRef}
      className={`sticky top-0 z-50 ${isMobile ? (isLandscape ? 'min-h-12' : 'min-h-16') : 'min-h-16'}`} 
      style={{ 
      background: 'rgba(251, 239, 239)', 
      borderBottom: '4px solid rgba(192, 21, 21, 0.6)'
      }}
    >
      <div className={`flex items-center justify-between h-full ${isMobile ? 'px-4' : 'px-12'}`}>
        <div className="flex items-center space-x-4">
          {/* Back Arrow to CBC Homepage */}
          <a 
            href="https://cbcberry.com"
            className="flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              width: isMobile ? '32px' : '40px',
              height: isMobile ? '24px' : '40px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              marginRight: '8px',
              marginLeft: '8px'
            }}
          >
            <svg 
              width={isMobile ? "16" : "20"} 
              height={isMobile ? "16" : "20"} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="rgba(0, 0, 0, 0.9)" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </a>
          
          <div>
            <h1 
              className={`font-bold premium-heading ${isMobile ? (isLandscape ? 'text-xs' : 'text-xs') : 'topnav-title-responsive'}`} 
              style={{ 
              lineHeight: '0.9', 
                fontSize: isMobile 
                  ? (isLandscape ? '22px' : '14px') 
                  : 'clamp(1.5rem, 4.5vw, 3.5rem)', // Responsive: min 1.5rem, preferred 4.5vw, max 3.5rem
              letterSpacing: '-0.02em',
              margin: 0,
                padding: '8px 0',
                whiteSpace: 'nowrap' // Prevent wrapping
              }}
            >
              {isMobile ? (isLandscape ? 'CALIFORNIA BERRY CULTIVARS' : 'CALIFORNIA BERRY CULTIVARS') : (
                <>
                  <span style={{ fontWeight: 500 }}>CALIFORNIA </span>
                  <span style={{ fontWeight: 800 }}>BERRY </span>
                  <span style={{ fontWeight: 500 }}>CULTIVARS</span>
                </>
              )}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <LanguageSwitcher />
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-2 text-sm text-secondary">
              <span className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></span>
              <span>Live Data</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 