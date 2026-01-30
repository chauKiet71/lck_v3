
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const Hero: React.FC = () => {
  const { t } = useAppContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const fullTitle = t('hero.title');
  // Safe split for highlighting "Strategies" in English or keeping it solid in Vietnamese
  const titleParts = fullTitle.includes('Strategies') ? fullTitle.split(' Strategies') : [fullTitle, ''];

  return (
    <section id="home" className="luxury-gradient min-h-screen flex items-center px-6 lg:px-12 relative overflow-hidden pt-20">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
        <motion.div 
          className="flex flex-col gap-10 max-w-2xl relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-600 dark:text-silver-accent px-5 py-2 rounded-full w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t('hero.tagline')}</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-slate-900 dark:text-white">
            {titleParts[0]}
            {titleParts[1] !== '' && (
              <> <span className="silver-text">Strategies</span> {titleParts[1]}</>
            )}
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-light">
            {t('hero.subtitle')}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-5">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-blue-600 text-white px-10 py-5 rounded-full text-sm font-bold tracking-widest transition-all flex items-center gap-3 shadow-2xl shadow-primary/20 uppercase"
            >
              <span>{t('hero.consult')}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border border-black/10 dark:border-white/10 hover:border-primary text-slate-900 dark:text-white px-10 py-5 rounded-full text-sm font-bold tracking-widest transition-all uppercase"
            >
              {t('hero.portfolio')}
            </motion.button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex gap-12 pt-4 border-t border-black/5 dark:border-white/5">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tighter">{t('hero.stat1')}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{t('hero.stat1_desc')}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tighter">{t('hero.stat2')}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{t('hero.stat2_desc')}</p>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="relative hidden lg:block"
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        >
          <div className="aspect-[4/5] bg-slate-200 dark:bg-navy-surface rounded-[3rem] border border-black/5 dark:border-white/10 p-4 shadow-2xl relative overflow-hidden group">
            <div 
              className="w-full h-full rounded-[2.5rem] bg-cover bg-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
              style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBngjehI-YCNXHDpes3RMvHnDTG7bu9dCIwK9pvb0Go0xljdV1IxoneLNogtQF3YHF41euyiyw2uAthC6oxH6VXG54CVAgXu1OV34nKfSFQl22uUlq7f5SgAMOsKJmNlbPmvijih9HgeRcSW1J3hWrKhMLoA9nFdqpDOx-4lNUFMMIAJfqFkJ48rr_9tx9IqjwFvPRDq2XwPMPaFGREi8H2YO5u2ywn6JqVLatHfW2M7S-adAUwVs1ONYJmp1HWjjnKhNCFVWVW2eM")` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-200/80 dark:from-navy-deep/80 via-transparent to-transparent"></div>
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute -bottom-8 -left-8 bg-white/90 dark:bg-navy-surface/90 backdrop-blur-md p-8 rounded-3xl border border-black/5 dark:border-white/10 shadow-2xl flex items-center gap-6"
          >
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">insights</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('hero.roi_tag')}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">+250% ROI</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
