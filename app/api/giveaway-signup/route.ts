// app/api/giveaway-signup/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Model, Document } from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { GiveawayEntry as GiveawayEntrySchema, IGiveawayEntry } from '@/models/GiveawayEntry';

// ❶ Modell casten auf ein einziges Model<IGiveawayEntry>
const GiveawayEntry = (mongoose.models.GiveawayEntry ||
  GiveawayEntrySchema) as Model<IGiveawayEntry & Document>;

export async function POST(request: NextRequest) {
  try {
    // 1) DB verbinden
    await connectToDatabase();
    console.log(`Mongoose readyState: ${mongoose.connection.readyState}`);
    console.log(`Using model: ${GiveawayEntry.modelName}, collection: ${GiveawayEntry.collection.name}`);

    // 2) Email aus JSON oder FormData
    let email: string | null = null;
    try {
      const body = await request.json();
      email = (body as any).email ?? null;
    } catch {
      const form = await request.formData();
      email = (form.get('email') as string) || null;
    }
    console.log('Parsed email:', email);

    // 3) Validierung
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    // 4) Dubletten‑Check via lean‑Option
    const existing = await GiveawayEntry.findOne(
      { email },
      {},                    // keine spezielle Projektion
      { lean: true }         // direkt als Plain Object
    );
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Email already registered for giveaway' },
        { status: 400 }
      );
    }

    // 5) Neues Dokument anlegen
    const entry = await GiveawayEntry.create({ email });
    console.log(`Created entry ID: ${entry._id}`);

    // 6) Antwort
    const dbName = mongoose.connection.db.databaseName;
    return NextResponse.json(
      {
        success: true,
        message: 'Successfully registered for giveaway',
        metadata: {
          database: dbName,
          collection: GiveawayEntry.collection.name,
          model: GiveawayEntry.modelName,
          createdAt: entry.createdAt
        }
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error in giveaway signup:', err);
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Email already registered for giveaway' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to register for giveaway' },
      { status: 500 }
    );
  }
}
