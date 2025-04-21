// app/api/products/[creatorName]/[productName]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';

// Hilfsfunktion: CNY → USD
const convertCnyToUsd = (cny: number): string => (cny * 0.14).toFixed(2);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ creatorName: string; productName: string }> }
) {
  try {
    await connectToDatabase();

    const { creatorName: rawCreator, productName: rawProduct } = await params;
    const creatorName = decodeURIComponent(rawCreator);
    const productName = decodeURIComponent(rawProduct);

    const query = {
      creatorName,
      $or: [
        { slug: productName },
        { id:   productName },
        { name: productName },
      ],
    };

    // ─── Hier casten wir auf ein einzelnes Model<IProduct> ─────────────────────
    const ProductModel = Product as mongoose.Model<IProduct>;

    // nun gibt es nur noch diese eine Signatur:
    const product = await ProductModel.findOne(
      query,       // Filter
      undefined,   // Projektion (alle Felder)
      { lean: true } // lean = true
    );

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Views inkrementieren (fire-and-forget)
    ProductModel.updateOne(
      { _id: product._id },
      { $inc: { viewCount: 1 } }
    ).catch(console.error);

    // Aufbereitung
    const processed = {
      ...product,
      price:     typeof product.price === 'number' ? convertCnyToUsd(product.price) : product.price,
      mainImage: Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : '/images/default-product.jpg',
    };

    const dbName = mongoose.connection.db.databaseName;
    return NextResponse.json({
      product: processed,
      metadata: {
        databaseInfo: {
          database:   dbName,
          collection: ProductModel.collection.name,
          model:      ProductModel.modelName,
        },
      },
    });
  } catch (err: any) {
    console.error('Error fetching product details:', err);
    return NextResponse.json(
      { message: 'Failed to fetch product details', error: err.message || String(err) },
      { status: 500 }
    );
  }
}
