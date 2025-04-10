import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductPageHeroProducts from '@/components/ProductPageHeroProducts';

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
  boostAmount: number;
}

export default async function KakoBuySpreadsheetPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = parseInt(
    Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page || '1',
    10
  );
  const search = Array.isArray(searchParams.search)
    ? searchParams.search[0]
    : searchParams.search || '';
  const category = Array.isArray(searchParams.category)
    ? searchParams.category[0]
    : searchParams.category || 'All';
  const limit = 100;

  const queryParams = new URLSearchParams({
    search,
    category,
    page: String(page),
    limit: String(limit),
  });

  let allProducts: Product[] = [];
  let totalProducts = 0;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products?${queryParams}`,
      { cache: 'no-store' }
    );

    // 404 = keine Produkte gefunden → kein Fehler!
    if (res.status === 404) {
      allProducts = [];
      totalProducts = 0;
    } else if (!res.ok) {
      throw new Error(`Failed to fetch products, status = ${res.status}`);
    } else {
      const data = await res.json();
      allProducts = data.products || [];
      totalProducts = data.totalProducts || 0;
    }
  } catch (error) {
    console.error('Error loading products:', error);
    return (
      <div className="text-center mt-10 text-red-600">
        Failed to load products. Please try again later.
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(totalProducts / limit));

  function getPageUrl(pageNumber: number) {
    const qp = new URLSearchParams({
      page: String(pageNumber),
      ...(category !== 'All' ? { category } : {}),
      ...(search ? { search } : {}),
    });
    return `/kakobuy-spreadsheet?${qp.toString()}`;
  }

  function displayedPages() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
  }

  return (
    <>
      <ProductPageHeroProducts />

      <div className="h-full px-4 md:px-0 my-4">
        <div className="mx-auto max-w-2xl lg:max-w-7xl animate-page-fade-in">
          {/* Product Count */}
          {allProducts.length > 0 && (
            <div className="text-center mb-6">
              <p className="text-lg font-medium text-gray-900">
                Total Products: {totalProducts}
              </p>
            </div>
          )}

          {/* No Products */}
          {allProducts.length === 0 && (
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">No products existing</p>
              <p className="text-sm text-gray-500 mt-2">
                Searching for a product but it's not here?{' '}
                <Link href="/features/request-product" className="text-primary-500 hover:underline">
                  Request a Product
                </Link>
              </p>
            </div>
          )}

          {/* Product Grid */}
          {allProducts.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {allProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalProducts > limit && (
            <div className="mt-6 flex justify-center md:justify-end space-x-1 md:space-x-2">
              {page > 1 && (
                <Link
                  href={getPageUrl(page - 1)}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-full"
                >
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
                <Link
                  href={getPageUrl(page + 1)}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-full"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
