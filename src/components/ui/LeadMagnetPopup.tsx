'use client';

import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

const STORAGE_KEY = 'lead_magnet_shown';

export default function LeadMagnetPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const already = sessionStorage.getItem(STORAGE_KEY);
    if (already) return;

    const timer = setTimeout(() => {
      setVisible(true);
      setDismissed(false);
    }, 25000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);

    try {
      await fetch('/api/lead/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'catalog-download',
          name,
          email,
          source: 'lead-magnet-popup',
          message: 'Requested Parts Catalog Download',
        }),
      });
    } catch {}

    setSending(false);
    setSent(true);
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setTimeout(() => { setVisible(false); setDismissed(true); }, 3000);
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-300">
        <button onClick={handleDismiss} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" aria-label="Close">
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {sent ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Inbox!</h3>
            <p className="text-gray-600 text-sm">
              We&apos;ve sent the complete parts catalog to <strong>{email}</strong>. A specialist will also follow up with pricing.
            </p>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-4">
              <Download className="w-7 h-7 text-[#4F46E5]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Get Our Complete Parts Catalog</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              5M+ parts across GE, Siemens, Rolls-Royce &amp; Solar Turbines. Enter your email and we&apos;ll send you the full catalog with current pricing.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address *" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all" />
              <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60">
                {sending ? 'Sending...' : 'Send Me the Catalog'}
              </button>
            </form>
            <p className="text-xs text-gray-400 text-center mt-4">
              No spam. Unsubscribe anytime. We respect your inbox.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
