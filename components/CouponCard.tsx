'use client';

import { useState } from 'react';
import { Clock, ShoppingCart } from 'lucide-react';

export default function CouponCard({ code, discount, expiry, minPurchase }: { code: string, discount: string, expiry: string, minPurchase?: number }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-dashed border-blue-500 relative overflow-hidden animate-fade-in-up">
      <div className="absolute -right-4 -top-4 bg-blue-500 text-white text-xs px-8 py-1 rotate-45">
        {discount}
      </div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{code}</h3>
        <button 
          onClick={copyToClipboard}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-md text-sm transition-colors duration-200"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p className="flex items-center">
          <Clock size={14} className="inline mr-1" /> 
          Expires: {expiry}
        </p>
        {minPurchase && (
          <p className="flex items-center">
            <ShoppingCart size={14} className="inline mr-1" /> 
            Min purchase: ${minPurchase}
          </p>
        )}
      </div>
    </div>
  );
}
