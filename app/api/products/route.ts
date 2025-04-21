// app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import type { PipelineStage } from 'mongoose';
import Product from '@/models/Product';
import connectToDatabase from '@/lib/mongodb';

// Hilfsfunktion CNY → USD
const convertCnyToUsd = (cny: number): string =>
  (cny * 0.14).toFixed(2);

export async function GET(request: NextRequest) {
  // 1) DB verbinden
  await connectToDatabase();

  const url         = new URL(request.url);
  const search      = url.searchParams.get('search');
  const creatorName = url.searchParams.get('creatorName');
  const category    = url.searchParams.get('category');
  const page        = Number(url.searchParams.get('page')  ?? '1');
  const limit       = Number(url.searchParams.get('limit') ?? '100');
  const now         = new Date();

  // 2) Basis‐Query
  const mongoQuery: Record<string, any> = {};
  if (search) {
    const rx = new RegExp(String(search), 'i');
    mongoQuery.$or = [
      { name:        { $regex: rx } },
      { description: { $regex: rx } },
      { creatorName: { $regex: rx } },
      { id:          { $regex: rx } },
      { link:        { $regex: rx } },
    ];
  }
  if (category && category !== 'All') {
    mongoQuery.category = category;
  }
  if (creatorName) {
    mongoQuery.creatorName = new RegExp(String(creatorName), 'i');
  }

  // 3) Zählungen
  const rawCount      = await mongoose.connection.db.collection(Product.collection.name).countDocuments();
  const exactCount    = await Product.countDocuments({});
  const filteredCount = Object.keys(mongoQuery).length
    ? await Product.countDocuments(mongoQuery)
    : exactCount;

  // 4) Page‑ID für Boosts
  const pageId = '6799584fbc65b3b31ece3bc6';

  // 5) Aggregation
  const pipeline: PipelineStage[] = [
    { $match: mongoQuery },
    {
      $addFields: {
        totalBoostForPage: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: '$boosts',
                  as:    'b',
                  cond: {
                    $and: [
                      { $eq: ['$$b.boostPage', pageId] },
                      { $gt: ['$$b.validUntil', now] }
                    ]
                  }
                }
              },
              as: 'validBoost',
              in: '$$validBoost.amount'
            }
          }
        }
      }
    },
    {
      $sort: {
        totalBoostForPage: -1,
        purchased:         -1,
        viewCount:         -1,
        _id:               -1
      }
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $project: {
        name:                1,
        description:         1,
        price:               1,
        creatorName:         1,
        store:               1,
        mainImage:           { $arrayElemAt: ['$images', 0] },
        images:              1,
        viewCount:           1,
        purchased:           1,
        findsOfTheWeekUntil: 1,
        // Aliase the boost total to "boostAmount":
        boostAmount:         '$totalBoostForPage'
      }
    }
  ];

  // 6) Ausführen
  const products = await Product.aggregate(pipeline);

  if (!products.length) {
    return NextResponse.json({ message: 'No products found' }, { status: 404 });
  }

  // 7) Ergebnis konvertieren
  const converted = products.map(p => ({
    ...p,
    price:     typeof p.price === 'number' ? convertCnyToUsd(p.price) : p.price,
    mainImage: p.mainImage || '/images/default-product.jpg',
  }));

  // 8) Antwort
  return NextResponse.json({
    products:            converted,
    totalProducts:       filteredCount,
    totalCollectionSize: rawCount,
    collectionName:      Product.collection.name,
    databaseInfo: {
      database:       mongoose.connection.db.databaseName,
      collection:     Product.collection.name,
      model:          Product.modelName,
      estimatedCount: await Product.estimatedDocumentCount(),
      exactCount,
      filteredCount,
    }
  });
}
