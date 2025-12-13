
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { translations, Language } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper: Check if item is a non-array object
const isObject = (item: any) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Helper: Robust Recursive Deep Merge
const deepMerge = (target: any, source: any): any => {
  // If source is missing, return target (English fallback)
  if (!source) return target;
  
  // Create a shallow copy of target to ensure we start with English keys
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceValue = source[key];
      const targetValue = output[key];

      if (isObject(sourceValue) && isObject(targetValue)) {
        // If both are objects, merge recursively
        output[key] = deepMerge(targetValue, sourceValue);
      } else {
        // Otherwise, overwrite with source value (or add new key)
        output[key] = sourceValue;
      }
    });
  }
  
  return output;
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Use useMemo to prevent unnecessary re-calculations
  const t = useMemo(() => {
      // If language is English, return directly
      if (language === 'en') return translations.en;

      // Deep merge English with Selected Language
      // This ensures that missing sections in 'pt' (like dashboard, alcohol)
      // are completely filled by 'en' values.
      return deepMerge(translations.en, translations[language]);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
