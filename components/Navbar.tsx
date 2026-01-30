
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../context/AppContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, theme, toggleTheme, t } = useAppContext();
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home') || 'Home', href: '/', hash: '' },
    { name: t('nav.services') || 'Services', href: '/', hash: '#services' },
    { name: t('nav.insights') || 'Insights', href: '/news', hash: '' },
    { name: t('nav.crm') || 'CRM', href: '/crm', hash: '' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-navy-deep/90 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined font-bold">diamond</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white uppercase hidden sm:block">Lê Châu Kiệt</h1>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => {
            const href = (link.href + link.hash) || '/';
            return (
              <Link 
                key={link.name} 
                href={href}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all ${pathname === link.href ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1">
            <button
              onClick={() => setLanguage('vi')}
              className={`px-3 py-1 text-[9px] font-bold rounded-full transition-all ${language === 'vi' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              VI
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-[9px] font-bold rounded-full transition-all ${language === 'en' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              EN
            </button>
          </div>

          <button 
            onClick={toggleTheme} 
            className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
            aria-label="Toggle Theme"
          >
            <span className="material-symbols-outlined text-lg">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>

          <Link href="/#contact" className="bg-white text-navy-deep px-5 md:px-7 py-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/20">
            {t('nav.contact')}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
