'use client';

import { useState } from 'react';
import { Send, Check, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HeroContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and Email are required');
      return;
    }
    setSending(true);
    try {
      await fetch('/api/lead/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message || 'Contact form inquiry from hero section',
          source: 'hero-contact-form',
        }),
      });
    } catch {}
    setSending(false);
    setSubmitted(true);
    toast.success('Message sent! We will respond within 24 hours.');
  };

  if (submitted) {
    return (
      <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-green-400" />
        </div>
        <p className="text-white font-semibold text-sm">Thank You!</p>
        <p className="text-white/60 text-xs mt-1">We will get back to you within 24 hours.</p>
        <p className="text-white/40 text-[10px] mt-3">
          Meanwhile, call us at <a href="tel:+919354764587" className="text-[#818CF8] hover:underline">+91 9354764587</a>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Quick Contact</span>
      </div>
      <p className="text-white/50 text-[11px] mb-4 leading-relaxed">
        Need a part urgently? Drop your details and we&apos;ll call you back.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Your Name *" required
            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] transition-all" />
          <input type="tel" value={form.phone} onChange={handleChange('phone')} placeholder="Phone"
            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] transition-all" />
        </div>
        <input type="email" value={form.email} onChange={handleChange('email')} placeholder="Email Address *" required
          className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] transition-all" />
        <textarea value={form.message} onChange={handleChange('message')} placeholder="Part number or details..."
          rows={2}
          className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] transition-all resize-none" />
        <button type="submit" disabled={sending}
          className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs py-3 rounded-xl transition-all disabled:opacity-60">
          {sending ? 'Sending...' : 'Send Message'}
          {!sending && <Send className="w-3 h-3" />}
        </button>
      </form>
      <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-white/40">
        <a href="tel:+919354764587" className="flex items-center gap-1 hover:text-white/60 transition-colors">
          <Phone className="w-3 h-3" /> Call
        </a>
        <a href="mailto:sales@aeroturbinespare.com" className="flex items-center gap-1 hover:text-white/60 transition-colors">
          <Mail className="w-3 h-3" /> Email
        </a>
      </div>
    </div>
  );
}
