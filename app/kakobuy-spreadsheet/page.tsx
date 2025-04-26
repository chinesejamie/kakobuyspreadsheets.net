import Link from 'next/link';
import Script from 'next/script';
import ProductCard from '@/components/ProductCard';
import ProductPageHeroProducts from '@/components/ProductPageHeroProducts';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'KakoBuy Spreadsheet — 7500+ Verified Deals, QC Photos & Finds';
  const description = 'Access the #1 KakoBuy Spreadsheet with over 7500 verified products, real QC photos, and exclusive deals. Updated daily for smart Chinese shopping!';
  const imageUrl = 'https://kakobuyspreadsheets.net/images/seo-cover.webp';

  return {
    title,
    description,
    metadataBase: new URL('https://kakobuyspreadsheets.net'),
    keywords: [
      'kakobuy spreadsheet',
      'kakobuy finds',
      'qc photos',
      'kakobuy verified products',
      'chinese shopping spreadsheet',
      'boosted kakobuy deals',
      'cheap kakobuy shopping',
    ],
    openGraph: {
      title,
      description,
      url: 'https://kakobuyspreadsheets.net/kakobuy-spreadsheet',
      siteName: 'KakoBuy Spreadsheet',
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'KakoBuy Spreadsheet Cover',
      }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: 'https://kakobuyspreadsheets.net/kakobuy-spreadsheet',
    },
  };
}

export const dynamic = 'force-dynamic';

interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  price: number | string;
  creatorName: string;
  mainImage: string | { url: string };
  images: any[];
  viewCount: number;
  boostAmount?: number;
  purchased?: number;
  findsOfTheWeekUntil?: Date;
  category?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number | string;
  creatorName: string;
  mainImage: string;
  images: any[];
  viewCount: number;
  boostAmount: number;
  purchased: number;
  findsOfTheWeekUntil: Date | null;
  category?: string;
}

export default async function KakoBuySpreadsheetPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;

  const pParam = Array.isArray(params.page) ? params.page[0] : params.page;
  const page = parseInt(pParam ?? '1', 10);
  const search = Array.isArray(params.search) ? params.search[0] : params.search ?? '';
  const category = Array.isArray(params.category) ? params.category[0] : params.category ?? 'All';
  const limit = 100;

  const qp = new URLSearchParams({ search, category, page: String(page), limit: String(limit) });

  let allProducts: Product[] = [];
  let totalProducts = 0;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/products?${qp.toString()}`,
      { cache: 'no-store' }
    );

    if (res.status === 404) {
      allProducts = [];
      totalProducts = 0;
    } else if (!res.ok) {
      throw new Error(`Failed to fetch products (status ${res.status})`);
    } else {
      const data = await res.json();
      totalProducts = data.totalProducts || 0;

      const apiProducts: ApiProduct[] = data.products || [];
      allProducts = apiProducts.map((p) => {
        let mainImage: string;
        if (typeof p.mainImage === 'string') {
          mainImage = p.mainImage;
        } else if (p.mainImage && typeof (p.mainImage as any).url === 'string') {
          mainImage = (p.mainImage as any).url;
        } else {
          mainImage = '/images/default-product.jpg';
        }

        return {
          _id: p._id,
          name: p.name,
          description: p.description,
          price: p.price,
          creatorName: p.creatorName,
          mainImage,
          images: p.images,
          viewCount: p.viewCount,
          boostAmount: p.boostAmount ?? 0,
          purchased: p.purchased ?? 0,
          findsOfTheWeekUntil: p.findsOfTheWeekUntil ?? null,
          category: p.category,
        };
      });

      if (category === 'Shoes') {
        const manyouyisiProducts = allProducts.filter(p => p.creatorName.toLowerCase().includes('manyouyisi'));
        const otherProducts = allProducts.filter(p => !p.creatorName.toLowerCase().includes('manyouyisi'));
        manyouyisiProducts.sort((a, b) => b.purchased - a.purchased || b.viewCount - a.viewCount);
        otherProducts.sort((a, b) => b.boostAmount - a.boostAmount || b.purchased - a.purchased);
        allProducts = [...manyouyisiProducts, ...otherProducts];
      }
    }
  } catch (err) {
    console.error('Error loading products:', err);
    return (
      <div className="text-center mt-10 text-red-600">
        Failed to load products. Please try again later.
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(totalProducts / limit));
  const getPageUrl = (num: number) => {
    const params = new URLSearchParams({ page: String(num), ...(category !== 'All' ? { category } : {}), ...(search ? { search } : {}), });
    return `/kakobuy-spreadsheet?${params.toString()}`;
  };
  const displayedPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <>
      <ProductPageHeroProducts />

      <section className="max-w-screen-xl mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">KakoBuy Spreadsheet — Verified Finds & Exclusive Deals</h1>
        <p className="text-gray-700 text-lg mb-8">
          Explore thousands of carefully curated products with verified quality control (QC) photos and unbeatable deals, updated daily to bring you the best shopping experience with KakoBuy.
        </p>

        {allProducts.length === 0 ? (
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">No products available at the moment.</p>
            <p className="text-sm text-gray-500 mt-2">
              Looking for something specific?{' '}
              <Link href="/features/request-product" className="text-primary-500 hover:underline">
                Request a Product
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {totalProducts > limit && (
          <nav className="mt-8 flex justify-center md:justify-end gap-2" aria-label="Pagination">
            {page > 1 && (
              <Link href={getPageUrl(page - 1)} rel="prev" className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-full">
                Previous
              </Link>
            )}
            {displayedPages().map((p) => (
              <Link key={p} href={getPageUrl(p)} className={`px-3 py-1 text-sm rounded-full ${p === page ? 'bg-primary-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link href={getPageUrl(page + 1)} rel="next" className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-full">
                Next
              </Link>
            )}
          </nav>
        )}

        {/* SEO-Optimized FAQ Section */}
        <section className="py-12 bg-gray-50 px-4 mt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">KakoBuy Spreadsheet — Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer hover:bg-gray-100 font-semibold">
                  What is the KakoBuy Spreadsheet?
                </summary>
                <div className="px-6 py-4 text-gray-600">
                  The KakoBuy Spreadsheet is a curated list of over 7,500 verified products available through KakoBuy, featuring quality control (QC) photos, updated pricing, and exclusive deals to make your shopping experience seamless.
                </div>
              </details>
              <details className="border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer hover:bg-gray-100 font-semibold">
                  How often is the KakoBuy Spreadsheet updated?
                </summary>
                <div className="px-6 py-4 text-gray-600">
                  Our KakoBuy Spreadsheet is updated daily to ensure you have access to the newest finds, price changes, and the latest restocks across all categories.
                </div>
              </details>
              <details className="border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer hover:bg-gray-100 font-semibold">
                  Are QC photos available for all products?
                </summary>
                <div className="px-6 py-4 text-gray-600">
                  Yes! Every product listed on the KakoBuy Spreadsheet comes with detailed quality control (QC) photos so you can shop with confidence.
                </div>
              </details>
              <details className="border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer hover:bg-gray-100 font-semibold">
                  Is using the KakoBuy Spreadsheet free?
                </summary>
                <div className="px-6 py-4 text-gray-600">
                  Absolutely! Accessing the KakoBuy Spreadsheet is completely free. Browse and shop smarter without paying any additional fees.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Inject FAQPage Structured Data */}
        <Script id="faq-structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the KakoBuy Spreadsheet?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The KakoBuy Spreadsheet is a curated list of over 7,500 verified products available through KakoBuy, featuring quality control (QC) photos, updated pricing, and exclusive deals."
                }
              },
              {
                "@type": "Question",
                "name": "How often is the KakoBuy Spreadsheet updated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our KakoBuy Spreadsheet is updated daily to ensure access to the newest finds, price changes, and restocks."
                }
              },
              {
                "@type": "Question",
                "name": "Are QC photos available for all products?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, every product listed comes with detailed QC photos for confident shopping."
                }
              },
              {
                "@type": "Question",
                "name": "Is using the KakoBuy Spreadsheet free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, accessing the KakoBuy Spreadsheet is completely free with no additional costs."
                }
              }
            ]
          })}
        </Script>
      </section>
    </>
  );
}
