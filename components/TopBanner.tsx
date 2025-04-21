// app/components/TopBanner.tsx
import Link from 'next/link';
import { X } from 'lucide-react';
import { cookies } from 'next/headers';

export default function TopBanner() {
  const agentName = process.env.AGENT_NAME || 'KakoBuy';
  const inviteURL = process.env.INVITE_URL || 'https://ikako.vip/r/kakobuyspreadsheet';

  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-3 px-4 w-full shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        {/* Text Content */}
        <div className="text-center flex-1">
          <p className="text-sm sm:text-base md:text-lg font-bold leading-tight">
            🚨 LIMITED TIME OFFER! {agentName} Exclusive: 
            <span className="text-yellow-300"> ¥3000 FREE </span>
            + 
            <span className="underline ml-1">30% OFF</span> Shipping!
          </p>
          <p className="text-xs sm:text-sm text-primary-100 mt-1">
            ⏳ Ends soon! Claim your discount before time runs out!
          </p>
        </div>

        {/* CTA Button */}
        <div className="w-full sm:w-auto flex-shrink-0">
          <Link
            href={inviteURL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block sm:inline-block text-center bg-yellow-400 hover:bg-yellow-300 text-primary-800 font-extrabold text-sm sm:text-base rounded-lg px-8 py-3
                      transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🎉 GET YOUR DISCOUNT NOW →
          </Link>
        </div>


      </div>
    </div>
  );
}
