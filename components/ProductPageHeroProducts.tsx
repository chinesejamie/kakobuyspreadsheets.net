'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductPageSearchBar from '@/components/ProductPageSearchBar';

const agentName = process.env.NEXT_PUBLIC_AGENT_NAME || 'KakoBuy';
const inviteURL = process.env.NEXT_PUBLIC_INVITE_URL || 'https://ikako.vip/r/kakobuyspreadsheet';

export default function ProductPageHeroProducts() {
  // State for tracking viewport width
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Handle initial size detection
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to handle resize events
  const handleResize = () => {
    setIsMobile(window.innerWidth < 640);
    setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
  };

  // Get appropriate button text based on screen size
  const getButtonText = () => {
    if (isMobile) {
      return '🎁 Claim Coupon Now';
    } else if (isTablet) {
      return '🎁 Get $15 Off Shipping!';
    } else {
      return '🎁 Get 3000 CNY Coupons + $15 Off Shipping!';
    }
  };

  return (
    <section className="bg-white py-6 sm:py-8 md:py-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Text Section - Full width on mobile, 7/12 on large screens */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-6">
              {agentName} Spreadsheet — Find the Best Deals
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              Explore the ultimate {agentName} Spreadsheet with over 7,500 verified products, real QC photos, exclusive coupons, and daily updated finds. Browse premium shoes, hoodies, T-shirts, and more — all carefully selected to enhance your shopping experience.
            </p>
            <div className="w-full max-w-xl">
              <ProductPageSearchBar />
            </div>
          </div>

          {/* Right Button Section - Full width on mobile, 5/12 on large screens */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
            <a
              href={inviteURL}
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-full shadow-lg text-center text-base sm:text-lg md:text-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              {getButtonText()}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}