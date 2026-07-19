'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Mail } from 'lucide-react';

export default function FloatingContactButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-3">
      <a
        href="https://wa.me/919354764587?text=Hi%20AeroTurbineSpare!%20I%20need%20a%20quote%20for%20gas%20turbine%20parts."
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center hover:shadow-2xl hover:scale-110 transition-all duration-200"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
      <a
        href="mailto:sales@aeroturbinespare.com?subject=Gas%20Turbine%20Parts%20Inquiry&body=Hi%20AeroTurbineSpare%20Team%2C%0A%0AI%20need%20a%20quote%20for%3A%0A%0APart%20Number%3A%0AQuantity%3A%0A%0AThank%20you."
        className="w-14 h-14 rounded-full bg-[#4F46E5] shadow-xl flex items-center justify-center hover:shadow-2xl hover:scale-110 hover:bg-[#4338CA] transition-all duration-200"
        aria-label="Send email"
      >
        <Mail className="w-7 h-7 text-white" />
      </a>
    </div>
  );
}
