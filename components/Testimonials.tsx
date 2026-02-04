
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../constants';
import { useAppContext } from '../context/AppContext';

const Testimonials: React.FC = () => {
  const { t } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Responsive adjustments for items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, TESTIMONIALS.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="py-32 px-6 lg:px-12 bg-slate-50 dark:bg-navy-surface/20 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight"
            >
              {t('testimonials.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 dark:text-slate-400 font-light"
            >
              {t('testimonials.subtitle')}
            </motion.p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={prevSlide}
              className="w-14 h-14 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white hover:bg-primary hover:border-primary hover:text-white transition-all active:scale-90 group disabled:opacity-30"
              aria-label="Previous testimonial"
              disabled={currentIndex === 0}
            >
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">west</span>
            </button>
            <button
              onClick={nextSlide}
              className="w-14 h-14 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white hover:bg-primary hover:border-primary hover:text-white transition-all active:scale-90 group disabled:opacity-30"
              aria-label="Next testimonial"
              disabled={currentIndex === maxIndex}
            >
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">east</span>
            </button>
          </div>
        </div>

        {/* Slider Container - Hidden overflow to clip sliding boxes */}
        <div className="relative overflow-hidden">
          <div className="mx-[-12px] lg:mx-[-16px]">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              {TESTIMONIALS.map((testimonial) => (
                <div
                  key={testimonial.id}
                  style={{ minWidth: `${100 / itemsPerView}%` }}
                  className="px-3 lg:px-4"
                >
                  <div className="h-full bg-white dark:bg-navy-surface p-10 rounded-[2.5rem] border border-black/5 dark:border-white/5 hover:border-primary/30 transition-all group shadow-sm flex flex-col justify-between min-h-[400px]">
                    <div>
                      <div className="flex gap-1 text-primary/50 mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm fill-1">grade</span>
                        ))}
                      </div>
                      <p className="text-lg font-light italic text-slate-600 dark:text-slate-300 mb-12 leading-relaxed">
                        "{t(`testimonials.items.${testimonial.id}.quote`) || testimonial.quote}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 border border-black/5 dark:border-white/5"
                        style={{ backgroundImage: `url("${testimonial.avatarUrl}")` }}
                      ></div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-base">{testimonial.author}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === i ? 'w-8 bg-primary' : 'w-2 bg-slate-300 dark:bg-white/10'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
