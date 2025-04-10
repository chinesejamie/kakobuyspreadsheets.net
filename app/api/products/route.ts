import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb'; // Import the database connection function

export async function GET(request: NextRequest) {
  // Connect to database before executing queries
  await connectToDatabase();
  
  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const creatorName = url.searchParams.get('creatorName');
  const pageParam = url.searchParams.get('page') || '1';
  const limitParam = url.searchParams.get('limit') || '100';
  const category = url.searchParams.get('category');
  const pageId = "6799584fbc65b3b31ece3bc6"
  
  const page = Number(pageParam);
  const limit = Number(limitParam);

  try {
    // Log the collection name and connection status
    const modelName = Product.modelName;
    const collectionName = Product.collection.name;
    const dbName = mongoose.connection.db.databaseName;
    console.log(`Using model: ${modelName}, collection: ${collectionName}, database: ${dbName}`);
    console.log(`Mongoose connection state: ${mongoose.connection.readyState}`);
    
    // Log all available collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Get the actual count from the collection directly
    const rawCount = await mongoose.connection.db.collection(collectionName).countDocuments();
    console.log(`Raw count from ${collectionName}: ${rawCount}`);

    let mongoQuery: any = {};  // Empty by default to include all products

    // Search handling
    if (search) {
      const searchRegex = new RegExp(String(search), "i");
      mongoQuery.$or = [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { creatorName: { $regex: searchRegex } },
        { id: { $regex: searchRegex } },
        { link: { $regex: searchRegex } },
      ];
    }

    // Category filter
    if (category && category !== "All") {
      mongoQuery.category = category;
    }

    // Creator filter
    if (creatorName) {
      mongoQuery.creatorName = { $regex: new RegExp(String(creatorName), "i") };
    }

    // Log the query being executed
    console.log('MongoDB query:', JSON.stringify(mongoQuery));

    // Get total count using both methods
    const estimatedCount = await Product.estimatedDocumentCount();
    const exactCount = await Product.countDocuments({});
    
    console.log(`estimatedDocumentCount: ${estimatedCount}`);
    console.log(`countDocuments with empty query: ${exactCount}`);
    
    // Get filtered count if filters are applied
    const filteredCount = Object.keys(mongoQuery).length > 0 
      ? await Product.countDocuments(mongoQuery)
      : exactCount;
    
    console.log(`filteredCount based on query: ${filteredCount}`);

    // Define the current date to compare with validUntil
    const now = new Date();

    // Aggregation pipeline with boost calculation
    // Build the $sort stage dynamically
    const sortStage: { [key: string]: number } = {
      findsOfTheWeekUntil: -1,
      viewCount: -1,
      purchased: -1,
      _id: -1,
    };

    // Only include totalBoostForPage sorting if pageId is provided
    if (pageId) {
      sortStage.totalBoostForPage = -1;
    }

    const aggregationPipeline = [
      { $match: mongoQuery },
      {
        $addFields: {
          totalBoostForPage: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$boosts",
                    as: "boost",
                    cond: { 
                      $and: [
                        { $eq: ["$$boost.boostPage", pageId] },
                        { $gt: ["$$boost.validUntil", now] }
                      ]
                    }
                  }
                },
                as: "validBoost",
                in: "$$validBoost.amount"
              }
            }
          }
        }
      },
      {
        $sort: {
          totalBoostForPage: -1, // ← Boosted products always on top
          findsOfTheWeekUntil: -1,
          viewCount: -1,
          purchased: -1,
          _id: -1
        }
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          creatorName: 1,
          store: 1,
          mainImage: { $arrayElemAt: ["$images", 0] },
          images: 1,
          viewCount: 1,
          purchased: 1,
          findsOfTheWeekUntil: 1,
          totalBoostForPage: 1,
          boosts: 1
        }
      }
    ];
    

    console.log(`Aggregation skip: ${(page - 1) * limit}, limit: ${limit}`);
    if (pageId) {
      console.log(`Boosting products for pageId: ${pageId}`);
    }

    // Get paginated results
    const products = await Product.aggregate(aggregationPipeline);
    console.log(`Products returned from query: ${products.length}`);

    if (products.length === 0) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 }
      );
    }

    // Always convert CNY to USD
    const convertedProducts = products.map(product => ({
      ...product,
      price: typeof product.price === "number"
        ? convertCnyToUsd(product.price)
        : product.price,
      mainImage: product.mainImage || '/images/default-product.jpg'
    }));

    return NextResponse.json({
      products: convertedProducts,
      totalProducts: filteredCount,
      totalCollectionSize: rawCount,
      collectionName: collectionName,
      databaseInfo: {
        database: dbName,
        collection: collectionName,
        model: modelName,
        estimatedCount,
        exactCount,
        filteredCount
      }
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    console.error("Error details:", error instanceof Error ? error.stack : String(error));
    return NextResponse.json(
      { message: "Failed to fetch products", error: String(error) },
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
