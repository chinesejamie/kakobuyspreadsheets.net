// app/sitemap.xml/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  await connectToDatabase();

  const baseUrl = 'https://kakobuyspreadsheets.net/how-to-buy/how-to-buy';

  const products = await Product.find({}, { creatorName: 1, name: 1, updatedAt: 1 }).lean();

  const staticPages = [
    { path: '', priority: 1.0 },
    { path: '/kakobuy-spreadsheet', priority: 0.9 },
    { path: '/articles', priority: 0.8 },
    { path: '/features/finds-of-the-week', priority: 0.8 },
    { path: '/articles/kakobuy-coupons-2024', priority: 0.7 },
    { path: '/articles/is-kakobuy-legit', priority: 0.7 },
    { path: '/features/request-product', priority: 0.6 },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static Pages
  staticPages.forEach(({ path, priority }) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${path}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Dynamic Product Pages
  products.forEach((product: any) => {
    const creatorName = encodeURIComponent(product.creatorName);
    const productSlug = encodeURIComponent(product.name);
    const lastmod = product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString();
    
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/kakobuy-spreadsheet/products/${creatorName}/${productSlug}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

