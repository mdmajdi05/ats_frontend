'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Check, ChevronLeft, MessageCircle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuickContactDrawer() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActionRef = useRef(Date.now());

  useEffect(() => {
    if (!open) return;
    const check = () => {
      if (Date.now() - lastActionRef.current > 600000) {
        setOpen(false);
      }
    };
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [open]);

  const resetInactivity = () => {
    lastActionRef.current = Date.now();
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    resetInactivity();
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and Email are required');
      return;
    }
    setSending(true);
    resetInactivity();
    try {
      await fetch('/api/lead/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quick-contact',
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message || 'Quick contact inquiry',
          source: 'quick-contact-drawer',
        }),
      });
    } catch {}
    setSending(false);
    setSubmitted(true);
    toast.success('Message sent! We will respond within 24 hours.');
    setTimeout(() => { setOpen(false); setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }, 4000);
  };

  const handleClose = () => {
    setOpen(false);
    setDismissed(true);
    setTimeout(() => setDismissed(false), 60000);
  };

  if (dismissed) return null;

  return (
    <>
      {/* Tab trigger */}
      {!open && (
        <button
          onClick={() => { setOpen(true); resetInactivity(); }}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-[9997] flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold px-3 py-4 rounded-l-xl shadow-xl transition-all hover:pr-4 group"
          aria-label="Quick Contact"
        >
          <span className="writing-mode-vertical text-[10px] uppercase tracking-widest [writing-mode:vertical-rl]">
            Quick Contact
          </span>
          <ChevronLeft className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />

          {/* Drawer panel */}
          <div className="relative w-full max-w-sm bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300" onClick={resetInactivity}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-semibold text-gray-900 text-sm">Quick Contact</span>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" aria-label="Close">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 mb-1">Thank You!</p>
                  <p className="text-sm text-gray-500 mb-6">We have received your message and will get back to you within 24 hours.</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="animate-pulse">Closing automatically...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm text-gray-600">Need a quote or have a question? Fill in the form and we&apos;ll get back to you within 24 hours.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Your Name *" required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all" />
                    <input type="email" value={form.email} onChange={handleChange('email')} placeholder="Email Address *" required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all" />
                    <input type="tel" value={form.phone} onChange={handleChange('phone')} placeholder="Phone Number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all" />
                    <textarea value={form.message} onChange={handleChange('message')} placeholder="Part number, quantity, or any details..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all resize-none" />
                    <button type="submit" disabled={sending}
                      className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-[#4F46E5]/20">
                      {sending ? 'Sending...' : 'Send Message'}
                      {!sending && <Send className="w-4 h-4" />}
                    </button>
                  </form>

                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Or reach us directly</p>
                    <a href="tel:+919354764587" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#4F46E5] transition-colors">
                      <Phone className="w-4 h-4 text-green-500" /> +91 9354764587
                    </a>
                    <a href="https://wa.me/919354764587?text=Hi%20AeroTurbineSpare!%20I%20need%20a%20quote%20for%20gas%20turbine%20parts." target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#25D366] transition-colors">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" /> Chat on WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
