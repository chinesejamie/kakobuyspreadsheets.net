'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function PopupReminder() {
  const [showPopup, setShowPopup] = useState(false);

  const agentName = process.env.NEXT_PUBLIC_AGENT_NAME || 'KakoBuy';
  const inviteURL = process.env.NEXT_PUBLIC_INVITE_URL || 'https://ikako.vip/r/kakobuyspreadsheet';

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isBot = /bot|crawl|spider|crawling/i.test(userAgent);

    if (isBot) {
      console.log('Bot detected, no popup.');
      return; // NICHT anzeigen
    }

    const timer = setTimeout(() => {
      setShowPopup(true);
    }, Math.random() * (30000 - 10000) + 10000); // 10-30 Sekunden zufällig

    return () => clearTimeout(timer);
  }, []);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      {/* Transparenter Hintergrund */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={() => setShowPopup(false)}
      ></div>

      {/* Popup-Box */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 z-50 animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Inhalt */}
        <h2 className="text-xl font-bold text-center text-primary-600 mb-2">
          🎉 Special {agentName} Deal!
        </h2>
        <p className="text-gray-700 text-center mb-4">
          Get a ¥3000 Coupon Bundle + 30% Off Shipping now!
        </p>

        <Link
          href={inviteURL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-primary-600 text-white font-semibold text-center rounded-full py-3 hover:bg-primary-700 transition"
        >
          🎁 Claim Your Bonus
        </Link>

        <p className="text-xs text-gray-400 text-center mt-4">
          Limited time only. Terms apply.
        </p>
      </div>
    </div>
  );
}
