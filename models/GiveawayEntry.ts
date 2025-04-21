// models/GiveawayEntry.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

// ① Interface für das Dokument
export interface IGiveawayEntry extends Document {
  email: string;
  createdAt: Date;
}

// ② Schema mit Generic auf IGiveawayEntry
const giveawayEntrySchema = new Schema<IGiveawayEntry>({
  email:     { type: String, required: true, unique: true, trim: true, lowercase: true },
  createdAt: { type: Date,   default: Date.now }
});

// ③ Model exportieren – hier kümmert sich mongoose.models um Doppel-Definitionen
export const GiveawayEntry: Model<IGiveawayEntry> =
  mongoose.models.GiveawayEntry ||
  mongoose.model<IGiveawayEntry>('GiveawayEntry', giveawayEntrySchema);
