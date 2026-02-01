
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';


const Contact: React.FC = () => {
  const { t } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    note: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ fullName: '', phone: '', email: '', note: '' });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
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
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-12 px-6"
              >
                <div className="w-24 h-24 bg-sky-400 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-sky-400/30">
                  <span className="material-symbols-outlined text-5xl">check</span>
                </div>

                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
                  {t('contact.thank_you_title') || 'Message Sent'}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md text-lg leading-relaxed font-light">
                  {t('contact.thank_you_message') || 'We have received your information and will contact you shortly.'}
                </p>

                <button
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  {t('contact.back')}
                </button>
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
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-black/10 dark:border-white/10 focus:border-transparent focus:outline-[0px] focus:ring-0 transition-all text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-black/10 dark:border-white/10 focus:border-transparent focus:outline-[0px] focus:ring-0 transition-all text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-black/10 dark:border-white/10 focus:border-transparent focus:outline-[0px] focus:ring-0 transition-all text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Note (Optional)</label>
                  <textarea
                    rows={3}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-black/10 dark:border-white/10 focus:border-transparent focus:outline-[0px] focus:ring-0 transition-all text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 resize-none"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-navy-deep py-6 rounded-full font-bold text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-primary border-t-transparent animate-spin rounded-full"></span>
                      <span className="animate-pulse">Sending...</span>
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
