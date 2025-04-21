'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string | number;
  creatorName: string;
  mainImage: string;
  images: any[];
  viewCount: number;
  store: string;
  category: string;
  link: string;
  purchased: number;
  findsOfTheWeekUntil: Date;
  daysRemaining: number;
}

function FindsOfTheWeekHero() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Finds of the Week
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl">
            Discover our hand-picked selections refreshed weekly for you
          </p>
        </div>
      </div>
    </div>
  );
}

function CountdownTimer({ nextRefreshDate }: { nextRefreshDate: string | null }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const refreshDate = nextRefreshDate ? new Date(nextRefreshDate) : null;
      let targetDate: Date;

      if (refreshDate && refreshDate > now) {
        targetDate = refreshDate;
      } else {
        targetDate = new Date();
        targetDate.setDate(now.getDate() + (7 - now.getDay()) % 7);
        if (targetDate.getDay() === now.getDay() && targetDate.getTime() <= now.getTime()) {
          targetDate.setDate(targetDate.getDate() + 7);
        }
        targetDate.setHours(0, 0, 0, 0);
      }

      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [nextRefreshDate]);

  return (
    <div className="bg-gray-50 py-8 rounded-lg shadow-sm">
      <h2 className="text-center text-2xl font-bold mb-4">New Finds Coming In:</h2>
      <div className="flex justify-center space-x-4">
        {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
          <div key={unit} className="text-center">
            <div className="text-3xl font-bold bg-white py-3 px-4 rounded-lg shadow">
              {timeLeft[unit as keyof typeof timeLeft]}
            </div>
            <div className="mt-2 text-sm text-gray-600">{unit.charAt(0).toUpperCase() + unit.slice(1)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategorySelector({
  selectedCategory,
  setSelectedCategory,
  categories,
}: {
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  categories: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center my-6">
      <button
        onClick={() => setSelectedCategory('All')}
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          selectedCategory === 'All' ? 'bg-primary-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }`}
      >
        All Finds
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === category
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

function FindsContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const search = searchParams.get('search') ?? '';

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['Loading categories...']);
  const [nextRefreshDate, setNextRefreshDate] = useState<string | null>(null);

  const [weeklyFinds, setWeeklyFinds] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 8;

  useEffect(() => {
    async function fetchWeeklyFinds() {
      setLoading(true);
      setError(null);

      const qp = new URLSearchParams({
        search,
        category: selectedCategory !== 'All' ? selectedCategory : '',
        page: String(page),
        limit: String(limit),
      });

      try {
        const res = await fetch(
          `/api/finds-of-the-week?${qp.toString()}`,
          { cache: 'no-store' }
        );
        

        if (res.status === 404) {
          setWeeklyFinds([]);
          setTotalProducts(0);
        } else if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        } else {
          const data = await res.json();
          setTotalProducts(data.totalProducts || 0);
          setNextRefreshDate(data.nextRefreshDate || null);

          const safeProducts = (data.products || []).map((p: any) => {
            const mainImage = p.images?.[0]
              ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url)
              : '/images/default-product.jpg';
            return { ...p, mainImage };
          });
          setWeeklyFinds(safeProducts);

          const cats = safeProducts.map((p) => p.category).filter(Boolean);
          setCategories(cats ? Array.from(new Set(cats)) : []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchWeeklyFinds();
  }, [page, search, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(totalProducts / limit));
  const getPageUrl = (p: number) => {
    const qp = new URLSearchParams({
      page: String(p),
      ...(selectedCategory !== 'All' ? { category: selectedCategory } : {}),
      ...(search ? { search } : {}),
    });
    return `/finds-of-the-week?${qp}`;
  };
  const displayedPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-page-fade-in">
      <div className="mb-10">
        <CountdownTimer nextRefreshDate={nextRefreshDate} />
      </div>

      {categories.length > 0 && !categories.includes('Loading categories...') && (
        <CategorySelector
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
      )}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">This Week's Handpicked Selection</h2>
        <p className="mt-2 text-gray-500">
          Curated by our experts to bring you the best products each week
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600">Loading this week's finds...</p>
        </div>
      )}

      {error && (
        <div className="text-center mt-10 text-red-600">
          Failed to load products. Please try again later.
        </div>
      )}

      {!loading && weeklyFinds.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-gray-900">No featured products this week</p>
          <p className="text-sm text-gray-500 mt-2">
            Check back soon or{' '}
            <Link href="/features/request-product" className="text-primary-500 hover:underline">
              Request a Product
            </Link>
          </p>
        </div>
      )}

      {!loading && weeklyFinds.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {weeklyFinds.map((product) => (
            <div key={product._id} className="relative">
              {product.daysRemaining <= 3 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-bl-lg z-10">
                  {product.daysRemaining <= 1 ? 'Last Day!' : `${product.daysRemaining} Days Left!`}
                </div>
              )}
              <ProductCard product={product} highlight />
            </div>
          ))}
        </div>
      )}

      {totalProducts > limit && (
        <div className="mt-10 flex justify-center space-x-1 md:space-x-2">
          {page > 1 && (
            <Link href={getPageUrl(page - 1)} className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-full">
              Previous
            </Link>
          )}
          {displayedPages().map((p) => (
            <Link
              key={p}
              href={getPageUrl(p)}
              className={`px-3 py-1 text-sm rounded-full ${
                p === page ? 'bg-primary-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {p}
            </Link>
          ))}
          {page < totalPages && (
            <Link href={getPageUrl(page + 1)} className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-full">
              Next
            </Link>
          )}
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          href="/kakobuy-spreadsheet"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      <p className="mt-2 text-gray-600">Loading finds of the week...</p>
    </div>
  );
}

export default function FindsOfTheWeekPage() {
  return (
    <>
      <FindsOfTheWeekHero />
      <Suspense fallback={<LoadingFallback />}>
        <FindsContent />
      </Suspense>
    </>
  );
}
