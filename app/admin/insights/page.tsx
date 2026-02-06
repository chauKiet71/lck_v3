'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { GoogleGenAI, Type } from "@google/genai";
import Editor from '@/components/Editor';

type Category = {
    id: string;
    name: string;
    slug: string;
};

const AdminInsights: React.FC = () => {
    const { t, insights, addInsight, updateInsight, deleteInsight, language } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [uploading, setUploading] = useState(false);

    // Fetch categories on mount
    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Failed to fetch categories", err));
    }, []);

    const [formData, setFormData] = useState({
        slug: '',
        titleEn: '',
        titleVi: '',
        descEn: '',
        descVi: '',
        contentEn: '',
        contentVi: '',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        categoryId: '',
        seoTitle: '',
        seoDesc: '',
        seoKeywords: ''
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
                model: 'gemini-2.0-flash-exp', // Updated model
                contents: `Create a professional digital strategy news article for a luxury consultant website.
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
                            // categoryEn: { type: Type.STRING }, // AI category guess is less reliable than explicit choice
                            // categoryVi: { type: Type.STRING }
                        },
                        required: ["descEn", "descVi", "contentEn", "contentVi"]
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
                // categoryEn: data.categoryEn || prev.categoryEn,
                // categoryVi: data.categoryVi || prev.categoryVi
            }));
        } catch (e) {
            console.error("AI Suggestion Error:", e);
            alert("AI Service Interrupted. Check connection or key.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, imageUrl: data.url }));
            } else {
                alert('Upload failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.slug) {
            alert("Slug is required!");
            return;
        }
        if (!formData.categoryId) {
            alert("Please select a category.");
            return;
        }

        if (!editingId && insights.some(i => i.id === formData.slug)) {
            alert("This URL Slug already exists. Please choose another one.");
            return;
        }

        const selectedCat = categories.find(c => c.id === formData.categoryId);
        const categoryName = selectedCat ? selectedCat.name : 'General';

        const newInsight = {
            id: formData.slug,
            category: categoryName, // Legacy support / Display name
            categoryId: formData.categoryId, // Relation ID
            title: formData.titleEn,
            description: formData.descEn,
            content: formData.contentEn,
            imageUrl: formData.imageUrl,
            seoTitle: formData.seoTitle,
            seoDescription: formData.seoDesc,
            seoKeywords: formData.seoKeywords,
            localized: {
                en: { title: formData.titleEn, desc: formData.descEn, cat: categoryName, content: formData.contentEn },
                vi: { title: formData.titleVi, desc: formData.descVi, cat: categoryName, content: formData.contentVi } // Assuming category name doesn't change translation for now simplicty
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
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            categoryId: '',
            seoTitle: '', seoDesc: '', seoKeywords: ''
        });
    };

    const handleEdit = (insight: any) => {
        setEditingId(insight.id);
        const savedLocalized = insight.localized || {};

        // Try to find matching category by name if ID isn't present (migration fallback)
        const catId = insight.categoryId || categories.find(c => c.name === insight.category)?.id || '';

        setFormData({
            slug: insight.id,
            titleEn: savedLocalized.en?.title || insight.title,
            titleVi: savedLocalized.vi?.title || '',
            descEn: savedLocalized.en?.desc || insight.description,
            descVi: savedLocalized.vi?.desc || '',
            contentEn: savedLocalized.en?.content || insight.content || '',
            contentVi: savedLocalized.vi?.content || '',
            categoryId: catId,
            imageUrl: insight.imageUrl,
            seoTitle: insight.seoTitle || '',
            seoDesc: insight.seoDescription || '',
            seoKeywords: insight.seoKeywords || ''
        });
        setIsAdding(true);
    };

    return (
        <div className="bg-white dark:bg-navy-surface rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">News Management</h1>
                    <p className="text-slate-500">Manage your strategic news articles.</p>
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
                                imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
                                categoryId: '',
                                seoTitle: '', seoDesc: '', seoKeywords: ''
                            });
                        }
                    }}
                    className={`${isAdding ? 'bg-slate-200 dark:bg-white/10 text-slate-500' : 'bg-primary text-white shadow-lg shadow-primary/20'} px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center gap-2`}
                >
                    <span className="material-symbols-outlined">{isAdding ? 'close' : 'add'}</span>
                    {isAdding ? 'Cancel' : 'New Article'}
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-10 overflow-hidden"
                    >
                        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border border-black/5">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">edit_note</span>
                                    Editor
                                </h3>
                                <button onClick={handleAiSuggest} disabled={aiLoading} type="button" className="text-primary text-sm font-bold flex items-center gap-2 hover:bg-white/50 px-3 py-1 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                    {aiLoading ? 'Thinking...' : 'AI Suggest'}
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Slug & Category */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">URL Slug / ID</label>
                                        <div className="flex items-center gap-2 bg-white dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/10">
                                            <span className="text-slate-400 text-sm">/news/</span>
                                            <input
                                                disabled={!!editingId}
                                                className={`w-full bg-transparent outline-none text-slate-900 dark:text-white font-mono ${editingId ? 'opacity-50' : ''}`}
                                                value={formData.slug}
                                                onChange={e => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                                                placeholder="my-article-slug"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                                        <select
                                            value={formData.categoryId}
                                            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="w-full bg-white dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/10 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white"
                                            required
                                        >
                                            <option value="" disabled>Select a category...</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                            {categories.length === 0 && <option value="" disabled>No categories found (Create some first)</option>}
                                        </select>
                                    </div>
                                </div>

                                {/* Titles */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">English Title</label>
                                        <input className="w-full bg-white dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/10 outline-none focus:ring-2 ring-primary/50 dark:text-white" value={formData.titleEn} onChange={e => handleTitleChange(e, 'en')} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Vietnamese Title</label>
                                        <input className="w-full bg-white dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/10 outline-none focus:ring-2 ring-primary/50 dark:text-white" value={formData.titleVi} onChange={e => handleTitleChange(e, 'vi')} required />
                                    </div>
                                </div>

                                {/* Descriptions */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">English Description</label>
                                        <textarea rows={2} className="w-full bg-white dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/10 outline-none focus:ring-2 ring-primary/50 dark:text-white resize-none" value={formData.descEn} onChange={e => setFormData({ ...formData, descEn: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Vietnamese Description</label>
                                        <textarea rows={2} className="w-full bg-white dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/10 outline-none focus:ring-2 ring-primary/50 dark:text-white resize-none" value={formData.descVi} onChange={e => setFormData({ ...formData, descVi: e.target.value })} />
                                    </div>
                                </div>

                                {/* SEO Settings */}
                                <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/5">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-500">search</span>
                                        SEO Settings
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Meta Title</label>
                                                <input className="w-full bg-white dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/10 outline-none focus:ring-2 ring-primary/50 dark:text-white text-sm" placeholder="Title for Google (Max 60 chars)" value={formData.seoTitle} onChange={e => setFormData({ ...formData, seoTitle: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Keywords</label>
                                                <input className="w-full bg-white dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/10 outline-none focus:ring-2 ring-primary/50 dark:text-white text-sm" placeholder="legacy, consulting, strategy (comma separated)" value={formData.seoKeywords} onChange={e => setFormData({ ...formData, seoKeywords: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase">Meta Description</label>
                                            <textarea rows={2} className="w-full bg-white dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/10 outline-none focus:ring-2 ring-primary/50 dark:text-white text-sm resize-none" placeholder="Description for search results (Max 160 chars)" value={formData.seoDesc} onChange={e => setFormData({ ...formData, seoDesc: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">English Content</label>
                                        <div className="bg-white dark:bg-black/20 rounded-lg border border-black/5 dark:border-white/10 overflow-hidden">
                                            <Editor value={formData.contentEn} onChange={(val) => setFormData(prev => ({ ...prev, contentEn: val }))} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Vietnamese Content</label>
                                        <div className="bg-white dark:bg-black/20 rounded-lg border border-black/5 dark:border-white/10 overflow-hidden">
                                            <Editor value={formData.contentVi} onChange={(val) => setFormData(prev => ({ ...prev, contentVi: val }))} />
                                        </div>
                                    </div>
                                </div>

                                {/* Meta */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Cover Image URL</label>
                                        <div className="flex gap-2">
                                            <input className="w-full bg-white dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/10 outline-none focus:ring-2 ring-primary/50 dark:text-white" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                                            <label className={`cursor-pointer bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-600 dark:text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors min-w-[60px] ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                {uploading ? (
                                                    <span className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></span>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined">upload_file</span>
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                        {formData.imageUrl && (
                                            <div className="mt-2">
                                                <img src={formData.imageUrl} alt="Preview" className="h-32 w-full object-cover rounded-lg border border-black/5 dark:border-white/5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-end">
                                        <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition">
                                            {editingId ? 'Update Article' : 'Publish Article'}
                                        </button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-black/5 dark:border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                            <th className="py-4 font-bold">Article</th>
                            <th className="py-4 font-bold">Category</th>
                            <th className="py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                        {insights.map(item => {
                            const displayTitle = (item as any).localized?.[language]?.title || item.title;
                            const savedLocalized = (item as any).localized || {};
                            const displayCategory = item.category; // Or fallback to category ID matching if we fetched updated insights with relations

                            return (
                                <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition">
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200">
                                                <img src={item.imageUrl} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{displayTitle}</p>
                                                <p className="text-xs text-slate-400 font-mono">/{item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className="bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                                            {displayCategory}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button onClick={() => handleEdit(item)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-500 rounded-lg">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button onClick={() => deleteInsight(item.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {insights.length === 0 && <p className="text-center text-slate-400 py-10 italic">No news found.</p>}
            </div>
        </div>
    );
};

export default AdminInsights;
