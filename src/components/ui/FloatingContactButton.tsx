'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Mail, X } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function FloatingContactButton() {
  const [showMenu, setShowMenu] = useState(false);
  const [visible, setVisible] = useState(false);
  const { config } = useSiteConfig();

  const phonePrimary  = config.contactPhonePrimary  || '';
  const phoneWhatsapp = config.chat?.whatsappNumber || '';

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="flex flex-col items-end gap-3">
      {showMenu && (
        <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-4 duration-200">
          {phonePrimary && (
            <a
              href={`tel:+${phonePrimary.replace(/\D/g, '')}`}
              className="flex items-center gap-3 bg-[#0A1628] shadow-lg rounded-full pl-4 pr-5 py-3 hover:shadow-xl transition-all group"
            >
              <Phone className="w-5 h-5 text-white" />
              <span className="text-sm font-semibold text-white">Call {phonePrimary}</span>
            </a>
          )}
          {phoneWhatsapp && (
            <a
              href={`https://wa.me/${phoneWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hello! I need help with aerospace parts.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] shadow-lg rounded-full pl-4 pr-5 py-3 hover:shadow-xl transition-all group"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="text-sm font-semibold text-white">WhatsApp</span>
            </a>
          )}
          <a
            href="mailto:sales@aeroturbinespare.com?subject=Gas%20Turbine%20Parts%20Inquiry&body=Hi%20AeroTurbineSpare%20Team%2C%0A%0AI%20need%20a%20quote%20for%3A%0A%0APart%20Number%3A%0AQuantity%3A%0A%0AThank%20you."
            className="flex items-center gap-3 bg-[#4F46E5] shadow-lg rounded-full pl-4 pr-5 py-3 hover:shadow-xl transition-all group"
          >
            <Mail className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">Send Email</span>
          </a>
        </div>
      )}

      <button
        onClick={() => setShowMenu((v) => !v)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 ${
          showMenu ? 'bg-gray-800 rotate-45' : 'bg-[#4F46E5] hover:bg-[#4338CA]'
        }`}
        aria-label={showMenu ? 'Close contact menu' : 'Contact us'}
      >
        {showMenu ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
