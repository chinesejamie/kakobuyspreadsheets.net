import React from 'react';
import QCImageFetcher from '@/components/QCImageFetcher';
import QCFaq from '@/components/QCFaq';
import { Metadata } from 'next'; // Add this import

export const metadata: Metadata = {
  title: 'KakoBuy QC Image Checker | Official Quality Control Verification',
  description: 'Verify Kakobuy product quality with official QC images. Access historical quality control records and inspection photos.',
  other: {
    'script:ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does the Kakobuy QC verification work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our system cross-references Kakobuy product URLs with our quality control database, providing access to original inspection images and documentation."
          }
        },
        {
          "@type": "Question",
          "name": "Are Kakobuy QC images available for all products?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We maintain QC records for all Kakobuy products that have undergone quality inspection. Some newer items may take 24-48 hours for records to become available."
          }
        }
      ]
    })
  }
};

export default function QCImagesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm p-6 sm:p-8">
        <React.Suspense fallback={<div>Loading QC Image Tool...</div>}>
          <QCImageFetcher />
        </React.Suspense>
        <QCFaq />
      </div>
    </div>
  );
}