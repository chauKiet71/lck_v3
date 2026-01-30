
export type Language = 'en' | 'vi';
export type Theme = 'light' | 'dark';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Insight {
  id: string;
  category: string;
  title: string;
  description: string;
  content?: string; // Nội dung chi tiết bài viết
  imageUrl: string;
  localized?: {
    en: { title: string; desc: string; cat: string; content?: string };
    vi: { title: string; desc: string; cat: string; content?: string };
  };
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
  rating: number;
}

export interface StrategyReport {
  executiveSummary: string;
  marketGap: string;
  recommendedEcosystem: string;
  projectedRoI: string;
}
