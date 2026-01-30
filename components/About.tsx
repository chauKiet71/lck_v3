
'use client';

import React from 'react';
import { useAppContext } from '../context/AppContext';

const About: React.FC = () => {
  const { t } = useAppContext();

  return (
    <section className="py-32 px-6 lg:px-12 bg-white dark:bg-navy-deep transition-colors" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="aspect-square bg-slate-100 dark:bg-navy-surface rounded-[3rem] overflow-hidden relative border border-black/5 dark:border-white/5 shadow-xl">
            <div 
              className="w-full h-full bg-cover bg-center grayscale contrast-125 hover:scale-105 transition-transform duration-1000"
              style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPGeDd3pGYQM7N2VY5TPA1NLcAfSJG1rDExkaBk6hHhp0BG3BGYN1VHLmWS1uaTjidPuSmtNIdSeUVXI6f4IWcwb5L2uaZXleiZO4az_Up-yJuUQqpIqjnsIDG3iE5kx0t0VpxvrGGsm5A2Lf7O58uUPx3TT757OAh43HQYMXXZ-vvqd1-GtHcsnQOKKLb24wpOkmfEzwGc_d50pjQ8SlKzAcpobtpaNZpc1-CsrZa-pgjnMTJUHqC-e4ZWdfBayLzSd0JXinuYgU")` }}
            ></div>
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="w-12 h-1 bg-primary"></div>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('about.vision')}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              {t('about.p1')}
            </p>
            <p className="text-lg text-slate-500 dark:text-slate-500 leading-relaxed">
              {t('about.p2')}
            </p>
            <div className="grid grid-cols-2 gap-12 mt-4">
              <div>
                <h4 className="text-slate-900 dark:text-white text-5xl font-extrabold tracking-tighter">500+</h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">{t('about.stat1')}</p>
              </div>
              <div>
                <h4 className="text-slate-900 dark:text-white text-5xl font-extrabold tracking-tighter">8+</h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">{t('about.stat2')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
