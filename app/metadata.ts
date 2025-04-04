// File: /app/metadata.ts
import { Metadata } from 'next';

// Function to generate metadata for the main pages
export function generateMainMetadata(): Metadata {
  const canonicalUrl = `https://kakobuy-spreadsheet.com`;
  
  return {
    metadataBase: new URL('https://kakobuy-spreadsheet.com'),
    title: 'The #1 Ultimate KakoBuy Spreadsheet 2024 - Weekly Updates & Exclusive Finds',
    description: 'Access our premium KakoBuy spreadsheet with 7,500+ curated finds, exclusive coupons, and weekly updates. The most comprehensive KakoBuy spreadsheet for quality shopping in 2024.',
    keywords: 'KakoBuy, KakoBuy Spreadsheet, Best KakoBuy Spreadsheet, KakoBuy Spreadsheet 2024, best KakoBuy spreadsheet, KakoBuy spreadsheet clothes, KakoBuy spreadsheet, find KakoBuy spreadsheet, spreadsheet KakoBuy, KakoBuy finds, KakoBuy weekly finds, KakoBuy guide, KakoBuy coupons, KakoBuy discount',
    authors: [{ name: 'KakoBuySpreadsheet Team' }],
    openGraph: {
      title: 'The #1 Ultimate KakoBuy Spreadsheet | Weekly Updates & 7,500+ Verified Products',
      description: 'Access the most comprehensive KakoBuy spreadsheet with 7,500+ curated finds, exclusive coupons, and real-time updates. Updated hourly with verified products and QC photos.',
      url: canonicalUrl,
      siteName: 'KakoBuySpreadSheet',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://kakobuy-spreadsheet.com/assets/staticimages/KakoBuyLogoCorner.png',
          width: 1200,
          height: 630,
          alt: 'KakoBuy Spreadsheet',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: "The World's #1 KakoBuy Spreadsheet | 7,500+ Verified Products & Weekly Updates",
      description: 'Discover the ultimate KakoBuy spreadsheet with 7,500+ curated finds, exclusive coupons, and hourly updates. The most trusted KakoBuy resource since 2024.',
      images: ['https://kakobuy-spreadsheet.com/assets/staticimages/KakoBuyLogoCorner.png'],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}