import Image from 'next/image';
import Link from 'next/link';
import { InfoIcon } from 'lucide-react';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: string | number;
    mainImage: string;
    creatorName: string;
    store?: string;
    findsOfTheWeekUntil?: Date | null;
    viewCount?: number;
    purchased?: number;
    boostAmount?: number;
  };
  currency?: string;
  highlight?: boolean;
}

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

export default function ProductCard({ product, highlight = false }: ProductCardProps) {
  const symbol = currencySymbols["USD"] || '';
  const formatPrice = `${symbol}${product.price}`;

  const isFindsOfTheWeek =
    product.findsOfTheWeekUntil != null &&
    new Date(product.findsOfTheWeekUntil) > new Date();

  const isBoosted = (product.boostAmount ?? 0) > 0;

  const safeImageSrc =
    typeof product.mainImage === 'string' && product.mainImage.trim() !== ''
      ? product.mainImage
      : '/images/default-product.webp';

  const truncateTitle = (title: string) =>
    title.length > 30 ? `${title.substring(0, 27)}…` : title;

  const productUrl = `/kakobuy-spreadsheet/products/${encodeURIComponent(product.creatorName)}/${encodeURIComponent(product.name)}`;

  return (
<Link href={productUrl} className="group relative">
  <div className={`
    bg-white ${highlight ? 'bg-amber-50' : ''}
    rounded-lg overflow-hidden shadow-sm hover:shadow-lg
    flex flex-col h-[360px] transition-transform duration-300 ease-in-out
    hover:scale-[1.02] hover:z-10
  `}>
    <div className="relative w-full h-[220px] bg-gray-200">
      <Image
        src={safeImageSrc}
        alt={product.name}
        fill
        className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
      />
    </div>

    {isFindsOfTheWeek && (
      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold">
        Find of the Week
      </div>
    )}

    {product.purchased! > 10 && (
      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
        Popular
      </div>
    )}

    <div className="flex flex-col justify-between p-2 flex-grow">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 leading-tight h-8 overflow-hidden group-hover:text-primary-600 transition-colors duration-300">
          {truncateTitle(product.name)}
        </h3>
        <p className="mt-1 text-xs text-gray-500 leading-tight truncate">
          {product.creatorName}
          {product.viewCount != null && ` • ${product.viewCount} views`}
        </p>

        {isBoosted && (
          <div className="mt-1 text-[10px] text-gray-400 opacity-40 flex items-center gap-1 group/tooltip">
            <span>Boosted</span>
            <span className="relative">
              <InfoIcon size={10} />
              <span className="absolute left-full ml-2 bottom-0 w-40 p-2 bg-gray-800 text-white text-[10px] rounded opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-opacity duration-300 z-20">
                Boosted product
              </span>
            </span>
          </div>
        )}
      </div>

      <div className="text-primary-700 font-bold text-sm mt-2">
        {formatPrice}
      </div>
    </div>
  </div>
</Link>

  );
}

