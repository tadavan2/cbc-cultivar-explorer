interface TopNavProps {
  isMobile?: boolean;
  isLandscape?: boolean;
}

export default function TopNav({ isMobile = false, isLandscape = false }: TopNavProps) {
  return (
    <nav className={`sticky top-0 z-50 ${isMobile ? (isLandscape ? 'h-12' : 'h-16') : 'h-16'}`} style={{ 
      background: 'rgba(17, 24, 39, 0.3)', 
      backdropFilter: 'blur(20px) saturate(190%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
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
              stroke="rgba(255, 255, 255, 0.9)" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </a>
          
          <div>
            <h1 className={`font-bold premium-heading ${isMobile ? (isLandscape ? 'text-xs' : 'text-xs') : 'text-5xl'}`} style={{ 
              lineHeight: '0.9', 
              fontSize: isMobile ? '22px' : '3.5rem',
              letterSpacing: '-0.02em',
              margin: 0,
              padding: '8px 0'
            }}>
              {isMobile ? (
                'CALIFORNIA BERRY CULTIVARS'
              ) : (
                <>
                  <span style={{ fontWeight: 500 }}>CALIFORNIA </span>
                  <span style={{ fontWeight: 800 }}>BERRY </span>
                  <span style={{ fontWeight: 500 }}>CULTIVARS</span>
                </>
              )}
            </h1>
          </div>
        </div>
        
        {!isMobile && (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-secondary">
              <span className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></span>
              <span>Live Data</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 