
'use client';

import React from 'react';
import { useAppContext } from '../context/AppContext';

const Philosophy: React.FC = () => {
  const { t } = useAppContext();

  const points = [
    {
      icon: 'star',
      title: t('philosophy.p1_title'),
      desc: t('philosophy.p1_desc')
    },
    {
      icon: 'psychology',
      title: t('philosophy.p2_title'),
      desc: t('philosophy.p2_desc')
    },
    {
      icon: 'verified_user',
      title: t('philosophy.p3_title'),
      desc: t('philosophy.p3_desc')
    }
  ];

  return (
    <section className="py-32 px-6 lg:px-12 bg-white dark:bg-navy-deep transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24 items-center">
        <div className="flex-1 space-y-12">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">{t('philosophy.title')}</h2>
          <div className="space-y-10">
            {points.map((p) => (
              <div key={p.title} className="flex gap-6">
                <div className="shrink-0 w-10 h-10 border border-primary/30 text-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm font-bold">{p.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-900 dark:text-white">{p.title}</h4>
                  <p className="text-slate-500 font-light mt-2">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="bg-slate-900 dark:bg-navy-surface p-16 rounded-[3rem] text-white relative overflow-hidden border border-white/5 shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <h3 className="text-3xl font-extrabold mb-6 leading-tight">{t('philosophy.cta_title')}</h3>
            <p className="text-slate-400 mb-10 leading-relaxed font-light">
              {t('philosophy.cta_desc')}
            </p>
            <button
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white text-navy-deep px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
            >
              {t('philosophy.cta_button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
