/**
 * CultivarIcon - Reusable Icon Rendering Component
 * 
 * PURPOSE:
 * Centralizes the logic for rendering cultivar icons based on cultivar ID and language.
 * Eliminates code duplication by providing a single component for icon display.
 * 
 * FUNCTIONALITY:
 * - Renders custom PNG icons for cultivars that have them (10 cultivars)
 * - Falls back to emoji + name display for cultivars without custom icons
 * - Supports multi-language icon variants (English, Spanish, Portuguese)
 * - Handles responsive sizing (mobile vs desktop)
 * 
 * ICON MAPPING:
 * Custom icons exist for: adelanto, debug, alhambra, alturas, artesia, belvedere,
 * brisbane, castaic, carpinteria, sweet-carolina
 * 
 * FILE LOCATIONS:
 * Icons are stored in: public/images/icons/
 * Format: {cultivar-id}_card_icon.png (English)
 *         {cultivar-id}_{lang}_card_icon.png (Spanish/Portuguese)
 * 
 * USAGE:
 * Used in app/page.tsx for both mobile and desktop cultivar card displays.
 * Replaces 256+ lines of duplicated conditional rendering logic.
 * 
 * RELATED FILES:
 * - app/page.tsx: Main usage location
 * - public/images/icons/: Icon file storage
 */

import { Cultivar } from '../types/cultivar';

interface CultivarIconProps {
  cultivar: Cultivar;
  language: string;
  isMobile?: boolean;
}

export default function CultivarIcon({ cultivar, language, isMobile = false }: CultivarIconProps) {
  // Helper function to get icon path based on cultivar ID and language
  const getIconPath = (cultivarId: string, lang: string): string => {
    const iconMap: { [key: string]: { [key: string]: string } } = {
      'adelanto': {
        'en': '/images/icons/adelanto_card_icon.png',
        'es': '/images/icons/adelanto_es_card_icon.png',
        'pt': '/images/icons/adelanto_pt_card_icon.png'
      },
      'debug': {
        'en': '/images/icons/open_card_icon.png',
        'es': '/images/icons/open_es_card_icon.png',
        'pt': '/images/icons/open_pt_card_icon.png'
      },
      'alhambra': {
        'en': '/images/icons/alhambra_card_icon.png',
        'es': '/images/icons/alhambra_es_card_icon.png',
        'pt': '/images/icons/alhambra_pt_card_icon.png'
      },
      'alturas': {
        'en': '/images/icons/alturas_card_icon.png',
        'es': '/images/icons/alturas_es_card_icon.png',
        'pt': '/images/icons/alturas_pt_card_icon.png'
      },
      'artesia': {
        'en': '/images/icons/artesia_card_icon.png',
        'es': '/images/icons/artesia_es_card_icon.png',
        'pt': '/images/icons/artesia_pt_card_icon.png'
      },
      'belvedere': {
        'en': '/images/icons/belvedere_card_icon.png',
        'es': '/images/icons/belvedere_es_card_icon.png',
        'pt': '/images/icons/belvedere_pt_card_icon.png'
      },
      'brisbane': {
        'en': '/images/icons/brisbane_card_icon.png',
        'es': '/images/icons/brisbane_es_card_icon.png',
        'pt': '/images/icons/brisbane_pt_card_icon.png'
      },
      'castaic': {
        'en': '/images/icons/castaic_card_icon.png',
        'es': '/images/icons/castaic_es_card_icon.png',
        'pt': '/images/icons/castaic_pt_card_icon.png'
      },
      'carpinteria': {
        'en': '/images/icons/carpinteria_card_icon.png',
        'es': '/images/icons/carpinteria_es_card_icon.png',
        'pt': '/images/icons/carpinteria_pt_card_icon.png'
      },
      'sweet-carolina': {
        'en': '/images/icons/sweetcarolina_card_icon.png',
        'es': '/images/icons/sweetcarolina_es_card_icon.png',
        'pt': '/images/icons/sweetcarolina_pt_card_icon.png'
      }
    };

    return iconMap[cultivarId]?.[lang] || iconMap[cultivarId]?.['en'] || '';
  };

  // Helper function to get alt text
  const getAltText = (cultivarId: string): string => {
    const altMap: { [key: string]: string } = {
      'adelanto': 'Adelanto Icon',
      'debug': 'CBC Cultivar Explorer Icon',
      'alhambra': 'Alhambra Icon',
      'alturas': 'Alturas Icon',
      'artesia': 'Artesia Icon',
      'belvedere': 'Belvedere Icon',
      'brisbane': 'Brisbane Icon',
      'castaic': 'Castaic Icon',
      'carpinteria': 'Carpinteria Icon',
      'sweet-carolina': 'Sweet Carolina Icon'
    };
    return altMap[cultivarId] || `${cultivar.name} Icon`;
  };

  // Cultivars with custom icons
  const customIconCultivars = ['adelanto', 'debug', 'alhambra', 'alturas', 'artesia', 'belvedere', 'brisbane', 'castaic', 'carpinteria', 'sweet-carolina'];
  
  if (customIconCultivars.includes(cultivar.id)) {
    const iconPath = getIconPath(cultivar.id, language);
    const altText = getAltText(cultivar.id);
    
    return (
      <div className="flex items-center justify-center h-full p-2">
        <img 
          src={iconPath}
          alt={altText}
          className={`w-full h-full object-contain drop-shadow-lg ${isMobile ? 'max-w-[130px] max-h-[50px]' : 'max-w-[130px] max-h-[50px]'}`}
        />
      </div>
    );
  }

  // Default layout for other cultivars (emoji + name)
  return (
    <div className={`flex flex-col items-center justify-center h-full text-center ${isMobile ? 'p-2' : 'p-4'}`}>
      <div className={`${isMobile ? 'text-2xl mb-1' : 'text-4xl mb-3'} drop-shadow-lg`}>{cultivar.emoji}</div>
      <div className={`${isMobile ? 'cultivar-tag-mobile truncate w-full px-1 glass-text text-xs' : 'cultivar-tag truncate w-full px-2 glass-text'}`}>
        {cultivar.name}
      </div>
    </div>
  );
}

