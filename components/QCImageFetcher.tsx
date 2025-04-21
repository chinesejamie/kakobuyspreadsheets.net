'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
  Search,
  Image as ImageIcon,
  FileSearch,
  X,
  Calendar,
  Copy,
} from 'lucide-react';
import Image from 'next/image';

interface QCImage {
  image_url: string;
  product_name: string;
  qc_date: string;
}

export function QCImageFetcher() {
  const [goodsUrl, setGoodsUrl] = useState('');
  const [images, setImages] = useState<QCImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'info' | 'error' | 'warning' | 'success'>('info');
  const [selectedImage, setSelectedImage] = useState<QCImage | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchImages = async () => {
    if (!goodsUrl.trim().startsWith('http')) {
      setStatusMessage('Please enter a valid URL starting with http');
      setStatusType('warning');
      return;
    }

    setLoading(true);
    setImages([]);
    setStatusMessage('');
    setSearchAttempted(true);

    try {
      const response = await fetch('/api/qc-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goodsUrl }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setImages(data.data || []);
        if (data.data.length === 0) {
          setStatusMessage('No QC images found.');
          setStatusType('info');
        }
      } else {
        setStatusMessage(data.message || 'No QC images found.');
        setStatusType('error');
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('Failed to fetch QC images.');
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kakobuy QC Image Verification Tool</h1>
      </div>

      {/* Explanation */}
      <section className="bg-blue-50/30 p-6 rounded-xl border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">What is Kakobuy QC Verification?</h2>
        <p className="text-gray-600 mb-4">
          The Kakobuy QC Image Checker allows customers to review quality control documentation for their purchases.
        </p>
        <div className="grid gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Official Kakobuy quality assurance records
          </div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Historical QC images archive
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
            Verified product authentication
          </div>
        </div>
      </section>

      {/* Input Field */}
      <section>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={goodsUrl}
              onChange={(e) => setGoodsUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchImages()}
              placeholder="Enter Kakobuy Product URL"
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 border-0 ring-1 ring-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400 bg-gray-50 transition-all duration-200 outline-none"
            />
          </div>
          <button
            onClick={fetchImages}
            disabled={loading || !goodsUrl}
            className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 font-medium transition"
          >
            {loading ? <Search className="w-5 h-5 animate-spin" /> : 'Verify Kakobuy QC'}
          </button>
        </div>
      </section>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-lg border flex items-center gap-3 ${
            statusType === 'error'
              ? 'bg-red-50/50 border-red-200'
              : statusType === 'warning'
              ? 'bg-amber-50/50 border-amber-200'
              : 'bg-blue-50/50 border-blue-200'
          }`}
        >
          {statusType === 'error' ? (
            <XCircle className="w-5 h-5 text-red-500" />
          ) : statusType === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          ) : (
            <Info className="w-5 h-5 text-blue-500" />
          )}
          <p className="text-sm">{statusMessage}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64 rounded-xl bg-gray-50/50">
          <div className="text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600 text-sm">Gathering QC images...</p>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {!loading && images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-[4/3]">
                <Image
                  src={image.image_url}
                  alt={`QC for ${image.product_name}`}
                  width={400}
                  height={300}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 text-sm mb-1.5 line-clamp-2">{image.product_name}</h3>
                <p className="text-xs text-gray-500 font-medium">
                  QC Date: {new Date(image.qc_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !images.length && searchAttempted && (
        <div className="text-center py-16 rounded-xl bg-gray-50/50">
          <FileSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">No QC images available</h2>
          <p className="text-gray-500 text-sm mb-4">
            Enter a valid Kakobuy product URL to find QC images.
          </p>
        </div>
      )}

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition shadow-sm"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <div className="max-h-[85vh] overflow-auto">
              <Image
                src={selectedImage.image_url}
                alt={`QC image for ${selectedImage.product_name}`}
                width={1000}
                height={750}
                className="w-full object-contain"
              />
              <div className="p-6 border-t flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{selectedImage.product_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(selectedImage.qc_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(selectedImage.image_url)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2 transition"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QCImageFetcher;
