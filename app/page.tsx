'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Categories } from '@/components/categories';

// Config would come from env variables in Next.js
const CONFIG = {
  AGENT_NAME: 'KakoBuy',
  INVITE_URL: process.env.NEXT_PUBLIC_INVITE_URL || 'https://discord.example.com'
};

export default function Home() {
  const router = useRouter();
  
  // State variables
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState(['Shoes', 'Clothing', 'Accessories', 'Bags']);
  const [faqs, setFaqs] = useState([
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
  ]);

  const products = [
    {
      name: "Looking for a Seller to fill this Space.",
      description: "Join the Discord and DM for more Details",
      price: "Join the Discord and DM for more Details.",
      images: [
        {
          url: "/assets/productImages/670d19ec7f9ef6219a7e65a2/670d19ec7f9ef6219a7e65a2_1728911967780_0.webp",
        },
      ],
      creatorName: "Discord",
    },
  ];

  // Function to toggle FAQ panels
  const togglePanel = (id) => {
    setFaqs(prevFaqs => 
      prevFaqs.map(faq => 
        faq.id === id ? { ...faq, open: !faq.open } : faq
      )
    );
  };

  // Show modal and open invite URL
  const handleJoinClick = () => {
    setShowModal(true);
    
    setTimeout(() => {
      window.open(CONFIG.INVITE_URL, '_blank', 'noopener,noreferrer');
    }, 100);
  };

  // Handle TikTok pixel event
  const handleTikTokSignUp = () => {
    // This would need integration with the TikTok Pixel in Next.js
    // You'd need to add the TikTok pixel script to your _document.js or use a package
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('SignUp', {
        contents: [],
        content_type: 'product',
        value: 0,
        currency: 'USD'
      });
    }
  };

  // Handle email submission for giveaway
  const handleSubmitEmail = async () => {
    if (!email) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/giveaway-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      // In Next.js you'd use a toast library
      // For simplicity, we'll use alert here, but you should replace with a proper toast
      alert('Successfully registered for the giveaway!');
      setShowModal(false);
      setEmail('');
      
    } catch (error) {
      alert('Failed to register. Please try again.');
      console.error('Error submitting email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section - Mobile Optimized */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Brand-Colored Header */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            #1 <span className="text-primary-500">KakoBuy</span> Spreadsheet <br /> Exclusive Finds & Coupons
          </h1>
          
          {/* Curated Discovery Description */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto">
            Discover curated premium finds, exclusive <span className="text-primary-500 font-medium">KakoBuy coupons</span>, and over 7,000+ verified 
            <span className="text-primary-500 font-medium">KakoBuy</span> products. 
            Our <strong>Kakobuy Spreadsheet</strong> helps you track real-time availability, price drops, and special deals.
          </p>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Signup Button - Opens in New Tab */}
            <a
              href={CONFIG.INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleTikTokSignUp}
              className="bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-12 py-6 rounded-full text-xl font-bold transition-all transform hover:scale-105 shadow-xl shadow-primary-200 hover:shadow-primary-300 flex items-center justify-center gap-2"
            >
              <span>🚀</span>
              Sign Up for KakoBuy & Get Exclusive Coupons!
            </a>

            {/* Spreadsheet Button - Opens in Same Tab */}
            <Link
              href="/KakoBuy-spreadsheet"
              className="border-2 border-primary-500 text-primary-600 hover:bg-primary-50 px-10 py-5 rounded-full text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>🔍</span>
              Explore the KakoBuy Spreadsheet
            </Link>
          </div>

          {/* Value Badges */}
          <div className="mt-8 space-y-2 text-sm text-gray-600">
            <p>✔️ 7,500+ Curated KakoBuy Deals • ✔️ Mobile-Optimized KakoBuy Spreadsheet</p>
            <p>✔️ Exclusive KakoBuy Finds • ✔️ Hourly KakoBuy Coupons & Updates</p>
          </div>
        </div>
      </section>

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

      {/* Giveaway Section - Mobile Optimized */}
      <section className="py-8 md:py-16 bg-blue-50 text-center">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-blue-600 mb-6 md:mb-12">
            🎉 February Giveaway! 🎉
          </h2>

          {/* Desktop Layout */}
          <div className="hidden md:grid grid-cols-12 gap-8 mb-8">
            {/* Prize Pool */}
            <div className="col-span-7">
              <div className="bg-white rounded-2xl p-8 shadow-lg h-full">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">Amazing Prizes Await! 🎁</h3>
                <div className="grid grid-cols-3 gap-6">
                  {/* First Prize */}
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 transform hover:scale-105 transition-transform">
                    <div className="text-4xl mb-3">🥇</div>
                    <div className="text-xl font-bold text-gray-800 mb-2">1st Prize</div>
                    <div className="text-2xl font-bold text-blue-600">800 CNY</div>
                    <div className="text-sm text-gray-600 mt-2">1 Winner</div>
                  </div>
                  
                  {/* Second Prize */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 transform hover:scale-105 transition-transform">
                    <div className="text-4xl mb-3">🥈</div>
                    <div className="text-xl font-bold text-gray-800 mb-2">2nd Prize</div>
                    <div className="text-2xl font-bold text-blue-600">500 CNY</div>
                    <div className="text-sm text-gray-600 mt-2">2 Winners</div>
                  </div>
                  
                  {/* Third Prize */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 transform hover:scale-105 transition-transform">
                    <div className="text-4xl mb-3">🥉</div>
                    <div className="text-xl font-bold text-gray-800 mb-2">3rd Prize</div>
                    <div className="text-2xl font-bold text-blue-600">300 CNY</div>
                    <div className="text-sm text-gray-600 mt-2">3 Winners</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Update & CTA */}
            <div className="col-span-5 space-y-6">
              <div className="bg-red-50 rounded-2xl p-8 shadow-lg text-left">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">⚠️</div>
                  <div>
                    <h3 className="text-xl font-bold text-red-700 mb-2">
                      European Route Update
                    </h3>
                    <p className="text-red-600">
                      Service stops on Jan 25th. Submit packages by Jan 23rd (Beijing time) for safe delivery.
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleJoinClick}
                className="w-full px-8 py-6 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-bold text-xl shadow-lg hover:scale-105 transition-transform duration-300"
              >
                🎁 Join Giveaway Now
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-6">
            {/* Mobile Prize Display */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Prize Pool:</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥇</span>
                  <span><strong>1st Prize:</strong> 800 CNY</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥈</span>
                  <span><strong>2nd Prize:</strong> 500 CNY (2 Winners)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥉</span>
                  <span><strong>3rd Prize:</strong> 300 CNY (3 Winners)</span>
                </div>
              </div>
            </div>

            {/* Mobile Important Update */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-left">
              <p className="text-red-700 font-medium">
                🚨 European Route Update
              </p>
              <p className="text-sm text-red-600 mt-1">
                Service stops on Jan 25th. Submit packages by Jan 23rd (Beijing time) for safe delivery.
              </p>
            </div>

            {/* Mobile CTA */}
            <button
              onClick={handleJoinClick}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-semibold text-lg shadow-md hover:scale-105 transition-transform duration-300"
            >
              🎁 Join Giveaway Now
            </button>
          </div>
        </div>
        
        {/* Optimized Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md relative">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">×</span>
              </button>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Join the Giveaway</h3>
                <p className="text-gray-600 text-sm mb-6">Enter your email for a chance to win!</p>
                
                <form onSubmit={(e) => { e.preventDefault(); handleSubmitEmail(); }} className="space-y-4">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="Your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-75"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Enter Giveaway'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
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

      {/* Categories Section - Mobile Optimized */}
      <section className="py-8 md:py-16 bg-gray-50 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Explore Our <span className="text-primary-500">Categories</span>
          </h2>
          
          {/* Mobile-optimized Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto mt-8">
            {categories.map((category) => (
              <a
                key={category}
                href={`/${CONFIG.AGENT_NAME.toLowerCase()}-spreadsheet?category=${category}`}
                className="relative block bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6 text-center 
                         active:bg-gray-50 transition duration-300 ease-in-out"
              >
                <h3 className="text-sm md:text-lg font-semibold text-gray-900">
                  {category}
                </h3>
                
                {category === 'Shoes' && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-lg">
                    Hot
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
            Frequently Asked Questions
          </h2>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className="border border-gray-200 rounded-lg"
              >
                <button
                  onClick={() => togglePanel(faq.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <span className={`text-gray-500 text-xl transform transition-transform ${faq.open ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {faq.open && (
                  <div 
                    className="px-6 py-4 text-gray-600 border-t"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}