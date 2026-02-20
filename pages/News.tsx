
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const News: React.FC = () => {
  const { t, insights, language } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    insights.forEach(item => {
      const cat = (item as any).localized?.[language]?.cat || item.category;
      if (cat) cats.add(cat);
    });
    return Array.from(cats);
  }, [insights, language]);

  const filteredInsights = useMemo(() => {
    return insights.filter(item => {
      const displayData = (item as any).localized?.[language] || {
        title: t(`insights.items.${item.id}.title`),
        desc: t(`insights.items.${item.id}.desc`),
        cat: t(`insights.items.${item.id}.category`) || item.category
      };

      const matchesSearch =
        displayData.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        displayData.desc?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !activeCategory || (displayData.cat === activeCategory || item.category === activeCategory);

      return matchesSearch && matchesCategory;
    });
  }, [insights, language, searchTerm, activeCategory, t]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  const totalPages = Math.ceil(filteredInsights.length / ITEMS_PER_PAGE);
  const paginatedInsights = filteredInsights.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy-deep pt-32 pb-20 px-6 lg:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 border-b border-black/5 dark:border-white/5 pb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white tracking-tighter mb-6 uppercase italic">
              {t('news.title')}
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              {t('news.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-80"
          >
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
              <input
                type="text"
                placeholder={t('news.search_placeholder')}
                className="w-full bg-slate-50 dark:bg-navy-surface border border-black/5 dark:border-white/10 rounded-full py-4 pl-12 pr-6 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>

        {/* Categories Bar */}
        <motion.div
          layout
          className="flex flex-wrap gap-4 mb-16 items-center"
        >
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${!activeCategory ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'}`}
          >
            {t('news.all_categories')}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'}`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid Section */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-16"
        >
          <AnimatePresence mode="popLayout">
            {paginatedInsights.map((insight, index) => {
              const displayData = (insight as any).localized?.[language] || {
                title: t(`insights.items.${insight.id}.title`),
                desc: t(`insights.items.${insight.id}.desc`),
                cat: (insight as any).localized?.[language]?.cat || insight.category
              };

              return (
                <motion.div
                  key={insight.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={`/news/${insight.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[8/5] rounded-[1rem] bg-slate-100 dark:bg-navy-surface mb-8 overflow-hidden border border-black/5 dark:border-white/5 shadow-lg">
                      <div
                        className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                        style={{ backgroundImage: `url("${insight.imageUrl}")` }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {/* <div className="absolute top-6 right-6">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all">
                          <span className="material-symbols-outlined text-sm">arrow_outward</span>
                        </div>
                      </div> */}
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
                        {displayData.cat || insight.category}
                      </span>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
                        {displayData.title || insight.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-light line-clamp-3">
                        {displayData.desc || insight.description}
                      </p>
                      <div className="pt-4 flex items-center gap-4">
                        <span className="w-10 h-px bg-black/10 dark:bg-white/10 group-hover:w-16 group-hover:bg-primary transition-all duration-500"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Read More</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-20">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-3 rounded-full transition-all ${currentPage === 1 ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10'}`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${currentPage === page ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-full transition-all ${currentPage === totalPages ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10'}`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}

        {filteredInsights.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 text-center"
          >
            <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-white/10 mb-6">article</span>
            <p className="text-slate-500 italic">{t('news.no_results')}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default News;
