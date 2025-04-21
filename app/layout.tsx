import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { generateMainMetadata } from './metadata';
import Header from '@/components/Header';
import TopBanner from '@/components/TopBanner';
import PromoPopup from '@/components/PromoPopup';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = generateMainMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PromoPopup />
        <TopBanner />
        <Header />
        {children}
      </body>
    </html>
  );
}