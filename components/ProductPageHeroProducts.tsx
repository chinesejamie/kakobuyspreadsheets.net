'use client';

import Link from 'next/link';
import ProductPageSearchBar from '@/components/ProductPageSearchBar';

const agentName = process.env.NEXT_PUBLIC_AGENT_NAME || 'KakoBuy';
const inviteURL = process.env.NEXT_PUBLIC_INVITE_URL || 'https://discord.gg/GGZPQeSjxv';

export default function ProductPageHeroProducts() {
  return (
    <section>
      <div className="grid max-w-screen-xl px-4 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 my-8">
        {/* Left Text Section */}
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            The best <br /> {agentName} SPREADSHEET.
          </h1>
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-base dark:text-gray-400">
            Welcome to the premier {agentName} Spreadsheet! This extensive spreadsheet is designed to help you find
            the top products and deals available on {agentName}. Whether you're in search of the newest fashion trends
            or exclusive discounts, our {agentName} Spreadsheet offers all the details you need to make smarter shopping decisions.
            <br /><br />
            Simply click on a product image to be taken to the product page on {agentName}.com! I frequently update my spreadsheet with new
            products including shoes, hoodies, sweaters, T-shirts, tracksuits, accessories, and more, aiming to showcase the best
            high-quality finds from {agentName}.
          </p>
          <ProductPageSearchBar />
        </div>

        {/* Right Button Section */}
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex items-center justify-center">
          <a
            href={inviteURL}
            className="signup-button bg-primary-600 hover:bg-primary-700 text-white font-bold py-8 px-8 rounded-full shadow-lg flex items-center justify-center transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-3xl font-extrabold text-center">
              Get a 3000 CNY Coupon Bundle and $15 Off Shipping.
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
