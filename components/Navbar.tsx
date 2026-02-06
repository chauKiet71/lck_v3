
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../context/AppContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hash, setHash] = useState<string>(() => typeof window !== 'undefined' ? window.location.hash : '');
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { language, setLanguage, theme, toggleTheme, t } = useAppContext();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    // set initial hash in case page loaded with a hash
    setHash(typeof window !== 'undefined' ? window.location.hash : '');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Clear temporary selection when real URL state changes
  useEffect(() => {
    if (selectedLink) setSelectedLink(null);
  }, [pathname, hash]);

  // Close mobile menu on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSmartClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, linkName?: string) => {
    const targetHash = href.includes('#') ? href.split('#')[1] : '';
    const isHome = pathname === '/' || pathname === '';

    // Case 1: Same page anchor click
    if (isHome && targetHash) {
      e.preventDefault();
      const elem = document.getElementById(targetHash);
      if (elem) {
        // Use generic scrollIntoView which respects CSS scroll-margin-top
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', `/#${targetHash}`);
        setHash(`#${targetHash}`);
        if (linkName) setSelectedLink(linkName);
        setIsMobileOpen(false);
      }
      return;
    }

    // Case 2: Back to Top (Home link) on Home page
    if (isHome && href === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
      setHash('');
      if (linkName) setSelectedLink(linkName);
      setIsMobileOpen(false);
      return;
    }

    // Case 3: Navigation to another page or from another page
    if (linkName) setSelectedLink(linkName);
    setIsMobileOpen(false);
  };

  const navLinks = [
    { name: t('nav.home') || 'Home', href: '/', hash: '' },
    { name: t('nav.services') || 'Services', href: '/', hash: '#services' },
    { name: t('nav.about') || 'About', href: '/', hash: '#about' },
    { name: t('nav.insights') || 'Insights', href: '/', hash: '#news' },
    // { name: t('nav.crm') || 'CRM', href: '/crm', hash: '' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-navy-deep/90 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="https://sf-static.upanhlaylink.com/img/image_2026020594684ce0352ead3ab5bbb9ccde9b70b4.jpg"
            alt="Lê Châu Kiệt Logo"
            className="w-10 h-10 rounded-full object-cover shadow-lg"
          />
          <h1 className="text-xl font-extrabold tracking-tight text-white uppercase hidden sm:block">{t('brand')}</h1>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => {
            const href = (link.href + link.hash) || '/';
            // Prefer a temporarily selected link so clicking "About" or "Services" immediately overrides "Home"
            const isActive = selectedLink ? selectedLink === link.name : (pathname === link.href && (link.hash ? hash === link.hash : true));
            return (
              <Link
                key={link.name}
                href={href}
                scroll={false}
                onClick={(e) => handleSmartClick(e, href, link.name)}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all ${isActive ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
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

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            aria-label="Open Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
            aria-label="Toggle Theme"
          >
            <span className="material-symbols-outlined text-lg">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>

          <Link
            href="/#contact"
            scroll={false}
            onClick={(e) => handleSmartClick(e, '/#contact')}
            className="bg-white text-navy-deep px-5 md:px-7 py-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/20"
          >
            {t('nav.contact')}
          </Link>
        </div>
      </div>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" role="dialog" aria-modal="true" onClick={() => setIsMobileOpen(false)}>
          <div className="fixed top-16 right-4 left-4 bg-navy-deep/95 border border-white/10 rounded-lg p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">Menu</h2>
              <button onClick={() => setIsMobileOpen(false)} className="text-slate-400 hover:text-white" aria-label="Close Menu">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const href = (link.href + link.hash) || '/';
                const isActive = selectedLink ? selectedLink === link.name : (pathname === link.href && (link.hash ? hash === link.hash : true));
                return (
                  <Link
                    key={link.name}
                    href={href}
                    scroll={false}
                    onClick={(e) => handleSmartClick(e, href, link.name)}
                    className={`text-white font-bold uppercase text-sm ${isActive ? 'text-primary' : 'text-slate-300 hover:text-white'}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
