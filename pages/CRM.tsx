
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { GoogleGenAI, Type } from "@google/genai";
import Editor from '../components/Editor';

const CRM: React.FC = () => {
  const { t, insights, addInsight, updateInsight, deleteInsight, language } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [formData, setFormData] = useState({
    slug: '',
    titleEn: '',
    titleVi: '',
    descEn: '',
    descVi: '',
    contentEn: '',
    contentVi: '',
    categoryEn: 'Performance',
    categoryVi: 'Hiệu suất',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  });

  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>, lang: 'en' | 'vi') => {
    const val = e.target.value;
    setFormData(prev => {
      const newState = { ...prev };
      if (lang === 'en') newState.titleEn = val;
      else newState.titleVi = val;

      // Auto-generate slug from English title if empty, or fallback to Vietnamese
      if (!prev.slug) {
        newState.slug = generateSlug(lang === 'en' ? val : (prev.titleEn || val));
      }
      return newState;
    });
  };

  const handleAiSuggest = async () => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      alert("API_KEY required for intelligence services.");
      return;
    }
    if (!formData.titleEn && !formData.titleVi) {
      alert("Please provide at least a title.");
      return;
    }

    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a professional digital strategy insight for a luxury consultant website.
        Subject: ${formData.titleEn || formData.titleVi}
        Tone: Analytical, Strategic, Elite.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              descEn: { type: Type.STRING },
              descVi: { type: Type.STRING },
              contentEn: { type: Type.STRING },
              contentVi: { type: Type.STRING },
              categoryEn: { type: Type.STRING },
              categoryVi: { type: Type.STRING }
            },
            required: ["descEn", "descVi", "contentEn", "contentVi", "categoryEn", "categoryVi"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setFormData(prev => ({
        ...prev,
        descEn: data.descEn || prev.descEn,
        descVi: data.descVi || prev.descVi,
        contentEn: data.contentEn || prev.contentEn,
        contentVi: data.contentVi || prev.contentVi,
        categoryEn: data.categoryEn || prev.categoryEn,
        categoryVi: data.categoryVi || prev.categoryVi
      }));
    } catch (e) {
      console.error("AI Suggestion Error:", e);
      alert("AI Service Interrupted. Check connection or key.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug) {
      alert("Slug is required!");
      return;
    }
    // Check for duplicate slugs only if adding or if changing slug (though slug change logic might need more care)
    // For simplicity, we disable slug editing in edit mode or strictly check.
    if (!editingId && insights.some(i => i.id === formData.slug)) {
      alert("This URL Slug already exists. Please choose another one.");
      return;
    }

    const newInsight = {
      id: formData.slug,
      category: formData.categoryEn,
      title: formData.titleEn,
      description: formData.descEn,
      content: formData.contentEn,
      imageUrl: formData.imageUrl,
      localized: {
        en: { title: formData.titleEn, desc: formData.descEn, cat: formData.categoryEn, content: formData.contentEn },
        vi: { title: formData.titleVi, desc: formData.descVi, cat: formData.categoryVi, content: formData.contentVi }
      }
    };

    if (editingId) {
      updateInsight(editingId, newInsight as any);
    } else {
      addInsight(newInsight as any);
    }

    setIsAdding(false);
    setEditingId(null);
    setFormData({
      slug: '',
      titleEn: '', titleVi: '', descEn: '', descVi: '',
      contentEn: '', contentVi: '',
      categoryEn: 'Performance', categoryVi: 'Hiệu suất', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    });
  };

  const handleEdit = (insight: any) => {
    setEditingId(insight.id);
    setFormData({
      slug: insight.id,
      titleEn: insight.localized?.en?.title || insight.title,
      titleVi: insight.localized?.vi?.title || '',
      descEn: insight.localized?.en?.desc || insight.description,
      descVi: insight.localized?.vi?.desc || '',
      contentEn: insight.localized?.en?.content || insight.content || '',
      contentVi: insight.localized?.vi?.content || '',
      categoryEn: insight.localized?.en?.cat || insight.category,
      categoryVi: insight.localized?.vi?.cat || '',
      imageUrl: insight.imageUrl
    });
    setIsAdding(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-deep pt-32 pb-20 px-6 lg:px-12 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">{t('crm.title')}</h1>
            <p className="text-slate-500 font-light">{t('crm.subtitle')}</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(!isAdding);
              if (isAdding) { // Closing form
                setEditingId(null);
                setFormData({
                  slug: '',
                  titleEn: '', titleVi: '', descEn: '', descVi: '',
                  contentEn: '', contentVi: '',
                  categoryEn: 'Performance', categoryVi: 'Hiệu suất', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
                });
              }
            }}
            className={`${isAdding ? 'bg-slate-200 dark:bg-white/10 text-slate-500' : 'bg-primary text-white shadow-lg shadow-primary/20'} px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all flex items-center gap-2`}
          >
            <span className="material-symbols-outlined">{isAdding ? 'close' : 'add'}</span>
            {isAdding ? t('crm.btn_cancel') : t('crm.add_new')}
          </button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-16 bg-white dark:bg-navy-surface p-10 rounded-[3rem] border border-black/5 dark:border-white/5 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-black/5 dark:border-white/5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">edit_note</span>
                  Insight Composer
                </h3>
                <button
                  onClick={handleAiSuggest}
                  disabled={aiLoading}
                  type="button"
                  className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest bg-primary/10 px-6 py-3 rounded-full hover:bg-primary/20 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  {aiLoading ? 'Synthesizing...' : 'Generate with AI'}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">URL Slug (ID - Cannot be changed in Edit Mode)</label>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border-b border-black/10 dark:border-white/10 px-2">
                    <span className="text-slate-400 text-sm">/insight/</span>
                    <input
                      disabled={!!editingId}
                      className={`w-full bg-transparent border-0 focus:ring-0 text-primary font-bold py-3 outline-none transition-all ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                      placeholder="my-awesome-article"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t('crm.form_title_en')}</label>
                    <input
                      className="w-full bg-slate-50 dark:bg-white/5 border-0 border-b border-black/10 dark:border-white/10 focus:border-primary focus:ring-0 text-slate-900 dark:text-white py-3 outline-none transition-all px-2"
                      value={formData.titleEn}
                      onChange={e => handleTitleChange(e, 'en')}
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t('crm.form_title_vi')}</label>
                    <input
                      className="w-full bg-slate-50 dark:bg-white/5 border-0 border-b border-black/10 dark:border-white/10 focus:border-primary focus:ring-0 text-slate-900 dark:text-white py-3 outline-none transition-all px-2"
                      value={formData.titleVi}
                      onChange={e => handleTitleChange(e, 'vi')}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t('crm.form_desc_en')}</label>
                    <textarea
                      className="w-full bg-slate-50 dark:bg-white/5 border-0 border-b border-black/10 dark:border-white/10 focus:border-primary focus:ring-0 text-slate-900 dark:text-white py-3 outline-none transition-all px-2 resize-none"
                      rows={2}
                      value={formData.descEn}
                      onChange={e => setFormData({ ...formData, descEn: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t('crm.form_desc_vi')}</label>
                    <textarea
                      className="w-full bg-slate-50 dark:bg-white/5 border-0 border-b border-black/10 dark:border-white/10 focus:border-primary focus:ring-0 text-slate-900 dark:text-white py-3 outline-none transition-all px-2 resize-none"
                      rows={2}
                      value={formData.descVi}
                      onChange={e => setFormData({ ...formData, descVi: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t('crm.form_content_en')}</label>
                    <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-inner">
                      <Editor
                        value={formData.contentEn}
                        onChange={(val) => setFormData(prev => ({ ...prev, contentEn: val }))}
                        placeholder="Write your article in English..."
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t('crm.form_content_vi')}</label>
                    <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-inner">
                      <Editor
                        value={formData.contentVi}
                        onChange={(val) => setFormData(prev => ({ ...prev, contentVi: val }))}
                        placeholder="Viết bài viết tiếng Việt..."
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-end">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t('crm.form_img')}</label>
                    <input
                      className="w-full bg-slate-50 dark:bg-white/5 border-0 border-b border-black/10 dark:border-white/10 focus:border-primary focus:ring-0 text-slate-900 dark:text-white py-3 outline-none transition-all px-2"
                      value={formData.imageUrl}
                      onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-navy-deep py-4 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-primary hover:text-white transition-all active:scale-95">
                      {t('crm.btn_save')}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white dark:bg-navy-surface rounded-[3rem] border border-black/5 dark:border-white/5 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                  <th className="px-10 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('crm.table_title')}</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('crm.table_cat')}</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">{t('crm.table_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {insights.map(item => {
                  const displayTitle = (item as any).localized?.[language]?.title || item.title;
                  const displayCat = (item as any).localized?.[language]?.cat || item.category;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                            <img src={item.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                              {displayTitle}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                              /{item.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                          {displayCat}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-all"
                          >
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button
                            onClick={() => deleteInsight(item.id)}
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {insights.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-10 py-32 text-center text-slate-500 italic">
                      <span className="material-symbols-outlined text-6xl mb-4 block text-slate-200">folder_open</span>
                      {t('crm.empty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRM;
