import type { Metadata, ResolvingMetadata } from 'next';
import { prisma } from '@/lib/prisma';
import InsightDetailClient from '@/components/InsightDetailClient';

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getInsight(id: string) {
  try {
    const insight = await prisma.insight.findUnique({
      where: { id },
    });

    if (insight && insight.localized) {
      try {
        (insight as any).localized = JSON.parse(insight.localized);
      } catch (e) {
        console.error("Error parsing localized JSON:", e);
      }
    }

    return insight;
  } catch (error) {
    console.error("Error getting insight:", error);
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id
  const insight = await getInsight(id)

  if (!insight) {
    return {
      title: "News not found",
    }
  }

  return {
    title: insight.seoTitle || insight.title,
    description: insight.seoDescription || insight.description,
    keywords: insight.seoKeywords ? insight.seoKeywords.split(',') : [],
    openGraph: {
      title: insight.seoTitle || insight.title,
      description: insight.seoDescription || insight.description,
      images: [insight.imageUrl],
      type: 'article',
    }
  }
}

export default async function Page({ params }: Props) {
  const insight = await getInsight(params.id);

  return <InsightDetailClient id={params.id} insightData={insight} />
}
