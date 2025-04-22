'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
  'All',
  'Verified Finds',
  'Shoes',
  'Hoodies',
  'Sweaters',
  'T-Shirts',
  'Tracksuits',
  'Accessories',
];

export default function ProductPageSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const currentSearch = searchParams.get('search');
    const currentCategory = searchParams.get('category');
    if (currentSearch) setSearchQuery(currentSearch);
    if (currentCategory) setSelectedCategory(currentCategory);
  }, [searchParams]);

  const updateCategory = (category: string) => {
    setSelectedCategory(category);
    setShowDropdown(false);

    const params = new URLSearchParams(searchParams.toString());
    params.set('category', category);
    params.set('page', '1'); // Reset pagination

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }

    params.set('page', '1'); // Reset pagination

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-4">
      <div className="flex relative">
        {/* Category Dropdown Button */}
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200"
        >
          {selectedCategory}
          <svg className="w-2.5 h-2.5 ml-2.5" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        {/* Dropdown List */}
        {showDropdown && (
          <div className="z-20 absolute top-12 left-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
            <ul className="py-2 text-sm text-gray-700">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => updateCategory(category)}
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="search"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-e-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={isPending}
            className="absolute top-0 right-0 p-2.5 h-full text-sm font-medium text-white bg-primary-700 rounded-e-lg hover:bg-primary-800"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M19 19l-4-4m0-7a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
