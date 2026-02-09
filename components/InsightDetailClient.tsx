'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function InsightDetailClient({ id, insightData }: { id: string, insightData: any }) {
    const router = useRouter();
    const { insights, language, t } = useAppContext();
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Prefer context (latest) data if available, else fallback to server data
    const contextInsight = insights.find(i => i.id === id);
    const insight = contextInsight || insightData;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!insight) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-navy-deep">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">News not found</h2>
                    <Link href="/" className="text-primary hover:underline">Return to home</Link>
                </div>
            </div>
        );
    }

    const isDynamic = !!(insight as any).localized;
    const displayData = isDynamic
        ? (insight as any).localized[language]
        : {
            title: t(`insights.items.${insight.id}.title`),
            desc: t(`insights.items.${insight.id}.desc`),
            cat: t(`insights.items.${insight.id}.category`),
            content: insight.content || (insight as any).description
        };

    const relatedInsights = insights.filter(i => i.id !== id).slice(0, 2);

    return (
        <div className="bg-white dark:bg-navy-deep min-h-screen transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105 blur-sm opacity-30 dark:opacity-20"
                    style={{ backgroundImage: `url("${insight.imageUrl}")` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-navy-deep/50 dark:to-navy-deep"></div>

                <div className="relative h-full max-w-5xl mx-auto px-6 flex flex-col justify-end pb-20">
                    <button
                        onClick={() => router.back()}
                        className="w-fit mb-12 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors group"
                    >
                        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        {t('insight_detail.back')}
                    </button>

                    <div className="space-y-6">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-[0.2em] inline-block">
                            {displayData.cat || insight.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                            {displayData.title || insight.title}
                        </h1>
                        <div className="flex items-center gap-6 text-slate-400 text-xs font-medium uppercase tracking-widest">
                            <span>{t('insight_detail.reading_time')}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>2026 Digital Edition</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <article className="max-w-3xl mx-auto px-6 py-20">
                <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl border border-black/5 dark:border-white/5">
                    <img src={insight.imageUrl} alt={displayData.title} className="w-full h-full object-cover" />
                </div>

                <div className="prose prose-lg dark:prose-invert prose-slate max-w-none">
                    <p className="text-2xl font-light text-slate-600 dark:text-slate-300 leading-relaxed italic mb-12 border-l-4 border-primary pl-8">
                        {displayData.desc || insight.description}
                    </p>

                    <div className="text-slate-700 dark:text-slate-400 space-y-8 text-lg leading-[1.8] font-light">
                        {displayData.content ? (
                            <div dangerouslySetInnerHTML={{ __html: displayData.content }} />
                        ) : (
                            <>
                                <p>The digital landscape of 2026 demands a radical shift in how we perceive brand-consumer interaction. As traditional attribution models fade into obsolescence, the rise of autonomous bidding and privacy-first engineering becomes the cornerstone of any successful digital strategy.</p>
                                <p>Our research indicates that luxury brands, in particular, must navigate this new era with extreme precision. It is no longer enough to simply be present; one must architect an ecosystem that facilitates trust through seamless UX and psychological resonance.</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white pt-8">The Core Architecture of Growth</h3>
                                <p>Strategic success in the upcoming fiscal cycle will be defined by three key metrics: brand authority, predictive acquisition, and sustainable loyalty. By leveraging advanced Meta algorithms and TikTok viral mechanics, we can engineer a self-sustaining growth machine that defies market volatility.</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Share Section */}
                <div className="mt-20 pt-10 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('insight_detail.share')}</p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleShare}
                            className={`px-8 py-3 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${copied
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'border-black/10 dark:border-white/10 hover:border-primary hover:text-primary dark:text-white'
                                }`}
                        >
                            {copied ? t('insight_detail.copied') : t('insight_detail.share_button')}
                        </button>
                    </div>
                </div>
            </article>

            {/* Related Insights */}
            <section className="bg-slate-50 dark:bg-navy-surface/30 py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-12 uppercase tracking-widest text-center">
                        {t('insight_detail.related')}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        {relatedInsights.map(item => {
                            const relData = !!(item as any).localized
                                ? (item as any).localized[language]
                                : { title: t(`insights.items.${item.id}.title`), cat: t(`insights.items.${item.id}.category`) };

                            return (
                                <Link href={`/news/${item.id}`} key={item.id} className="group">
                                    <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-6 border border-black/5 dark:border-white/5">
                                        <img src={item.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                                    </div>
                                    <p className="text-[10px] font-bold text-primary mb-2 uppercase tracking-widest">{relData.cat || item.category}</p>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{relData.title || item.title}</h3>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
