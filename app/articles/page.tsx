// app/kakobuy-spreadsheet/articles/page.tsx

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KakoBuy Spreadsheet Articles & Guides – Coupons, Tutorials, Reviews 2024',
  description:
    'Discover expert-written KakoBuy articles including coupon guides, product spreadsheet tips, KakoBuy seller reviews and more. Updated regularly in 2024.',
  keywords: [
    'kakobuy spreadsheet',
    'kakobuy coupons',
    'kakobuy tips',
    'how to use kakobuy',
    'kakobuy reviews',
    'best agents for kakobuy',
    'kakobuy spreadsheet guide',
    'kakobuy vs wegobuy',
    'is kakobuy legit',
  ],
  openGraph: {
    title: 'KakoBuy Spreadsheet Articles & Guides 2024',
    description:
      'Explore in-depth articles around the KakoBuy Spreadsheet, including coupon hacks, agent comparisons, trust scores, and shopping tips for Chinese marketplaces.',
    url: 'https://yourdomain.com/kakobuy-spreadsheet/articles',
    type: 'article',
  },
  alternates: {
    canonical: '/articles',
  },
};

const articles = [
  {
    slug: 'kakobuy-coupons-2024',
    title: 'KakoBuy Coupons 2024: How to Save Money on Every Order',
    description:
      'Looking for active KakoBuy coupons? This guide explains how to apply agent discounts, combine promotions, and get weekly spreadsheet deals.',
  },
  {
    slug: 'is-kakobuy-legit',
    title: 'Is KakoBuy Legit? A Deep Dive into Safety & Trust in 2024',
    description:
      'We break down the pros, cons, user experiences, and transparency of KakoBuy compared to other shopping agents in 2024.',
  },
  {
    slug: 'kakobuy-vs-wegobuy',
    title: 'KakoBuy vs Wegobuy: Which Agent Wins in 2024?',
    description:
      'This head-to-head comparison looks at pricing, shipping, agent services and overall spreadsheet integration.',
  },
  {
    slug: 'how-to-use-kakobuy-spreadsheet',
    title: 'How to Use the KakoBuy Spreadsheet Like a Pro',
    description:
      'Learn how to navigate, filter, and sort the spreadsheet to find the best deals, rare items, and trending finds.',
  },
  {
    slug: 'kakobuy-agent-review',
    title: 'KakoBuy Agent Review 2024: Service, Communication & QC Ratings',
    description:
      'We evaluate the KakoBuy team, their service quality, and how they compare to other Chinese agent experiences.',
  },
];

export default function ArticlesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-page-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        KakoBuy Spreadsheet Articles & Guides
      </h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Explore tutorials, reviews, coupon breakdowns, and expert insights to make the most of the KakoBuy Spreadsheet and agent services in 2024.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="block border border-gray-200 hover:border-primary-500 rounded-xl p-5 transition shadow-sm hover:shadow-md bg-white"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {article.title}
            </h2>
            <p className="text-sm text-gray-600">{article.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
