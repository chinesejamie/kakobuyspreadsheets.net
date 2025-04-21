'use client';

import React from 'react';

export function QCFaq() {
  const faqs = [
    {
      question: 'How does the Kakobuy QC verification work?',
      answer: 'Our system cross-references Kakobuy product URLs with our quality control database, providing access to original inspection images and documentation.',
    },
    {
      question: 'Are Kakobuy QC images available for all products?',
      answer: 'We maintain QC records for all Kakobuy products that have undergone quality inspection. Some newer items may take 24-48 hours for records to become available.',
    },
  ];

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Kakobuy QC Checker FAQs</h2>
      <div className="space-y-6 mb-6">
        {faqs.map((faq, index) => (
          <div key={index} className="p-5 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900">{faq.question}</h3>
            <p className="mt-2 text-gray-600 text-sm">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default QCFaq;
