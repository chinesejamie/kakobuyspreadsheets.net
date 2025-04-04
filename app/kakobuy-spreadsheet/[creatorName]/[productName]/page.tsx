// app/[creatorName]/[productName]/page.tsx

import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';

// Pre-Generate Static Paths by querying the database directly
export async function generateStaticParams() {
  // Verbindung zur Datenbank herstellen
  await connectToDatabase();

  // Hole alle Produkte und wähle nur die Felder aus, die Du für die URL benötigst.
  // Hier nehmen wir an, dass Du ein Feld "slug" hast, das URL-optimiert ist.
  const products = await Product.find({}, { creatorName: 1, slug: 1 }).lean();

  return products.map((product: any) => ({
    creatorName: product.creatorName,
    productName: product.slug,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: { creatorName: string; productName: string };
}) {
  // Verbindung zur Datenbank herstellen
  await connectToDatabase();

  // Finde das Produkt anhand der dynamischen Parameter.
  const product = await Product.findOne({
    creatorName: params.creatorName,
    slug: params.productName,
  }).lean();

  if (!product) {
    // Falls kein Produkt gefunden wurde, wird eine 404-Seite angezeigt.
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-lg text-gray-700">by {product.creatorName}</p>
      <p className="mt-4">{product.description}</p>
      {/* Füge weitere Produktdetails hinzu */}
    </div>
  );
}
