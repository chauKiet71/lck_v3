
import React from 'react';
import { Providers } from '../components/Providers';
import { ErrorBoundary } from '../components/ErrorBoundary';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import './globals.css';

export const metadata = {
  title: {
    default: 'Lê Châu Kiệt | Luxury Digital Strategist',
    template: '%s | Lê Châu Kiệt'
  },
  description: 'Chiến lược kỹ thuật số cao cấp, tối ưu tăng trưởng bền vững cho thương hiệu.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://lechaukiet.com/',
    siteName: 'Lê Châu Kiệt Strategy',
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
