/**
 * ImageCarousel Component
 * 
 * A reusable image carousel component with auto-rotation and fade transitions.
 * Extracted from CultivarDetailCardV2.tsx to improve maintainability and reusability.
 * 
 * Features:
 * - Auto-rotation with configurable interval
 * - Smooth fade transitions between images
 * - Indicator dots showing current position
 * - Responsive design for mobile and desktop
 * - Configurable aspect ratio
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  autoRotateInterval?: number; // milliseconds, default 6000
  aspectRatio?: string; // CSS aspect ratio, default '1/1'
  showIndicators?: boolean; // show indicator dots, default true
  isMobile?: boolean; // mobile vs desktop styling
  containerClassName?: string; // additional container classes
  imageClassName?: string; // additional image classes
  cultivarName?: string; // optional cultivar name to show during transition
}

export default function ImageCarousel({
  images,
  alt,
  autoRotateInterval = 6000,
  aspectRatio = '1/1',
  showIndicators = true,
  isMobile = false,
  containerClassName = '',
  imageClassName = '',
  cultivarName
}: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);

  // Auto-rotate images every interval with fade transition
  useEffect(() => {
    if (images && images.length > 1) {
      const interval = setInterval(() => {
        // Start fade out with dark overlay AND start text fade in
        setImageOpacity(0);
        setOverlayOpacity(0.6); // Semi-transparent black overlay
        setTextOpacity(1); // Start text fade in immediately with image fade out
        
        setTimeout(() => {
          // Change image after fade out completes AND start text fade out
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
          // Start fade in and remove overlay AND fade out text
          setImageOpacity(1);
          setOverlayOpacity(0);
          setTextOpacity(0); // Start text fade out as new image fades in
        }, 1600); // Doubled transition time for longer, smoother wave
        
      }, autoRotateInterval);

      return () => clearInterval(interval);
    }
  }, [images, autoRotateInterval]);

  if (!images || images.length === 0) {
    return null;
  }

  if (isMobile) {
    // Mobile carousel layout
    return (
      <div 
        className={`relative mb-6 ${containerClassName}`}
        style={{
          aspectRatio: aspectRatio,
          background: 'transparent',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 255, 136, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '12px',
          marginBottom: '12px'
        }}
      >
        <Image 
          src={images[currentImageIndex]}
          alt={`${alt} ${currentImageIndex + 1}`}
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${imageClassName}`}
          style={{ 
            borderRadius: '20px',
            opacity: imageOpacity,
            transition: 'opacity 1.6s ease-in-out'
          }}
        />
        
        {/* Dark overlay during transitions */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgb(0, 0, 0)',
            opacity: overlayOpacity,
            transition: 'opacity 1.6s ease-in-out',
            borderRadius: '20px',
            pointerEvents: 'none',
            zIndex: 5
          }}
        />
        
        {/* Cultivar name text during transitions */}
        {cultivarName && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 'bold',
              fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
              textAlign: 'center',
              opacity: textOpacity,
              transition: 'opacity 0.3s ease-in-out',
              pointerEvents: 'none',
              zIndex: 6,
              letterSpacing: '3px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
            }}
          >
            {cultivarName.toUpperCase()}
          </div>
        )}
      </div>
    );
  }

  // Desktop carousel layout
  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${containerClassName}`}
      style={{
        background: 'transparent',
        aspectRatio: aspectRatio,
        borderRadius: '20px',
      }}
    >
      {/* Image container */}
      <div 
        className="absolute inset-0 z-10 rounded-xl overflow-hidden"
        style={{ height: '100%', width: '100%' }}
      >
        <Image 
          src={images[currentImageIndex]}
          alt={`${alt} ${currentImageIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`transition-opacity duration-700 ${imageClassName}`}
          style={{ 
            opacity: imageOpacity,
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'opacity 1.6s ease-in-out'
          }}
        />
        
        {/* Dark overlay during transitions */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 1)',
            opacity: overlayOpacity,
            transition: 'opacity 1.6s ease-in-out',
            borderRadius: '20px',
            pointerEvents: 'none',
            zIndex: 15
          }}
        />
        
        {/* Cultivar name text during transitions */}
        {cultivarName && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: isMobile ? '28px' : '36px',
              fontWeight: 'bold',
              fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, sans-serif',
              textAlign: 'center',
              opacity: textOpacity,
              transition: 'opacity 0.3s ease-in-out',
              pointerEvents: 'none',
              zIndex: 16,
              letterSpacing: '4px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
            }}
          >
            {cultivarName.toUpperCase()}
          </div>
        )}
      </div>
      
      {/* Carousel indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {images.map((_: string, index: number) => (
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
      )}
    </div>
  );
} 