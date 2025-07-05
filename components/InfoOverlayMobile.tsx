import React from 'react';
import { InfoOverlayContent } from '../data/infoOverlayContent';
import { useLanguage, useTranslation } from './LanguageContext';

interface InfoOverlayMobileProps {
  isVisible: boolean;
  content: { key: string, content: InfoOverlayContent, cultivarId?: string, isCultivarSpecific?: boolean } | null;
  onClose: () => void;
}

export default function InfoOverlayMobile({ isVisible, content, onClose }: InfoOverlayMobileProps) {
  const { language } = useLanguage();
  const { getInfoOverlay } = useTranslation();
  
  console.log('DEBUG: InfoOverlayMobile render - isVisible:', isVisible, 'content:', !!content);
  
  if (!isVisible || !content) {
    console.log('DEBUG: InfoOverlayMobile early return - isVisible:', isVisible, 'content:', !!content);
    return null;
  }
  
  console.log('DEBUG: InfoOverlayMobile rendering overlay with key:', content.key, 'title:', content.content.title);

  // Use the correct translation key for cultivar-specific overlays
  let translationKey = content.key;
  if (content.isCultivarSpecific && content.cultivarId) {
    translationKey = `${content.cultivarId}-${content.key}`;
  }
  const overlayObj = getInfoOverlay(translationKey) || getInfoOverlay(content.key);
  const finalTitle = overlayObj && overlayObj.title ? overlayObj.title : content.content.title;
  const finalContent = overlayObj && overlayObj.content ? overlayObj.content : content.content.content;

  // Debug logging
  console.log('[InfoOverlayMobile DEBUG]', {
    language,
    content,
    translationKey,
    overlayObj,
    finalTitle,
    finalContent
  });

  return (
    <div 
      className={`fixed left-0 right-0 z-[10000] transition-all duration-1300 ease-in-out ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        top: '48px', // Match mobile landscape header height
        height: 'calc(100vh - 48px)', // Subtract header height
        width: 'calc(100vw - 32px)',
        borderRadius: '16px'
      }}
    >
      {/* Full Screen Content Container */}
      <div 
        className={`w-full h-full flex flex-col transition-transform duration-1300 ease-out ${
          isVisible ? 'translate-y-10' : 'translate-y-full'
        }`}
        style={{
          background: 'linear-gradient(145deg, rgba(180, 0, 0, 0.95) 0%, rgba(200, 30, 30, 0.95) 30%, rgba(130, 20, 20, 0.95) 60%, rgba(100, 15, 15, 0.98) 100%)',
          backdropFilter: 'blur(10px) saturate(200%)',
          borderRadius: '16px'
        }}
      >
        {/* Fixed Header Bar */}
        <div 
          className="flex-shrink-0 flex items-center justify-between p-4 border-b"
          style={{
            borderBottomColor: 'rgba(255, 255, 255, 0.2)',
            background: 'rgba(0, 0, 0, 0.1)',
            marginLeft: '16px',
          }}
        >
          {/* Header Content */}
          <div className="flex items-center gap-3 flex-1">
            <div 
              className="text-2xl"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))',
              }}
            >
              {content.content.icon}
            </div>
            <h2 
              className="text-lg font-bold text-white truncate"
              style={{
                fontFamily: 'var(--font-body)',
              }}
            >
              {finalTitle}
            </h2>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'rgba(255, 255, 255, 0.9)',
              marginRight: '16px'
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span className="text-xl font-bold">×</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div 
          className="flex-1 overflow-y-auto p-6"
          style={{
            // Hide scrollbars but keep functionality
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            marginLeft: '16px',
            marginRight: '16px',
            paddingBottom: '32px'
          }}
        >
          <div 
            className="text-white leading-relaxed"
            style={{
              fontFamily: 'var(--font-body)',
              lineHeight: '1.6',
            }}
            dangerouslySetInnerHTML={{ __html: finalContent }}
          />
          
          {/* Bottom padding for safe scrolling */}
          <div className="h-8" />
        </div>
      </div>

      {/* Custom styles for content */}
      <style jsx>{`
        /* Hide webkit scrollbars */
        div::-webkit-scrollbar {
          display: none;
        }
        
        /* Style the HTML content */
        :global(.text-white h3) {
          color: #ffffff !important;
          font-weight: 700 !important;
          margin: 20px 0 12px 0 !important;
          font-size: 1.1rem !important;
        }
        
        :global(.text-white h3::after) {
          content: '' !important;
          display: block !important;
          margin-top: 8px !important;
          height: 1px !important;
          background: rgba(255, 255, 255, 0.2) !important;
        }
        
        :global(.text-white p) {
          margin-bottom: 16px !important;
          color: rgba(255, 255, 255, 0.95) !important;
        }
        
        :global(.text-white ul) {
          margin: 16px 0 !important;
          padding-left: 20px !important;
        }
        
        :global(.text-white li) {
          margin-bottom: 8px !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        :global(.text-white strong) {
          color: rgba(255, 255, 255, 1) !important;
          font-weight: 600 !important;
        }
      `}</style>
    </div>
  );
} 