'use client';

import React, { useEffect, useState } from 'react';

type Category = {
    id: string;
    name: string;
    slug: string;
    _count?: {
        insights: number;
    };
};

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [newSlug, setNewSlug] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = () => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setNewName(val);
        if (!newSlug) {
            setNewSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newSlug) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, slug: newSlug })
            });

            if (res.ok) {
                setNewName('');
                setNewSlug('');
                fetchCategories();
            } else {
                alert('Failed to create category');
            }
        } catch (e) {
            alert('Error creating category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, count: number) => {
        if (count > 0) {
            alert(`Cannot delete category with ${count} news articles attached.`);
            return;
        }
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCategories();
            } else {
                alert('Failed to delete');
            }
        } catch (e) {
            alert('Error deleting');
        }
    };

    if (loading) return <div className="p-8 text-slate-500">Loading categories...</div>;

    return (
        <div className="grid md:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="md:col-span-1">
                <div className="bg-white dark:bg-navy-surface rounded-3xl p-8 shadow-sm h-fit sticky top-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Add Category</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Sort Order / Name</label>
                            <input
                                className="w-full bg-slate-50 dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/10 outline-none focus:ring-2 ring-primary/50 dark:text-white"
                                placeholder="e.g. Performance"
                                value={newName}
                                onChange={handleNameChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Slug</label>
                            <input
                                className="w-full bg-slate-50 dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/10 outline-none focus:ring-2 ring-primary/50 dark:text-white font-mono text-sm"
                                placeholder="performance"
                                value={newSlug}
                                onChange={e => setNewSlug(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            disabled={submitting}
                            type="submit"
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-navy-deep py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Adding...' : 'Add Category'}
                        </button>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="md:col-span-2">
                <div className="bg-white dark:bg-navy-surface rounded-3xl p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Categories</h1>
                            <p className="text-slate-500">Manage news content structure.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 hover:border-primary/30 transition-all group">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-slate-400">folder</span>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                                        <p className="text-xs text-slate-400 font-mono">/{cat.slug}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-white dark:bg-black/20 px-3 py-1 rounded-full">
                                        {cat._count?.insights || 0} items
                                    </span>
                                    <button
                                        onClick={() => handleDelete(cat.id, cat._count?.insights || 0)}
                                        className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    >
                                        <span className="material-symbols-outlined text-lg">close</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {categories.length === 0 && (
                            <div className="text-center py-10 text-slate-400 italic">No categories found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
