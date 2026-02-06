
'use client';

import React from 'react';
import Link from 'next/link';
import { useAppContext } from '../context/AppContext';

const Insights: React.FC = () => {
  const { t, language, insights } = useAppContext();

  // Chỉ hiển thị 3 bài viết mới nhất trên trang chủ
  const featuredInsights = insights.slice(0, 3);

  return (
    <section className="py-32 px-6 lg:px-12 bg-white dark:bg-navy-deep transition-colors" id="news">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 italic tracking-tight">{t('insights.title')}</h2>
            <p className="text-slate-500 font-light">{t('insights.subtitle')}</p>
          </div>
          <Link href="/news" className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:text-primary transition-all border-b border-black/10 dark:border-white/10 pb-2 group">
            {t('insights.view_journal')}
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {featuredInsights.map((insight) => {
            const isDynamic = !!(insight as any).localized;
            const displayData = isDynamic
              ? (insight as any).localized[language]
              : {
                title: t(`insights.items.${insight.id}.title`),
                desc: t(`insights.items.${insight.id}.desc`),
                cat: t(`insights.items.${insight.id}.category`)
              };

            return (
              <Link href={`/news/${insight.id}`} key={insight.id} className="group cursor-pointer block">
                <div className="aspect-[16/10] rounded-[2rem] bg-slate-100 dark:bg-navy-surface mb-8 overflow-hidden border border-black/5 dark:border-white/5 shadow-md">
                  <div
                    className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    style={{ backgroundImage: `url("${insight.imageUrl}")` }}
                  ></div>
                </div>
                <p className="text-[10px] font-bold text-primary mb-4 uppercase tracking-[0.3em]">
                  {displayData.cat || insight.category}
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                  {displayData.title || insight.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light line-clamp-2">
                  {displayData.desc || insight.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Insights;
