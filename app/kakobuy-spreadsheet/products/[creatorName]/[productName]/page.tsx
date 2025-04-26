// app/kakobuy-spreadsheet/products/[creatorName]/[productName]/page.tsx

import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';
import { Types } from 'mongoose';
import Image from 'next/image';
import type { Metadata } from 'next';
import BuyNowButton from '@/components/BuyNowButton';
import { Suspense } from 'react';
import Script from 'next/script';

// Helper function to escape special regex characters
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function generateStaticParams() {
  await connectToDatabase();
  const products = await Product.find({}, { creatorName: 1, id: 1, slug: 1, name: 1 }).lean();

  return products.map((product: any) => ({
    creatorName: encodeURIComponent(product.creatorName),
    productName: encodeURIComponent(
      product.slug || product.id || product.name?.toLowerCase().replace(/\s+/g, '-') || 'product'
    ),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ creatorName: string; productName: string }>;
}): Promise<Metadata> {
  const { creatorName: encCreator, productName: encProduct } = await params;
  const creatorName = decodeURIComponent(encCreator);
  const productName = decodeURIComponent(encProduct);

  await connectToDatabase();
  // Use case-insensitive regex queries
  const product = await Product.findOne({
    creatorName: { $regex: new RegExp(`^${escapeRegExp(creatorName)}$`, 'i') },
    $or: [
      { slug: { $regex: new RegExp(`^${escapeRegExp(productName)}$`, 'i') } },
      { id: { $regex: new RegExp(`^${escapeRegExp(productName)}$`, 'i') } },
      { name: { $regex: new RegExp(`^${escapeRegExp(productName)}$`, 'i') } },
    ],
  }).lean();

  if (!product) return {};

  // Enhanced SEO title with more focus on "KakoBuy Spreadsheet"
  const seoTitle = `KakoBuy Spreadsheet: ${product.name} by ${creatorName} | Price List`;
  
  // Enhanced description with more details and focus keywords
  const seoDescription = `View ${product.name} by ${creatorName} on KakoBuy Spreadsheet Price List. Chinese import price: ¥${product.price} CNY ($${(product.price * 0.14).toFixed(2)} USD). ${
    product.description?.slice(0, 100) || ''
  } Find verified details on our comprehensive product database.`;
  
  const imageUrl =
    product.images?.[0] && typeof product.images[0] === 'string'
      ? product.images[0]
      : product.images?.[0]?.url || '/images/default-product.jpg';

  // Enhanced SEO keywords with more variation and focus on "kakobuy spreadsheet"
  const keywords = [
    'kakobuy spreadsheet',
    'kakobuy price list',
    'kakobuy product database',
    `${product.name} price`,
    `${creatorName} product catalog`,
    `${product.category || 'product'} price comparison`,
    'Chinese products directory',
    'CNY to USD price converter',
    'kakobuy product listings',
  ];

  return {
    title: seoTitle,
    description: seoDescription,
    metadataBase: new URL('https://kakobuyspreadsheets.net'),
    keywords: keywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${product.name} - KakoBuy Spreadsheet database entry`,
        },
      ],
      type: 'website',
      siteName: 'KakoBuy Spreadsheet',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
      site: '@kakobuyspreadsheet',
    },
    alternates: {
      canonical: `/kakobuy-spreadsheet/products/${encCreator}/${encProduct}`,
    },
    // Add robots directive to prevent Google Shopping indexing
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
        noimageindex: false,
        'notranslate': false,
      }
    },
    other: {
      'format-detection': 'telephone=no',
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ creatorName: string; productName: string }>;
}) {
  const { creatorName: encCreator, productName: encProduct } = await params;
  const creatorName = decodeURIComponent(encCreator);
  const productName = decodeURIComponent(encProduct);

  await connectToDatabase();

  // Update the query to be case-insensitive
  const product = (await Product.findOne({
    creatorName: { $regex: new RegExp(`^${escapeRegExp(creatorName)}$`, 'i') },
    $or: [
      { slug: { $regex: new RegExp(`^${escapeRegExp(productName)}$`, 'i') } },
      { id: { $regex: new RegExp(`^${escapeRegExp(productName)}$`, 'i') } },
      { name: { $regex: new RegExp(`^${escapeRegExp(productName)}$`, 'i') } },
    ],
  })
    .lean()) as unknown as IProduct & { _id: Types.ObjectId } | null;

  if (!product) notFound();

  await Product.updateOne(
    { _id: product._id },
    { $inc: { viewCount: 1 } }
  ).catch((err) => console.error('Error updating view count:', err));

  const usdPrice = (product.price * 0.14).toFixed(2);
  const mainImage =
    product.images?.[0] && typeof product.images[0] === 'string'
      ? product.images[0]
      : product.images?.[0]?.url || '/images/default-product.jpg';

  const linkToKakoBuy = product.link
    ? `https://www.kakobuy.com/item/details?url=${encodeURI(
        product.link
      )}&affcode=kakobuyspreadsheet`
    : null;

  // Build structured data for better SEO but avoid Google Shopping inclusion
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `KakoBuy Spreadsheet: ${product.name || 'Product'} by ${product.creatorName}`,
    description: product.description || 'Product information from KakoBuy Spreadsheet database',
    url: `https://kakobuyspreadsheets.net/kakobuy-spreadsheet/products/${encCreator}/${encProduct}`,
    author: {
      '@type': 'Organization',
      name: 'KakoBuy Spreadsheet',
    },
    publisher: {
      '@type': 'Organization',
      name: 'KakoBuy Spreadsheet',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kakobuyspreadsheets.net/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'ItemPage',
      '@id': `https://kakobuyspreadsheets.net/kakobuy-spreadsheet/products/${encCreator}/${encProduct}`
    },
    image: mainImage,
    // Note: Deliberately avoiding Product schema to prevent Google Shopping inclusion
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="container mx-auto py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
          {/* Breadcrumbs for better SEO */}
          <nav className="flex py-3 text-gray-700 mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="/" className="text-sm text-blue-700 hover:text-blue-900">
                  KakoBuy Spreadsheet
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <a className="text-sm text-blue-700 hover:text-blue-900">
                    {creatorName}
                  </a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm text-gray-500">{product.name}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <div className="rounded-lg overflow-hidden h-96 w-full relative">
                <Image
                  src={mainImage}
                  alt={
                    product.name
                      ? `${product.name} - KakoBuy Spreadsheet catalog entry`
                      : 'KakoBuy Spreadsheet Product Database'
                  }
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name || 'KakoBuy Spreadsheet Product'}
              </h1>
              
              {/* Added schema markup for better SEO */}
              <div itemScope itemType="https://schema.org/Person" className="mb-4">
                <p className="text-xl text-gray-700">
                  Creator: <span className="font-semibold" itemProp="name">{product.creatorName}</span>
                </p>
              </div>

              <div className="mt-4">
                <span className="text-2xl font-bold text-gray-900">${usdPrice}</span>
                <span className="text-sm text-gray-500 ml-2">USD</span>
                <span className="text-sm text-gray-500 ml-2">
                  (¥{product.price} CNY)
                </span>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Product Information
                </h2>
                <div className="prose prose-sm text-gray-700">
                  {product.description ||
                    'Explore this listing on KakoBuy Spreadsheet for detailed information and pricing. Our database provides comprehensive details on products from Chinese marketplaces.'}
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Spreadsheet Details
                </h2>
                <div className="flex flex-col space-y-2">
                  <DetailRow label="Store" value={product.store} />
                  <DetailRow label="Category" value={product.category} />
                  <DetailRow label="Views" value={product.viewCount} />
                  <DetailRow
                    label="Purchases"
                    value={`${product.purchased || 0} times`}
                  />
                </div>
              </div>

              {linkToKakoBuy && (
                <div className="mt-8">
                  <BuyNowButton
                    creatorName={product.creatorName}
                    productId={product._id.toString()}
                    href={linkToKakoBuy}
                  />
                </div>
              )}
            </div>
          </div>

          {product.images && product.images.length > 1 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Product Gallery
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {product.images.slice(1).map((img, index) => {
                  const src = typeof img === 'string' ? img : img.url;
                  return (
                    <div
                      key={index}
                      className="h-48 rounded-lg overflow-hidden relative"
                    >
                      <Image
                        src={src}
                        alt={`${product.name || 'KakoBuy Spreadsheet Listing'} - Image ${
                          index + 2
                        }`}
                        fill
                        className="object-cover transition-transform hover:scale-105 duration-300"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Related products section for better internal linking and SEO */}
          <Suspense fallback={<div className="mt-12 p-4 text-center">Loading related products...</div>}>
            <RelatedProducts 
              category={product.category} 
              creatorName={product.creatorName} 
              currentProductId={product._id.toString()} 
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex">
      <span className="w-24 text-gray-500">{label}:</span>
      <span className="text-gray-700">{value ?? 'N/A'}</span>
    </div>
  );
}

// New component to show related products - helps with internal linking and SEO
async function RelatedProducts({ 
  category, 
  creatorName, 
  currentProductId 
}: { 
  category?: string; 
  creatorName: string; 
  currentProductId: string 
}) {
  await connectToDatabase();
  
  // Find related products by same creator or in same category
  const relatedProducts = await Product.find({
    $and: [
      { _id: { $ne: new Types.ObjectId(currentProductId) } },
      { 
        $or: [
          { creatorName },
          { category }
        ]
      }
    ]
  })
  .limit(4)
  .sort({ viewCount: -1 })
  .lean();
  
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        More From KakoBuy Spreadsheet
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product: any) => {
          const productLink = `/kakobuy-spreadsheet/products/${encodeURIComponent(product.creatorName)}/${encodeURIComponent(
            product.name || 'product'
          )}`;
          
          const thumbnail = product.images?.[0] && typeof product.images[0] === 'string'
            ? product.images[0]
            : product.images?.[0]?.url || '/images/default-product.jpg';
            
          return (
            <a 
              href={productLink} 
              key={product._id.toString()}
              className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={thumbnail}
                  alt={`${product.name || 'KakoBuy Spreadsheet Listing'}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.creatorName}</p>
                <p className="mt-2 text-lg font-bold text-gray-900">${(product.price * 0.14).toFixed(2)}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}