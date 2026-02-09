
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Theme, Insight } from '../types';
import { translations } from '../translations';
// import { INSIGHTS as DEFAULT_INSIGHTS } from '../constants';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (path: string) => string;
  insights: Insight[];
  addInsight: (insight: Insight) => void;
  updateInsight: (id: string, insight: Insight) => void;
  deleteInsight: (id: string) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi');
  const [theme, setTheme] = useState<Theme>('dark');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Client-side initialization
  useEffect(() => {
    const savedLang = localStorage.getItem('app-lang') as Language;
    if (savedLang) setLanguage(savedLang);

    const savedTheme = localStorage.getItem('app-theme') as Theme;
    if (savedTheme) setTheme(savedTheme);

    // Fetch insights from API (Database)
    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/insights');
        if (res.ok) {
          const data = await res.json();
          // If DB is empty, use default and sync? Or just rely on user adding content?
          // For now, if DB has data, use it. If not, maybe use default?
          // Let's stick to DB source of truth. If empty, it's empty.
          if (data.length > 0) {
            setInsights(data);
          } else {
            // Auto-Migration: If DB is empty, check localStorage
            const localData = localStorage.getItem('app-insights');
            if (localData) {
              try {
                const parsedLocal = JSON.parse(localData);
                if (Array.isArray(parsedLocal) && parsedLocal.length > 0) {
                  // Migrate one by one
                  const migrated: Insight[] = [];
                  for (const item of parsedLocal) {
                    const res = await fetch('/api/insights', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(item)
                    });
                    if (res.ok) {
                      const saved = await res.json();
                      migrated.push(saved);
                    }
                  }
                  if (migrated.length > 0) {
                    setInsights(migrated);
                    console.log("Migrated insights from localStorage to Database");
                  } else {
                    setInsights([]);
                  }
                } else {
                  setInsights([]);
                }
              } catch (e) {
                console.error("Migration failed", e);
                setInsights([]);
              }
            } else {
              setInsights([]);
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch insights", e);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    fetchInsights();
  }, []);

  // Persist Theme/Lang only
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('app-lang', language);
    localStorage.setItem('app-theme', theme);

    const root = window.document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
  }, [language, theme, isInitialized]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const addInsight = async (newInsight: Insight) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInsight)
      });
      if (res.ok) {
        const savedInsight = await res.json();
        setInsights(prev => [savedInsight, ...prev]);
      }
    } catch (e) {
      console.error("Failed to add insight", e);
      alert("Failed to save to database");
    } finally {
      setIsLoading(false);
    }
  };

  const updateInsight = async (id: string, updatedInsight: Insight) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/insights/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInsight)
      });
      if (res.ok) {
        const savedInsight = await res.json();
        setInsights(prev => prev.map(item => item.id === id ? savedInsight : item));
      }
    } catch (e) {
      console.error("Failed to update insight", e);
      alert("Failed to update database");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInsight = async (id: string) => {
    setIsLoading(true);
    try {
      await fetch(`/api/insights/${id}`, { method: 'DELETE' });
      setInsights(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      console.error("Failed to delete insight", e);
      alert("Failed to delete from database");
    } finally {
      setIsLoading(false);
    }
  };

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
    <AppContext.Provider value={{ language, setLanguage, theme, toggleTheme, t, insights, addInsight, updateInsight, deleteInsight, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    // During pre-rendering on the server there is no AppProvider wrapping the tree.
    // Return a safe fallback so prerendering doesn't throw. Client hydration will replace
    // this with the real context provided by AppProvider.
    if (typeof window === 'undefined') {
      return {
        language: 'vi' as Language,
        setLanguage: () => { },
        theme: 'dark' as Theme,
        toggleTheme: () => { },
        t: (path: string) => path,
        insights: [],
        addInsight: () => { },
        updateInsight: () => { },
        deleteInsight: () => { },
        isLoading: false,
      } as AppContextType;
    }

    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
