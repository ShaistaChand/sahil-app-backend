import React, { createContext, useContext, useState, useEffect } from 'react';
import { isRTL, getTextDirection, languages, t } from '../utils/rtl';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    // Update document direction when language changes
    document.documentElement.dir = getTextDirection(language);
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  const switchLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const value = {
    language,
    switchLanguage,
    isRTL: isRTL(language),
    direction: getTextDirection(language),
    t: (key) => t(key, language)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;