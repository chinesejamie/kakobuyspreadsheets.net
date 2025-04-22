'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  creatorName: string;
  productId: string;
  href: string;
}

export default function BuyNowButton({ creatorName, productId, href }: Props) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  
    // 1) Immediately open the link (before any await)
    const newWindow = window.open(href, '_blank');
    if (newWindow) {
      newWindow.focus();
    }
    
    // 2) Then asynchronously update the server
    fetch('/api/products/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creatorName, productId }),
    }).catch(console.error);
  
    // 3) Optional: refresh local cache
    router.refresh();
  };
  
    

  return (
    <a
      href={href}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-3 px-8 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
    >
      View on KakoBuy
      <ArrowUpRight size={18} />
    </a>
  );
}