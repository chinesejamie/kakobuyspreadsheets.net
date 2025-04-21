import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the Product interface based on your schema
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  link: string;
  category: string;
  images: any[];
  hidden: boolean;
  creatorName: string;
  id: string;
  store: string;
  viewCount: number;
  purchased: number;
  purchaseHistory: {
    purchasedAt: Date;
    origin: string;
  }[];
  findsOfTheWeekUntil: Date | null;
}

// Define the schema matching your original
const ProductSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    link: { type: String },
    category: { type: String },
    images: { type: Array },
    hidden: { type: Boolean, default: false },
    creatorName: { type: String },
    id: { type: String },
    store: { type: String },
    viewCount: { type: Number, default: 0, required: true },
    purchased: { type: Number, default: 0, required: true },
    purchaseHistory: {
      type: [
        {
          purchasedAt: { type: Date, default: Date.now },
          origin: { type: String, default: 'KakoBuy' },
        },
      ],
      default: [],
    },
    findsOfTheWeekUntil: { type: Date, default: null },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Initialize the model with explicit collection name
const Product: Model<IProduct> = mongoose.models.Product
  ? (mongoose.models.Product as Model<IProduct>)
  : mongoose.model<IProduct>('Product', ProductSchema, 'productList');

export default Product;