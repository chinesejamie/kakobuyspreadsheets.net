// app/api/finds-of-the-week/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import type { PipelineStage } from 'mongoose';
import Product, { IProduct } from '@/models/Product';
import connectToDatabase from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  // 1) DB-Verbindung
  await connectToDatabase();

  // 2) Query‑Parameter
  const url = new URL(request.url);
  const search   = url.searchParams.get('search')   ?? '';
  const category = url.searchParams.get('category') ?? '';
  const page     = Number(url.searchParams.get('page')  ?? '1');
  const limit    = Number(url.searchParams.get('limit') ?? '8');
  const now      = new Date();
  
  // Fix: Calculate skip correctly
  const skip     = (page - 1) * limit;

  // 3) Basis‑Query für aktive Finds
  let mongoQuery: Record<string, any> = {
    findsOfTheWeekUntil: { $ne: null, $gt: now }
  };

  // Search‑Filter
  if (search) {
    const regex = new RegExp(search, 'i');
    mongoQuery.$and = [
      { findsOfTheWeekUntil: { $ne: null, $gt: now } },
      {
        $or: [
          { name:        { $regex: regex } },
          { description: { $regex: regex } },
          { creatorName: { $regex: regex } },
          { store:       { $regex: regex } },
          { link:        { $regex: regex } },
        ]
      }
    ];
  }

  // Category‑Filter
  if (category && category !== 'All') {
    if (mongoQuery.$and) {
      mongoQuery.$and.push({ category });
    } else {
      mongoQuery.category = category;
    }
  }

  try {
    // 4) Count total matching documents first
    const filteredCount = await Product.countDocuments(mongoQuery);
    const totalFinds = await Product.countDocuments({ findsOfTheWeekUntil: { $ne: null, $gt: now } });

    // 5) Aggregation‑Pipeline (typisiert als PipelineStage[])
    const aggregationPipeline: PipelineStage[] = [
      { $match: mongoQuery },

      // Sort: Zahlen-Literale 1 bzw. -1
      {
        $sort: {
          findsOfTheWeekUntil:  1,  // älteste zuerst (1), für umgekehrte Reihenfolge -1
          viewCount:           -1,
          purchased:           -1,
          _id:                 -1
        }
      },

      // Fix: Apply skip and limit correctly in the pipeline
      { $skip: skip },
      { $limit: limit },

      // Projection und daysRemaining
      {
        $project: {
          name:        1,
          description: 1,
          price:       1,
          link:        1,
          category:    1,
          creatorName: 1,
          store:       1,
          mainImage:   { $arrayElemAt: ['$images', 0] },
          images:      1,
          viewCount:   1,
          purchased:   1,
          findsOfTheWeekUntil: 1,
          daysRemaining: {
            $ceil: {
              $divide: [
                { $subtract: ['$findsOfTheWeekUntil', now] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        }
      }
    ];

    // 6) Execute aggregation pipeline
    const weeklyFinds = await Product.aggregate(aggregationPipeline);

    // Check if there are no results
    if (weeklyFinds.length === 0 && page === 1) {
      return NextResponse.json({ 
        message: 'No weekly finds available',
        products: [],
        totalProducts: 0,
        totalFindsOfTheWeek: totalFinds,
        nextRefreshDate: getNextSundayMidnight()
      }, { status: 404 });
    }

    // Handle empty pages beyond the first page
    if (weeklyFinds.length === 0 && page > 1) {
      return NextResponse.json({ 
        message: 'Page not found',
        products: [],
        totalProducts: filteredCount,
        totalFindsOfTheWeek: totalFinds,
        nextRefreshDate: getNextSundayMidnight(),
        currentPage: page,
        totalPages: Math.ceil(filteredCount / limit)
      }, { status: 200 }); // Return 200 with empty array instead of 404
    }

    // 7) Preis umrechnen und Default‑Bild
    const converted = weeklyFinds.map(p => ({
      ...p,
      price: (typeof p.price === 'number') ? (p.price * 0.14).toFixed(2) : p.price,
      mainImage: p.mainImage || '/images/default-product.jpg'
    }));

    // 8) Antwort mit Pagination-Metadaten
    return NextResponse.json({
      products: converted,
      totalProducts: filteredCount,
      totalFindsOfTheWeek: totalFinds,
      nextRefreshDate: getNextSundayMidnight(),
      currentPage: page,
      totalPages: Math.ceil(filteredCount / limit),
      hasNextPage: page * limit < filteredCount,
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Error fetching finds of the week:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Hilfsfunktionen
function getNextSundayMidnight(): Date {
  const now = new Date();
  const daysUntil = (7 - now.getDay()) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntil);
  next.setHours(0, 0, 0, 0);
  return next;
}