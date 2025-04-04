import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: string | number;
    mainImage: string;
    creatorName: string;
    store?: string;
    findsOfTheWeekUntil?: Date | null;
    viewCount?: number | 0;
    purchased?: number;
  };
  currency: string;
}

// Currency symbols mapping
const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CNY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  NZD: 'NZ$',
  MXN: 'Mex$',
  BRL: 'R$',
  KRW: '₩',
  PLN: 'zł',
};

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = () => {
    const symbol = currencySymbols["USD"] || '';
    return `${symbol}${product.price}`;
  };

  const isFindsOfTheWeek =
    product.findsOfTheWeekUntil &&
    new Date(product.findsOfTheWeekUntil) > new Date();

  // Fallback image if mainImage is empty
  const safeImageSrc =
  typeof product.mainImage === 'string' && product.mainImage.trim() !== ''
    ? product.mainImage
    : '/images/default-product.jpg';

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <Image
          src={safeImageSrc}
          alt={product.name}
          width={300}
          height={300}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>

      {isFindsOfTheWeek && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold">
          Find of the Week
        </div>
      )}

      {product.purchased && product.purchased > 10 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
          Popular
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700 font-medium">
            <Link href={`/product/${product._id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {product.creatorName}
            {product.viewCount && ` • ${product.viewCount}`} Views
          </p>
        </div>
        <p className="text-sm font-medium text-gray-900">{formatPrice()}</p>
      </div>
    </div>
  );
}
