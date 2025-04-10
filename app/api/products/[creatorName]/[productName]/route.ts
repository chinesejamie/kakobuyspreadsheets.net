// app/api/product/[creatorName]/[productName]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { creatorName: string; productName: string } }
) {
  try {
    // Connect to database before executing queries
    await connectToDatabase();
    
    const { creatorName, productName } = params;
    
    console.log(`Fetching product details - Creator: ${creatorName}, Product Name: ${productName}`);
    
    // Log connection status
    const modelName = Product.modelName;
    const collectionName = Product.collection.name;
    const dbName = mongoose.connection.db.databaseName;
    console.log(`Using model: ${modelName}, collection: ${collectionName}, database: ${dbName}`);
    console.log(`Mongoose connection state: ${mongoose.connection.readyState}`);
    
    // Construct query to match by creatorName and either slug, id, or name
    let query: any = { creatorName };
    
    // Add options for finding by slug, id or name
    query.$or = [
      { slug: productName },
      { id: productName },
      { name: productName }
    ];
    
    console.log('MongoDB query:', JSON.stringify(query));
    
    // Find the product
    const product = await Product.findOne(query).lean();
    
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    
    // Update view count asynchronously (don't wait for it to complete)
    Product.updateOne(
      { _id: product._id },
      { $inc: { viewCount: 1 } }
    ).catch(err => console.error('Error updating view count:', err));
    
    // Process the product data
    const processedProduct = {
      ...product,
      price: typeof product.price === "number"
        ? convertCnyToUsd(product.price)
        : product.price,
      // Ensure mainImage is the first image or a default
      mainImage: product.images && product.images.length > 0 
        ? product.images[0] 
        : '/images/default-product.jpg'
    };
    
    return NextResponse.json({
      product: processedProduct,
      metadata: {
        databaseInfo: {
          database: dbName,
          collection: collectionName,
          model: modelName
        }
      }
    });
    
  } catch (error) {
    console.error("Error fetching product details:", error);
    console.error("Error details:", error instanceof Error ? error.stack : String(error));
    
    return NextResponse.json(
      { message: "Failed to fetch product details", error: String(error) },
      { status: 500 }
    );
  }
}

// Simple function to convert CNY to USD (1 CNY = 0.14 USD)
const convertCnyToUsd = (cnyPrice: number): string => {
  if (typeof cnyPrice !== 'number' || isNaN(cnyPrice)) {
    return "0.00";
  }
  
  // Fixed conversion rate from CNY to USD
  const usdRate = 0.14;
  
  return (cnyPrice * usdRate).toFixed(2);
};