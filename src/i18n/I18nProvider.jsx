import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import skTranslations from '../translations/sk.json';
import enTranslations from '../translations/en.json';

const translations = {
  sk: skTranslations,
  en: enTranslations,
};

const I18nContext = createContext();

export function I18nProvider({ children }) {
  // Get language from localStorage or default to Slovak
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('language');
      return saved || 'sk';
    } catch {
      return 'sk';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  }, [language]);

  // Memoize translation function for better performance
  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  }, [language]);

  const switchLanguage = useCallback((lang) => {
    setLanguage(lang);
  }, []);

  const value = useMemo(() => ({
    language,
    t,
    switchLanguage
  }), [language, t, switchLanguage]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
