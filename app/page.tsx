// app/page.tsx (Server Component)
import Link from 'next/link';
import { GiveawayForm } from '@/components/GiveawayForm';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KakoBuy Spreadsheet | 7500+ Verified Finds, Coupons & Weekly Deals',
  description: 'Access the largest KakoBuy Spreadsheet online. Discover 7,500+ verified products, exclusive KakoBuy coupons, weekly finds, and premium shopping insights. Your trusted source for Chinese shopping with KakoBuy!',
  metadataBase: new URL('https://kakobuy-spreadsheet.com'),
  keywords: [
    'kakobuy spreadsheet',
    'kakobuy price list',
    'kakobuy finds',
    'kakobuy coupons',
    'kakobuy shopping',
    'kakobuy products',
    'kakobuy qc photos',
    'chinese shopping spreadsheet',
    'kakobuy verified items',
    'kakobuy spreadsheet exclusive',
  ],
  openGraph: {
    title: 'KakoBuy Spreadsheet | 7500+ Verified Finds, Coupons & Weekly Deals',
    description: 'Explore thousands of KakoBuy products with verified quality checks. Updated daily. Best deals and exclusive discounts only at KakoBuy Spreadsheet!',
    url: '/',
    siteName: 'KakoBuy Spreadsheet',
    images: [
      {
        url: 'https://kakobuy-spreadsheet.com/images/seo-cover.webp', // Dein SEO Bild
        width: 1200,
        height: 630,
        alt: 'KakoBuy Spreadsheet Cover',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KakoBuy Spreadsheet | Verified Products & Exclusive Coupons',
    description: 'Access KakoBuy\'s top finds, exclusive coupons, and 7500+ verified products. Shop smart with KakoBuy Spreadsheet!',
    images: ['https://kakobuy-spreadsheet.com/images/seo-cover.webp'],
  },
  alternates: {
    canonical: '/',
  },
};


const CONFIG = {
  AGENT_NAME: 'KakoBuy',
  INVITE_URL: process.env.NEXT_PUBLIC_INVITE_URL || 'https://ikako.vip/r/kakobuyspreadsheet',
};

const categories = ['Shoes', 'Tracksuits', 'Accessories'];
const faqs = [
    {
        id: 1,
        question: `Understanding KakoBuy: What Is It?`,
        answer: `KakoBuy is a well-known Chinese shopping service renowned for its quality, affordability, and diverse selection. It connects international customers with premium Chinese fashion and products. With stringent quality checks and a secure shopping environment, KakoBuy ensures a seamless and pleasant shopping experience.`,
        open: false,
      },
      {
        id: 2,
        question: `About kakobuy-spreadsheet.com`,
        answer: `kakobuy-spreadsheet.com is a highly user-friendly site designed to help you easily find products available on KakoBuy. We offer a vast array of high-quality items and provide useful articles on general knowledge, as well as the latest updates about KakoBuy and its spreadsheets.`,
        open: false,
      },
      {
        id: 3,
        question: "Benefits of Our Online Spreadsheet",
        answer: `kakobuy-spreadsheet.com offers a smooth, lag-free experience with a mobile-optimized interface for browsing on the go. We pre-screen all products to ensure only high-quality items are listed. Compared to traditional spreadsheets, using a KakoBuy spreadsheet on our platform is more efficient and user-friendly, helping you find the best items for your next purchase with ease!`,
        open: false,
      },
      {
        id: 4,
        question: "Need More Help? Here's How to Get It",
        answer: `For extra help, join our community on Discord by clicking the "Join Discord" button at the top of the page. You can interact with our supportive team and other KakoBuy users. Our community can also assist you in using the KakoBuy spreadsheet effectively.`,
        open: false,
      },
      {
        id: 5,
        question: `Step-by-Step Guide to Ordering on KakoBuy`,
        answer: `<ul>
          <li><strong>Finding Products on KakoBuy:</strong> Begin by joining our Discord channel. You can ask questions in the chat and get quick responses. Look at our KakoBuy spreadsheet for the products you need. If an item is not listed, you can request it on our Discord server.</li>
          <li><strong>Using Product Links on KakoBuy:</strong> Click the image link in the KakoBuy spreadsheet to go to the product page on KakoBuy.</li>
          <li><strong>Viewing Product Details on KakoBuy:</strong> KakoBuy item pages provide various options to give you all necessary details about size, color, and version.</li>
          <li><strong>Comparing Versions and Batches on KakoBuy:</strong> Use platforms like Yupoo to compare different versions or batches of items for the best choice.</li>
          <li><strong>Checking Quality Photos on KakoBuy:</strong> KakoBuy allows you to view actual product photos via qc.photos. Click the image icon in the top right corner to see these images.</li>
          <li><strong>Estimating Costs on KakoBuy:</strong> Use KakoBuy's estimator tool to figure out the total cost, including shipping. Add items to your cart to access this tool and get detailed information on weight, size, and shipping costs.</li>
          <li><strong>Placing an Order on KakoBuy:</strong> Add items to your cart, provide the necessary details, agree to the terms, and complete the payment. KakoBuy offers multiple payment options, including PayPal and balance top-up.</li>
          <li><strong>Tracking Your KakoBuy Order:</strong> Monitor your order through its different stages, from "Process Pending" to "Purchased" and "Seller Sent," as it moves to the KakoBuy warehouse.</li>
          <li><strong>Quality Checks and Shipping on KakoBuy:</strong> After arriving at the KakoBuy warehouse, your item will undergo a thorough quality check. View QC photos to ensure it meets your expectations and choose your preferred shipping method.</li>
          <li><strong>Finalizing Your KakoBuy Shipment:</strong> Approve the QC photos, select a shipping method, and confirm your shipment. KakoBuy will prepare and dispatch your order, providing a tracking number for you to monitor your package's progress.</li>
        </ul>
        By following these steps, ordering from KakoBuy will be smooth and rewarding. KakoBuy provides a user-friendly interface, detailed product information, and excellent customer support, making it an ideal choice for purchasing top-quality products from China. Using the KakoBuy spreadsheet makes the entire process easier.`,
        open: false,
      },
      {
        id: 6,
        question: "Finding Specific Products: We're Here to Help",
        answer: `Absolutely! Just provide an image and the name of the product you're looking for in our Discord Channel, and we'll help you find it as soon as possible and add it to the KakoBuy spreadsheet.`,
        open: false,
      },
      {
        id: 7,
        question: `Why Choose KakoBuy Over Other Shopping Platforms?`,
        answer: `KakoBuy stands out for its reliability and consistent service. Unlike other platforms like CNFans or <a href="https://cn-fans-spreadsheet.com" target="_blank">https://cn-fans-spreadsheet.com</a> that might experience downtime, KakoBuy offers uninterrupted service, ensuring your shipments arrive on time. Choose KakoBuy for dependable shopping and efficient use of the KakoBuy spreadsheet.`,
        open: false,
      },
      
  // ...other FAQs
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            #1 <span className="text-primary-500">KakoBuy</span> Spreadsheet <br /> Exclusive Finds & Coupons
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto">
            Discover curated premium finds, exclusive <span className="text-primary-500 font-medium">KakoBuy coupons</span>, and over 7,500+ verified <span className="text-primary-500 font-medium">KakoBuy</span> products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={CONFIG.INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-12 py-6 rounded-full text-xl font-bold transition-all transform hover:scale-105 shadow-xl shadow-primary-200 hover:shadow-primary-300 flex items-center justify-center gap-2"
            >
              🚀 Sign Up for KakoBuy & Get Exclusive Coupons!
            </a>
            <Link
              href="/kakobuy-spreadsheet"
              className="border-2 border-primary-500 text-primary-600 hover:bg-primary-50 px-10 py-5 rounded-full text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              🔍 Explore the KakoBuy Spreadsheet
            </Link>
          </div>
        </div>
      </section>

      {/* Weekly Finds Section */}
      {/* New Feature Section: Finds of the Week */}
      <section className="py-12 bg-white px-2">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  🆕 Weekly Curated Finds
                </h2>
                <p className="text-lg text-gray-600">
                  Discover our handpicked selection of top Kakobuy products updated every Sunday. 
                  Each item features:
                </p>
                <ul className="space-y-2">
                  <li>✅ 360° QC Photos</li>
                  <li>✅ Size Comparison Charts</li>
                  <li>✅ Price History Tracking</li>
                </ul>
                <Link 
                  href="/features/finds-of-the-week"
                  className="inline-block mt-4 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Explore This Week&apos;s Picks →
                </Link>
              </div>
              <div className="hidden md:block">
                {/* Featured product image */}
                <img src="/staticImages/WeeklyFinds.webp" alt="Weekly Finds" className="rounded-xl w-full h-full object-cover aspect-square animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giveaway Section (Inline Form) */}
      <section id="giveaway" className="py-8 md:py-16 bg-blue-50 text-center">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-extrabold text-blue-600 mb-6 md:mb-12">
            🎉 February Giveaway! 🎉
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Join the Giveaway</h3>
              <GiveawayForm />
          </div>
        </div>
      </section>

      {/* Enhanced SEO Content Section */}
      <section className="py-12 bg-gray-50 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Choose Our Kakobuy Spreadsheet?
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">🔍 Comprehensive Kakobuy Product Database</h3>
              <p className="text-gray-600">
                Access over 7,500+ carefully curated Kakobuy finds with detailed quality control information. 
                Our spreadsheet is optimized for:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Quick product comparisons</li>
                <li>Batch quality analysis</li>
                <li>Price trend monitoring</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">🔄 Real-Time Stock Updates</h3>
              <p className="text-gray-600">
                Never miss a restock with our automated tracking system that monitors:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Inventory levels across sizes</li>
                <li>Seller reliability ratings</li>
                <li>Price drop alerts</li>
              </ul>
            </div>

            <div className="text-center mt-8">
              <Link 
                href="/kakobuy-spreadsheet"
                className="inline-block px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                🚀 Start Exploring Now
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Categories Section */}
      <section className="py-8 md:py-16 bg-gray-50 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Explore Our <span className="text-primary-500">Categories</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto mt-8">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/${CONFIG.AGENT_NAME.toLowerCase()}-spreadsheet?category=${encodeURIComponent(category)}`}
                className="relative block bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6 text-center transition duration-300 ease-in-out"
              >
                <h3 className="text-sm md:text-lg font-semibold text-gray-900">
                  {category}
                </h3>
                {category === 'Shoes' && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-lg">
                    Hot
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion using <details> Tags */}
      <section className="py-12 md:py-16 bg-white px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map(({ id, question, answer }) => (
              <details key={id} className="border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50">
                  <span className="font-semibold text-lg">{question}</span>
                </summary>
                <div className="px-6 py-4 text-gray-600">
                  <div dangerouslySetInnerHTML={{ __html: answer }} />
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
