// components/GiveawayForm.tsx
'use client';

import { useState } from 'react';

export function GiveawayForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/giveaway-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ message: data.message, isError: false });
        setEmail('');
      } else {
        setStatus({ message: data.message, isError: true });
      }
    } catch (err) {
      setStatus({ message: 'Submission failed. Bitte versuche es erneut.', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        name="email"
        type="email"
        required
        placeholder="Your email address"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Submitting…' : 'Enter Giveaway'}
      </button>
      {status && (
        <p className={`mt-2 text-center ${status.isError ? 'text-red-600' : 'text-green-600'}`}>
          {status.message}
        </p>
      )}
    </form>
  );
}
