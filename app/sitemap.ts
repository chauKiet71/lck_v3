
import { MetadataRoute } from 'next';
import { prisma } from '../lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://lechaukiet.com';

    // Static routes
    const routes = [
        '',
        '/news',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes (Articles)
    const articles = await prisma.insight.findMany({
        select: {
            id: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    const articleRoutes = articles.map((article) => ({
        url: `${baseUrl}/news/${article.id}`,
        lastModified: article.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...routes, ...articleRoutes];
}
