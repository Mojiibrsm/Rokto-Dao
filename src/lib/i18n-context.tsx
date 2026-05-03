'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language } from './translations';

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('bn');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('roktodao_lang') as Language;
    if (savedLang && (savedLang === 'bn' || savedLang === 'en')) {
      setLangState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('roktodao_lang', newLang);
    document.documentElement.lang = newLang;
  };

  const t = translations[lang];

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
