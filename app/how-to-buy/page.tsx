import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata = {
  title: 'How to Buy from KakoBuy — Step-by-Step Guide + Verified Spreadsheet',
  description: 'Learn how to easily shop from KakoBuy with our complete guide. Find products, review QC photos, estimate costs, and access over 7500 verified items on our KakoBuy Spreadsheet. Join our Discord for exclusive giveaways!',
  keywords: [
    'how to buy from kakobuy',
    'kakobuy shopping guide',
    'kakobuy spreadsheet',
    'buy chinese products',
    'kakobuy qc photos',
    'kakobuy verified products',
    'kakobuy discord giveaways'
  ],
  alternates: {
    canonical: 'https://kakobuyspreadsheets.net/how-to-buy'
  }
};

export default function HowToBuyPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
        How to Buy from KakoBuy — Step-by-Step Guide
      </h1>

      <p className="text-lg text-gray-700 mb-6 text-center">
        New to KakoBuy? This ultimate guide shows you how to find, purchase, and receive top-quality products easily. Join our <Link href="/kakobuy-spreadsheet" className="text-primary-500 underline">KakoBuy Spreadsheet</Link> for 7500+ verified finds and don't miss out on our <a href="https://discord.gg/BE6cnac2cd" target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">Discord Giveaways</a>!
      </p>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">1. Discovering the Right Products</h2>
          <p className="text-gray-600">
            Start by exploring trusted communities:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            <li><a href="https://discord.gg/BE6cnac2cd" target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">Discord Community</a> — Direct product links, tips, and giveaways.</li>
            <li><a href="https://www.reddit.com/r/KakoBuySpreadsheet/" target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">Reddit</a> — Batch images and catalogs.</li>
            <li>Fashion Reps Subreddit — Real reviews and finds.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">2. Using Product Links and Image Search</h2>
          <p className="text-gray-600">
            Copy product links into KakoBuy’s search bar, or use reverse image search to locate matching items with just a photo.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">3. Reviewing Product Details</h2>
          <p className="text-gray-600">
            Always check available sizes, versions, and batches. Compare photos from our <Link href="/kakobuy-spreadsheet" className="text-primary-500 underline">KakoBuy Spreadsheet</Link> for quality differences.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">4. Reviewing QC Photos</h2>
          <p className="text-gray-600">
            After purchase, KakoBuy provides detailed Quality Control (QC) photos. Inspect stitching, logos, and overall build quality.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">5. Estimating Costs</h2>
          <p className="text-gray-600">
            Use KakoBuy’s built-in cost estimator. Tip: Remove extra packaging like shoeboxes to lower shipping fees.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">6. Placing Your Order</h2>
          <p className="text-gray-600">
            Add items to your cart, fill out your shipping details, and select a secure payment method. If PayPal isn’t available, top up your KakoBuy balance.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">7. Order Processing and Shipping</h2>
          <p className="text-gray-600">
            Orders move through stages: Pending Review → Purchased → Warehouse → QC Photos → Shipping. Approve your items and choose your shipping method carefully.
          </p>
        </div>

        <div className="bg-primary-50 p-6 rounded-lg mt-8">
          <h2 className="text-2xl font-bold text-primary-600 mb-4">💡 Pro Tips for Smarter Shopping</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Use the <Link href="/kakobuy-spreadsheet" className="text-primary-500 underline">KakoBuy Spreadsheet</Link> for faster product discovery.</li>
            <li>Engage in the <a href="https://discord.gg/BE6cnac2cd" target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">Discord Community</a> for help and giveaways.</li>
            <li>Always inspect QC photos carefully before shipping approval.</li>
            <li>Compare multiple sellers and batches before placing large orders.</li>
            <li>Monitor our Discord for flash deals and spreadsheet updates.</li>
          </ul>
        </div>

        <div className="text-center mt-12">
          <h2 className="text-2xl font-extrabold mb-4">Ready to Start?</h2>
          <p className="text-gray-600 mb-6">Browse thousands of verified products on our KakoBuy Spreadsheet and win exclusive giveaways by joining our Discord!</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href="/kakobuy-spreadsheet" className="bg-primary-600 hover:bg-primary-700 text-white py-4 px-8 rounded-full text-lg font-bold">
              🚀 Explore the KakoBuy Spreadsheet
            </Link>
            <a href="https://discord.gg/BE6cnac2cd" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-full text-lg font-bold">
              🎉 Join Our Discord Giveaways
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-6 py-4 cursor-pointer hover:bg-gray-100 font-semibold">
                Is KakoBuy safe to use?
              </summary>
              <div className="px-6 py-4 text-gray-600">
                Yes! KakoBuy is a trusted agent service that helps you buy products from Chinese platforms securely, with detailed QC photos and protection systems in place.
              </div>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-6 py-4 cursor-pointer hover:bg-gray-100 font-semibold">
                How do I request a missing product?
              </summary>
              <div className="px-6 py-4 text-gray-600">
                You can request missing products through our <Link href="/features/request-product" className="text-primary-500 underline">Request Product</Link> page, or ask directly via our Discord server.
              </div>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-6 py-4 cursor-pointer hover:bg-gray-100 font-semibold">
                What payment methods does KakoBuy accept?
              </summary>
              <div className="px-6 py-4 text-gray-600">
                KakoBuy supports major options like PayPal (when available), credit cards, balance top-up, and Alipay for international users.
              </div>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-6 py-4 cursor-pointer hover:bg-gray-100 font-semibold">
                How long does shipping take from KakoBuy?
              </summary>
              <div className="px-6 py-4 text-gray-600">
                Standard shipping usually takes 7–20 days depending on the destination and chosen shipping method.
              </div>
            </details>
          </div>
        </section>

        {/* FAQ Structured Data */}
        <Script id="faq-how-to-buy-structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {"@type": "Question", "name": "Is KakoBuy safe to use?", "acceptedAnswer": {"@type": "Answer", "text": "Yes! KakoBuy is a trusted agent service that provides secure purchasing from Chinese platforms with QC photos."}},
              {"@type": "Question", "name": "How do I request a missing product?", "acceptedAnswer": {"@type": "Answer", "text": "Use our Request Product page or join our Discord to request missing products."}},
              {"@type": "Question", "name": "What payment methods does KakoBuy accept?", "acceptedAnswer": {"@type": "Answer", "text": "KakoBuy supports PayPal (when available), credit cards, Alipay, and account balance top-ups."}},
              {"@type": "Question", "name": "How long does shipping take from KakoBuy?", "acceptedAnswer": {"@type": "Answer", "text": "Shipping usually takes 7–20 days depending on location and method chosen."}}
            ]
          })}
        </Script>

      </div>
    </section>
  );
}