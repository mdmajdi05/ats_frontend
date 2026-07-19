'use client';

import { useState, useEffect } from 'react';
import { X, Download, Clock, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'lead_magnet_shown';

export default function LeadMagnetPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const already = sessionStorage.getItem(STORAGE_KEY);
    if (already) return;

    const timer = setTimeout(() => {
      setVisible(true);
      setDismissed(false);
    }, 60000);

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
            phone,
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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] flex items-center justify-center mb-4">
              <Clock className="w-7 h-7 text-[#4F46E5]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Still Looking for Parts?</h3>
            <p className="text-gray-500 text-xs mb-4">
              We can help you find exactly what you need — fast.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Full Name" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all" />
              <div className="grid grid-cols-2 gap-3">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all" />
              </div>
              <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#4338CA] hover:to-[#3730A3] text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-[#4F46E5]/25">
                {sending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>Get Instant Help <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Average response: 2.3 hours
              </span>
              <span>No spam guarantee</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
