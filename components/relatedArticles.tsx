import React from 'react';
import { CreditCard, Shield, DollarSign } from 'lucide-react';

export default function RelatedArticles() {
  // Default articles if none provided
  const defaultArticles = [
    {
      id: 1,
      icon: <CreditCard className="w-12 h-12 text-gray-400" />,
      title: "Top 5 Agent Services Compared for 2024",
      description: "See how KakoBuy stacks up against other leading services in our comprehensive comparison.",
      link: "#"
    },
    {
      id: 2,
      icon: <Shield className="w-12 h-12 text-gray-400" />,
      title: "How to Spot Fake Products When Buying Through Agents",
      description: "Essential tips for ensuring authenticity when shopping internationally through agent services.",
      link: "#"
    },
    {
      id: 3,
      icon: <DollarSign className="w-12 h-12 text-gray-400" />,
      title: "Understanding Shipping and Customs Fees for International Orders",
      description: "Avoid surprise costs with our complete guide to international shipping and customs charges.",
      link: "#"
    }
  ];


  return (
    <div className="border-t border-gray-200 pt-10 mt-10">
      <h2 className="text-2xl font-bold mb-6">Related Articles You Might Find Helpful</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {defaultArticles.map(article => (
          <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100">
            <div className="bg-gray-100 h-40 flex items-center justify-center">
              {article.icon}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-3">{article.description}</p>
              <a href={article.link} className="text-blue-600 hover:text-blue-800 font-medium">
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}