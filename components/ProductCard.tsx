import Image from 'next/image';
import Link from 'next/link';
import { InfoIcon, Tag, Eye, ShoppingCart } from 'lucide-react';

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

export default function ProductCard({ product, currency = "USD", highlight = false }: ProductCardProps) {
  const symbol = currencySymbols[currency] || '$';
  const formatPrice = `${symbol}${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}`;

  const isFindsOfTheWeek =
    product.findsOfTheWeekUntil != null &&
    new Date(product.findsOfTheWeekUntil) > new Date();

  const isBoosted = (product.boostAmount ?? 0) > 0;
  const isPopular = (product.purchased ?? 0) > 10;

  const safeImageSrc =
    typeof product.mainImage === 'string' && product.mainImage.trim() !== ''
      ? product.mainImage
      : '/images/default-product.webp';

  const truncateTitle = (title: string, length: number) =>
    title.length > length ? `${title.substring(0, length - 3)}...` : title;

  const productUrl = `/kakobuy-spreadsheet/products/${encodeURIComponent(product.creatorName)}/${encodeURIComponent(product.name)}`;

  return (
    <Link href={productUrl} className="group block h-full">
      <div 
        className={`
          rounded-lg overflow-hidden shadow hover:shadow-md
          flex flex-col h-full transition-all duration-300
          ${highlight ? 'bg-amber-50/30 ring-1 ring-amber-200' : 'bg-white'}
          hover:translate-y-[-4px]
        `}
      >
        {/* Image container with taller aspect ratio */}
        <div className="relative pt-[100%] w-full bg-gray-100 overflow-hidden">
          <Image
            src={safeImageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges container - only popular and FOTW */}
          <div className="absolute top-0 left-0 w-full p-2 flex justify-between">
            {/* Left badges */}
            <div>
              {isPopular && (
                <span className="inline-flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                  <ShoppingCart size={12} />
                  <span>Popular</span>
                </span>
              )}
            </div>
            
            {/* Right badges */}
            <div>
              {isFindsOfTheWeek && (
                <span className="inline-flex items-center gap-1 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                  <Tag size={12} />
                  <span>Find of the Week</span>
                </span>
              )}
            </div>
          </div>
          
          {/* Price tag */}
          <div className="absolute bottom-0 right-0 m-2">
            <span className="bg-white text-primary-700 font-bold px-3 py-1 rounded-full shadow-sm text-sm">
              {formatPrice}
            </span>
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex flex-col p-3 flex-grow">
          <h3 className="font-medium text-gray-900 leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span className="truncate">{truncateTitle(product.creatorName, 20)}</span>
            
            {product.viewCount != null && (
              <span className="flex items-center gap-1 text-gray-400">
                <Eye size={14} />
                <span>{product.viewCount > 1000 ? `${(product.viewCount/1000).toFixed(1)}k` : product.viewCount}</span>
              </span>
            )}
          </div>
          
          {/* Boosted indicator in description area */}
          {isBoosted && (
            <div className="mt-2 text-xs text-gray-400 flex items-center gap-1 group/tooltip">
              <span>Boosted</span>
              <span className="relative">
                <InfoIcon size={12} className="cursor-help" />
                <span className="absolute left-full ml-2 bottom-0 w-48 p-2 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-opacity z-20 pointer-events-none">
                  This product has been promoted by the seller {product.boostAmount} times
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}