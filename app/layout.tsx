
import React from 'react';
import { Providers } from '../components/Providers';
import { ErrorBoundary } from '../components/ErrorBoundary';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import './globals.css';

export const metadata = {
  title: {
    default: 'Lê Châu Kiệt – Chia Sẻ Kiến Thức Công Nghệ, Digital Marketing & MMO',
    template: '%s | Lê Châu Kiệt'
  },
  description: 'Chia sẻ kiến thức Công nghệ, Digital Marketing và MMO thực chiến từ Lê Châu Kiệt. Học dễ hiểu, áp dụng được, phù hợp người mới bắt đầu',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://sf-static.upanhlaylink.com/img/image_20260206483744eab36d28171909f3a8dc562f15.jpg',
    siteName: 'Lê Châu Kiệt Strategy',
  },
  icons: {
    icon: 'https://sf-static.upanhlaylink.com/img/image_2026020594684ce0352ead3ab5bbb9ccde9b70b4.jpg',
    apple: 'https://sf-static.upanhlaylink.com/img/image_2026020594684ce0352ead3ab5bbb9ccde9b70b4.jpg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-primary/30 transition-colors duration-300">
        <ErrorBoundary>
          <Providers>
            <div className="min-h-screen bg-white dark:bg-navy-deep transition-colors duration-500">
              <Navbar />
              <main className="relative min-h-[calc(100vh-200px)]">
                {children}
              </main>
              <Footer />
              <ScrollToTop />
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
