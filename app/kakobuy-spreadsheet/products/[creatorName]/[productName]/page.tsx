// app/kakobuy-spreadsheet/products/[creatorName]/[productName]/page.tsx

import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import { Product, IProduct } from '@/models/Product';
import Image from 'next/image';
import type { Metadata } from 'next';

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

export async function generateMetadata({ params }: { params: { creatorName: string; productName: string } }): Promise<Metadata> {
  const rawCreatorName = params.creatorName;
  const rawProductName = params.productName;

  const creatorName = decodeURIComponent(rawCreatorName);
  const productName = decodeURIComponent(rawProductName);

  await connectToDatabase();
  const product = await Product.findOne({
    creatorName,
    $or: [{ slug: productName }, { id: productName }, { name: productName }],
  }).lean();

  if (!product) return {};

  const seoTitle = `${product.name} | KakoBuy Spreadsheet - ${creatorName}'s Collection`;
  const seoDescription = `Find ${product.name} by ${creatorName} on KakoBuy Spreadsheet. Best price: ¥${product.price} CNY ($${(product.price * 0.14).toFixed(2)} USD). ${product.description?.slice(0, 160) || 'Chinese product listing with verified details.'}`;
  const imageUrl = product.images?.[0] ?
    (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url) :
    '/images/default-product.jpg';

  return {
    title: seoTitle,
    description: seoDescription,
    metadataBase: new URL('https://yourdomain.com'),
    keywords: [
      'kakobuy spreadsheet',
      'kakobuy price list',
      `${product.name} price`,
      `${creatorName} products`,
      'Chinese products spreadsheet',
      'CNY to USD converter',
      'kakobuy affiliate deals'
    ],
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: product.name || 'Product image',
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/kakobuy-spreadsheet/products/${rawCreatorName}/${rawProductName}`
    }
  };
}

export default async function ProductPage({ params }: { params: { creatorName: string; productName: string } }) {
  const rawCreatorName = params.creatorName;
  const rawProductName = params.productName;

  const creatorName = decodeURIComponent(rawCreatorName);
  const productName = decodeURIComponent(rawProductName);

  await connectToDatabase();
  const product = await Product.findOne({
    creatorName,
    $or: [
      { slug: productName },
      { id: productName },
      { name: productName },
    ],
  }).lean() as (IProduct & { _id: string }) | null;

  if (!product) notFound();

  await Product.updateOne(
    { _id: product._id },
    { $inc: { viewCount: 1 } }
  ).catch(err => console.error('Error updating view count:', err));

  const usdPrice = (product.price * 0.14).toFixed(2);
  const mainImage = product.images?.[0] ?
    (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url) :
    '/images/default-product.jpg';

  const linkToKakoBuy = product.link ?
    `https://www.kakobuy.com/item/details?url=${encodeURI(product.link)}&affcode=kakobuyspreadsheet` :
    null;

  return (
    <div className="container mx-auto py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <div className="rounded-lg overflow-hidden h-96 w-full relative">
              <Image
                src={mainImage}
                alt={product.name ? `${product.name} - KakoBuy Spreadsheet` : 'KakoBuy Spreadsheet Product'}
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
            <p className="text-xl text-gray-700 mb-4">
              Creator: <span className="font-semibold">{product.creatorName}</span>
            </p>

            <div className="mt-4">
              <span className="text-2xl font-bold text-gray-900">${usdPrice}</span>
              <span className="text-sm text-gray-500 ml-2">USD</span>
              <span className="text-sm text-gray-500 ml-2">(¥{product.price} CNY)</span>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Product Description</h2>
              <p className="text-gray-700">{product.description || 'Explore this product on KakoBuy Spreadsheet for detailed information and pricing.'}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Spreadsheet Details</h2>
              <div className="flex flex-col space-y-2">
                <DetailRow label="Store" value={product.store} />
                <DetailRow label="Category" value={product.category} />
                <DetailRow label="Views" value={product.viewCount} />
                <DetailRow label="Purchases" value={`${product.purchased || 0} times`} />
              </div>
            </div>

            {linkToKakoBuy && (
              <div className="mt-8">
                <a
                  href={linkToKakoBuy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center justify-center transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none"
                  aria-label="View product on KakoBuy"
                >
                  <span className="text-lg">View on KakoBuy</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {product.images && product.images.length > 1 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {product.images.slice(1).map((img, index) => {
                const imgSrc = typeof img === 'string' ? img : img.url;
                return (
                  <div key={index} className="h-48 rounded-lg overflow-hidden relative">
                    <Image
                      src={imgSrc}
                      alt={`${product.name || 'KakoBuy Product'} - Image ${index + 2}`}
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
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex">
      <span className="w-24 text-gray-500">{label}:</span>
      <span className="text-gray-700">{value || 'N/A'}</span>
    </div>
  );
}
