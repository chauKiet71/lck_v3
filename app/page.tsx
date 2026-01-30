
import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Philosophy from '../components/Philosophy';
import Testimonials from '../components/Testimonials';
import Insights from '../components/Insights';
import Contact from '../components/Contact';

export const metadata = {
  title: 'Lê Châu Kiệt - Luxury Digital Strategist & Growth Engineer',
  description: 'Tư vấn chiến lược Facebook Ads, TikTok Shop và Kiến trúc Web 2026 cho thương hiệu cao cấp.',
};

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Services />
      <Philosophy />
      <Testimonials />
      <Insights />
      <Contact />
    </div>
  );
}
