
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SERVICES } from '../constants';
import { useAppContext } from '../context/AppContext';

const Services: React.FC = () => {
  const { t } = useAppContext();

  // Cấu hình transition dạng spring để tạo cảm giác phản hồi tức thì và cao cấp
  const hoverTransition = {
    type: "spring",
    stiffness: 400,
    damping: 25
  };

  return (
    <section className="py-32 px-6 lg:px-12 bg-slate-50 dark:bg-navy-surface/30 transition-colors" id="services">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6"
        >
          {t('services.title')}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 max-w-2xl mx-auto font-light"
        >
          {t('services.subtitle')}
        </motion.p>
      </div>
      
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {SERVICES.map((service, idx) => (
          <motion.div 
            key={service.id} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              opacity: { duration: 0.6, delay: idx * 0.1 },
              y: { duration: 0.6, delay: idx * 0.1 }
            }}
            // Sử dụng whileHover với spring transition để triệt tiêu cảm giác delay
            whileHover={{ 
              y: -12,
              scale: 1.02,
              transition: hoverTransition
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-navy-surface p-10 rounded-[2rem] border border-black/5 dark:border-white/5 hover:border-primary/40 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/5 group relative overflow-hidden"
          >
            {/* Hiệu ứng nền nhẹ khi hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-4xl">{service.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors duration-300">
                {t(`services.items.${service.id}.title`)}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                {t(`services.items.${service.id}.desc`)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
