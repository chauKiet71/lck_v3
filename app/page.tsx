
import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Philosophy from '../components/Philosophy';
import Testimonials from '../components/Testimonials';
import Insights from '../components/Insights';
import Contact from '../components/Contact';

export const metadata = {
  title: 'Lê Châu Kiệt – Chia Sẻ Kiến Thức Công Nghệ, Digital Marketing & MMO',
  description: 'Chia sẻ kiến thức Công nghệ, Digital Marketing và MMO thực chiến từ Lê Châu Kiệt. Học dễ hiểu, áp dụng được, phù hợp người mới bắt đầu',
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
