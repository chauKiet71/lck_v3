
'use client';

import React from 'react';
import { useAppContext } from '../context/AppContext';

const Footer: React.FC = () => {
  const { t } = useAppContext();

  return (
    <footer className="py-20 border-t border-black/5 dark:border-white/5 px-6 lg:px-12 bg-white dark:bg-navy-deep transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 dark:bg-white/10 rounded-full flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-xs font-bold">diamond</span>
          </div>
          <h2 className="text-lg font-extrabold tracking-[0.1em] text-slate-900 dark:text-white uppercase">Lê Châu Kiệt</h2>
        </div>
        <p className="text-slate-500 text-[10px] uppercase tracking-widest">
          {t('footer.rights')}
        </p>
        <div className="flex gap-10 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <a href="#" className="hover:text-primary transition-colors">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-primary transition-colors">{t('footer.agreement')}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
