/**
 * CultivarIcon - Reusable Icon Rendering Component
 *
 * PURPOSE:
 * Centralizes the logic for rendering cultivar icons based on cultivar ID and language.
 *
 * FUNCTIONALITY:
 * - Renders custom PNG icons for cultivars that declare `cardIconBase` in
 *   data/cultivarConfig.ts (the single source of truth for icon availability)
 * - Falls back to emoji + name display for cultivars without custom icons
 * - Supports multi-language icon variants (English, Spanish, Portuguese)
 * - Handles responsive sizing (mobile vs desktop)
 *
 * FILE LOCATIONS:
 * Icons are stored in: public/images/icons/
 * Format: {base}_card_icon.png (English)
 *         {base}_{lang}_card_icon.png (Spanish/Portuguese)
 * where {base} is the cultivar's `cardIconBase` (usually its id;
 * exceptions: sweet-carolina → 'sweetcarolina', debug → 'open').
 * Card icon spec: 859×275 PNG, transparent background.
 *
 * USAGE:
 * Used in app/page.tsx for both mobile and desktop cultivar card displays.
 *
 * RELATED FILES:
 * - data/cultivarConfig.ts: declares which cultivars have icons (cardIconBase)
 * - app/page.tsx: Main usage location
 * - public/images/icons/: Icon file storage
 */

import { Cultivar } from '../types/cultivar';
import { getCardIconPath } from '../data/cultivarConfig';

interface CultivarIconProps {
  cultivar: Cultivar;
  language: string;
  isMobile?: boolean;
}

export default function CultivarIcon({ cultivar, language, isMobile = false }: CultivarIconProps) {
  const iconPath = getCardIconPath(cultivar.id, language);

  if (iconPath) {
    const altText = cultivar.id === 'debug' ? 'CBC Cultivar Explorer Icon' : `${cultivar.name} Icon`;

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
