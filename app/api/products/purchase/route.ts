// app/api/products/purchase/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/models/Product';
import connectToDatabase from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  const { creatorName, productId } = await req.json();

  if (!creatorName || !productId) {
    return NextResponse.json({ message: 'creatorName and productId required' }, { status: 400 });
  }

  await connectToDatabase();

  try {
    const result = await Product.findOneAndUpdate(
      { creatorName, _id: new mongoose.Types.ObjectId(productId) },
      {
        $inc: { purchased: 1 },
        $push: { purchaseHistory: { purchasedAt: new Date(), origin: 'KakoBuy' } }
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Purchase counted', purchased: result.purchased });
  } catch (error: any) {
    console.error('Purchase tracking error:', error);
    return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
  }
}
