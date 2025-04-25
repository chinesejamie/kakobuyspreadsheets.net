'use client';

import React from 'react';

declare global {
  interface Window {
    ttq?: {
      track: (event: string) => void;
      [key: string]: any;
    };
  }
}

export default function TrackSignUpButton() {
  const handleClick = () => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('Subscribe'); // oder 'Subscribe' je nach TikTok Event
    }
  };

  return (
    <a
        href={process.env.NEXT_PUBLIC_INVITE_URL || 'https://www.kakobuy.com/register_sps?affcode=kakobuyspreadsheet'}
        target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-12 py-6 rounded-full text-xl font-bold transition-all transform hover:scale-105 shadow-xl shadow-primary-200 hover:shadow-primary-300 flex items-center justify-center gap-2"
    >
      🚀 Sign Up for KakoBuy & Get Exclusive Coupons!
    </a>
  );
}
