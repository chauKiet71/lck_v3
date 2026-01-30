
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Theme, Insight } from '../types';
import { translations } from '../translations';
import { INSIGHTS as DEFAULT_INSIGHTS } from '../constants';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (path: string) => string;
  insights: Insight[];
  addInsight: (insight: Insight) => void;
  deleteInsight: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi');
  const [theme, setTheme] = useState<Theme>('dark');
  const [insights, setInsights] = useState<Insight[]>(DEFAULT_INSIGHTS);

  // Client-side only initialization
  useEffect(() => {
    const savedLang = localStorage.getItem('app-lang') as Language;
    if (savedLang) setLanguage(savedLang);
    
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    if (savedTheme) setTheme(savedTheme);

    const savedInsights = localStorage.getItem('app-insights');
    if (savedInsights) setInsights(JSON.parse(savedInsights));
  }, []);

  useEffect(() => {
    localStorage.setItem('app-lang', language);
    localStorage.setItem('app-theme', theme);
    localStorage.setItem('app-insights', JSON.stringify(insights));
    
    const root = window.document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
  }, [language, theme, insights]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const addInsight = (newInsight: Insight) => setInsights(prev => [newInsight, ...prev]);
  const deleteInsight = (id: string) => setInsights(prev => prev.filter(item => item.id !== id));

  const t = (path: string): string => {
    const keys = path.split('.');
    let result: any = translations[language];
    for (const key of keys) {
      if (!result || result[key] === undefined) return path;
      result = result[key];
    }
    return result;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, toggleTheme, t, insights, addInsight, deleteInsight }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
