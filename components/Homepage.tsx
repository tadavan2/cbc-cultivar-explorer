/*
 * Homepage.tsx - CBC Cultivar Explorer Welcome Page
 * 
 * This component renders the welcome/intro page for the CBC Cultivar Explorer application.
 * It displays different layouts based on device type (mobile portrait, mobile landscape, desktop).
 * 
 * Key Features:
 * - Responsive design with device-specific layouts
 * - Background images optimized for each viewport
 * - Welcome messaging and instructions
 * - Glass morphism styling consistent with app theme
 * 
 * Dependencies:
 * - Next.js Image component for optimized image loading
 * - CSS classes from globals.css and cultivar-themes.css
 * - Background images from /public/images/backgrounds/
 * 
 * Props:
 * - isMobile: boolean - determines if device is mobile
 * - isLandscape: boolean - determines if device is in landscape orientation
 */

import React from 'react';
import Image from 'next/image';

interface HomepageProps {
  isMobile: boolean;
  isLandscape: boolean;
}

export default function Homepage({ isMobile, isLandscape }: HomepageProps) {
  console.log('DEBUG: Homepage render - isMobile:', isMobile, 'isLandscape:', isLandscape);
  
  // Mobile Portrait Layout
  if (isMobile && !isLandscape) {
    console.log('DEBUG: Rendering mobile portrait homepage layout');
    return (
      <div className="h-full w-full relative" style={{ margin: '0px' }}>
        <div 
          className="w-full h-full overflow-hidden"
          style={{
            background: 'transparent',
            borderRadius: '20px',
            position: 'relative',
            height: '100vh',
            width: 'calc(100vw - 16px)',
            margin: '8px'
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
              width={2140}
              height={1402}
              className="object-cover"
              style={{ 
                borderRadius: '20px',
                objectPosition: '75% center',
                maxWidth: '100%',
                maxHeight: 'calc(100vh - 80px)',
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
              zIndex: 20,
              color: '#000000',
              fontSize: '30px',
              fontWeight: 'bold',
              fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
              pointerEvents: 'none',
              maxWidth: 'calc(100vw - 48px)',
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
              zIndex: 20,
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: '500',
              fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
              pointerEvents: 'none',
              maxWidth: 'calc(100vw - 48px)',
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
              zIndex: 2
            }}
          />
        </div>
      </div>
    );
  }
  
  // Mobile Landscape Layout
  if (isMobile && isLandscape) {
    console.log('DEBUG: Rendering mobile landscape homepage layout');
    return (
      <div className="h-full w-full relative" style={{ margin: 'px' }}>
        <div 
          className="w-full h-full overflow-hidden"
          style={{
            background: 'transparent',
            borderRadius: '20px',
            position: 'relative',
            height: 'calc(100vh - 48px)',
            width: 'calc(100vw - 32px)',
            margin: '16px'
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
              onError={() => console.log('DEBUG: Mobile landscape image failed to load')}
              onLoad={() => console.log('DEBUG: Mobile landscape image loaded successfully')}
            />
          </div>
          
          {/* Mobile Landscape text overlay - Match mobile portrait style */}
          <div 
            className="absolute top-8 left-6"
            style={{
              zIndex: 20,
              color: '#000000',
              fontSize: '24px',
              fontWeight: 'bold',
              fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
              pointerEvents: 'none',
              maxWidth: 'calc(100vw - 48px)',
              padding: '6px 10px',
              borderRadius: '8px', 
              marginLeft: '12px',
              marginRight: '8px', 
              marginTop: '8px',
              marginBottom: '8px',
              backgroundColor: 'rgba(241, 0, 0, 0.5)',
            }}
          >
            CULTIVAR EXPLORER
          </div>

          {/* Mobile Landscape instructions */}
          <div 
            className="absolute left-6"
            style={{
              top: '60px',
              zIndex: 20,
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
              pointerEvents: 'none',
              maxWidth: 'calc(100vw - 48px)',
              padding: '6px 10px',
              borderRadius: '8px', 
              marginLeft: '12px',
              marginRight: '8px', 
              lineHeight: '1.3',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            Tap any variety below to explore.
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
  
  // Desktop Layout
  console.log('DEBUG: Rendering desktop homepage layout');
  return (
    <div className="h-full w-full flex items-center justify-center">
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
            onError={() => console.log('DEBUG: Desktop image failed to load')}
            onLoad={() => console.log('DEBUG: Desktop image loaded successfully')}
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
            top: '75px',
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
          Welcome to California Berry Cultivars.
        </div>

        <div 
          className="absolute left-20"
          style={{
            top: '140px',
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
          Click any variety below to explore detailed insights. Trait filters are available on the right.
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