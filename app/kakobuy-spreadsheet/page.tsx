import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductPageHeroProducts from '@/components/ProductPageHeroProducts';

// (Optional) Force dynamic rendering so it always does SSR.
export const dynamic = 'force-dynamic';

// Define the Product interface if you like strongly typed data
interface Product {
  _id: string;
  name: string;
  description: string;
  price: string | number;
  creatorName: string;
  mainImage: string;
  images: any[];
  viewCount: number;
  boostAmount: number;
}

interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
}

export default async function KakoBuySpreadsheetPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageParam = searchParams.page;
  const searchParam = searchParams.search;
  const categoryParam = searchParams.category;

  const page = parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam || '1', 10);
  const search = Array.isArray(searchParam) ? searchParam[0] : searchParam || '';
  const category = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam || 'All';

  const limit = 100;

  // Build query string
  const queryParams = new URLSearchParams({
    search,
    category,
    page: String(page),
    limit: String(limit),
  });

  // IMPORTANT: For SSR in the App Router, use an absolute URL here
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products?${queryParams}`, {
    cache: 'no-store', // ensures fresh data on every request
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products, status = ${res.status}`);
  }

  const data = await res.json();
  const allProducts: Product[] = data.products || [];
  const totalProducts = data.totalProducts || 0;
  const totalPages = Math.ceil(totalProducts / limit);

  // Pagination helper
  function displayedPages() {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const start = Math.max(1, page - 2);
      const end = Math.min(totalPages, page + 2);
      return Array.from({ length: end - start + 1 }, (_, i) => i + start);
    }
  }

  // Build page URL (for the pagination links)
  function getPageUrl(pageNumber: number) {
    const baseUrl = '/kakobuy-spreadsheet';
    const qp = new URLSearchParams({
      page: String(pageNumber),
      category,
      // Include search if present
      ...(search ? { search } : {})
    });
    return `${baseUrl}?${qp.toString()}`;
  }

  return (
    <>
      {/* Hero / banner */}
      <ProductPageHeroProducts />

      <div className="h-full px-4 md:px-0 my-4">
        <div className="mx-auto max-w-2xl lg:max-w-7xl animate-page-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="hidden md:block md:w-1/4"></div>

            {/* Total product count */}
            {allProducts.length > 0 && (
              <div className="w-full md:w-1/2 text-center">
                <p className="text-lg font-medium text-gray-900">
                  Total Products: {totalProducts}
                </p>
              </div>
            )}
          </div>

          {/* No Products Found */}
          {allProducts.length === 0 && (
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">No products found</p>
              <p className="text-sm text-gray-500 mt-2">
                Searching for a product but it's not here?{' '}
                <Link href="/features/request-product" className="text-primary-500 hover:underline">
                  Request a Product
                </Link>
              </p>
            </div>
          )}

          {/* Product Grid with Animation Classes */}
          {allProducts.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {allProducts.map((product) => (
                <ProductCard key={product._id} product={product}/>
              ))}
            </div>
          )}

          {/* Pagination Controls with Animation Classes */}
          <div className="mt-6 flex justify-center md:justify-end space-x-1 md:space-x-2">
            {/* Previous */}
            {page > 1 && (
              <Link
                href={getPageUrl(page - 1)}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-full transform transition-transform hover:-translate-y-1 duration-300 md:px-4 md:py-2 md:text-base"
                prefetch={true}
              >
                Previous
              </Link>
            )}

            {/* Page Numbers */}
            <div className="flex space-x-1 md:space-x-2">
              {displayedPages().map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={getPageUrl(pageNumber)}
                  className={`px-2 py-1 text-sm rounded-full transform transition-all duration-300 md:px-4 md:py-2 md:text-base ${
                    page === pageNumber
                      ? 'bg-primary-500 text-white scale-110'
                      : 'bg-gray-200 hover:bg-gray-300 hover:scale-105'
                  }`}
                  prefetch={true}
                >
                  {pageNumber}
                </Link>
              ))}
            </div>

            {/* Next */}
            {page < totalPages && (
              <Link
                href={getPageUrl(page + 1)}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-full transform transition-transform hover:-translate-y-1 duration-300 md:px-4 md:py-2 md:text-base"
                prefetch={true}
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}