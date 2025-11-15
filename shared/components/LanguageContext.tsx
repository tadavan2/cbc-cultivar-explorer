/**
 * Language Context - Reusable i18n System
 * 
 * PURPOSE:
 * Provides internationalization (i18n) support with language switching and translation functions.
 * This is a reusable component that can be used across multiple apps.
 * 
 * EXTRACTION STATUS:
 * Extracted from components/LanguageContext.tsx during Phase 2 refactoring (2025).
 * 
 * DEPENDENCIES:
 * - Translation JSON files in data/i18n/ directory
 * - React Context API
 * 
 * USAGE:
 * Wrap your app with LanguageProvider and TranslationProvider:
 * ```tsx
 * <LanguageProvider>
 *   <TranslationProvider>
 *     <YourApp />
 *   </TranslationProvider>
 * </LanguageProvider>
 * ```
 * 
 * Then use hooks in components:
 * ```tsx
 * const { language, setLanguage } = useLanguage();
 * const { t, getInfoOverlay } = useTranslation();
 * ```
 * 
 * FOR HOMEPAGE APP:
 * Copy this file and the data/i18n/ folder to your new app.
 * Update import paths as needed.
 */

'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import en from '../../data/i18n/en.json';
import es from '../../data/i18n/es.json';
import pt from '../../data/i18n/pt.json';
import infoOverlayEn from '../../data/i18n/infoOverlay.en.json';
import infoOverlayEs from '../../data/i18n/infoOverlay.es.json';
import infoOverlayPt from '../../data/i18n/infoOverlay.pt.json';

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
];

// Context type
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

const translations: Record<string, Record<string, string>> = {
  en,
  es,
  pt,
};

type InfoOverlayTranslation = { [key: string]: { title: string; content: string } };

const infoOverlayTranslations: Record<string, InfoOverlayTranslation> = {
  en: infoOverlayEn,
  es: infoOverlayEs,
  pt: infoOverlayPt,
};

interface TranslationContextType {
  t: (key: string) => string;
  getInfoOverlay: (key: string) => { title: string; content: string } | null;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { language } = useLanguage();
  
  const t = (key: string) => {
    const dict = translations[language] || translations['en'];
    const value = dict[key];
    return value || key;
  };

  const getInfoOverlay = (key: string) => {
    const dict = infoOverlayTranslations[language] || infoOverlayTranslations['en'];
    const value = dict[key];
    return value || null;
  };

  return (
    <TranslationContext.Provider value={{ t, getInfoOverlay }}>
      {children}
    </TranslationContext.Provider>
  );
};

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

