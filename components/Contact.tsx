
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { generateStrategyReport } from '../services/geminiService';
import { StrategyReport } from '../types';

const Contact: React.FC = () => {
  const { t } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [report, setReport] = useState<StrategyReport | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Paid Social Excellence',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message || !formData.name) return;
    
    setLoading(true);
    try {
      const analysis = await generateStrategyReport(`Name: ${formData.name}, Interest: ${formData.service}, Vision: ${formData.message}`);
      setReport(analysis);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-32 px-6 lg:px-12 bg-slate-100 dark:bg-navy-surface/30 transition-colors" id="contact">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-light">
            {t('contact.subtitle')}
          </p>
          
          <div className="space-y-8 mb-16">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-white dark:bg-navy-surface border border-black/5 dark:border-white/10 rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inquiries</p>
                <p className="font-bold text-slate-900 dark:text-white text-lg">concierge@lechaukiet.com</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-white dark:bg-navy-surface border border-black/5 dark:border-white/10 rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Strategic Line</p>
                <p className="font-bold text-slate-900 dark:text-white text-lg">+84 90 123 4567</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-navy-surface p-12 lg:p-16 rounded-[3rem] border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="report"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">AI Strategy Preview</h3>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Bespoke Analysis by Gemini 3 Pro</p>
                  </div>
                </div>
                
                {report && (
                  <div className="space-y-8 divide-y divide-black/5 dark:divide-white/5">
                    <div className="pt-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Executive Summary</p>
                      <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed italic border-l-2 border-primary/30 pl-4">
                        {report.executiveSummary}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 pt-8">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Market Gap</p>
                        <p className="text-slate-600 dark:text-slate-300 font-light text-sm">{report.marketGap}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Projected ROI</p>
                        <p className="text-primary text-xl font-black tracking-tight">{report.projectedRoI}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="pt-8 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xs">refresh</span>
                    {t('contact.back')}
                  </button>
                  <span className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-medium italic">Confidential Analysis</span>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8" 
                onSubmit={handleSubmit}
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('contact.form_name')}</label>
                    <input 
                      type="text" 
                      placeholder="Alexander Hamilton" 
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-black/10 dark:border-white/10 focus:border-transparent focus:outline-none focus:ring-0 transition-all text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('contact.form_phone')}</label>
                    <input 
                      type="tel" 
                      placeholder="+84 ..." 
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-black/10 dark:border-white/10 focus:border-transparent focus:outline-none focus:ring-0 transition-all text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('contact.form_interest')}</label>
                  <select 
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-black/10 dark:border-white/10 focus:border-transparent focus:outline-none focus:ring-0 transition-all text-slate-900 dark:text-white/50"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                  >
                    <option className="bg-white dark:bg-navy-surface text-slate-900 dark:text-white">Paid Social Excellence</option>
                    <option className="bg-white dark:bg-navy-surface text-slate-900 dark:text-white">TikTok Ecosystem</option>
                    <option className="bg-white dark:bg-navy-surface text-slate-900 dark:text-white">Digital Architecture</option>
                    <option className="bg-white dark:bg-navy-surface text-slate-900 dark:text-white">Strategic Advisory</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('contact.form_vision')}</label>
                  <textarea 
                    rows={3} 
                    placeholder={t('contact.form_vision_placeholder')}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-black/10 dark:border-white/10 focus:border-transparent focus:outline-none focus:ring-0 transition-all text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  disabled={loading || !formData.message || !formData.name}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-navy-deep py-6 rounded-full font-bold text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-primary border-t-transparent animate-spin rounded-full"></span>
                      <span className="animate-pulse">Synthesizing Strategy...</span>
                    </>
                  ) : t('contact.form_submit')}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
