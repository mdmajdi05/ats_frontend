'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'What certifications do your aerospace parts carry?',
    answer:
      'All parts are sourced from ISO 9001 and AS9120B certified suppliers. We provide full traceability including 8130-3 tags, certificates of conformance (COCs), and material certifications upon request. Every order undergoes 100% inspection before dispatch.',
  },
  {
    question: 'How fast can I get a quote?',
    answer:
      'Our standard quote response time is under 24 hours. For AOG (Aircraft on Ground) urgent requests, we prioritize within 4 hours. Simply submit your RFQ with the required part number, NSN, or description and our team will respond promptly.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes, we ship to over 150 countries worldwide. We handle all logistics including export documentation, customs clearance, and Incoterms management. Our global logistics network ensures reliable delivery whether you are in North America, Europe, Asia, or the Middle East.',
  },
  {
    question: 'What is a CAGE code and why is it important?',
    answer:
      'A CAGE (Commercial and Government Entity) code is a unique identifier assigned to suppliers by the Department of Defense. It is essential for tracking and verifying aerospace and defense parts. All our parts are cross-referenced by CAGE code to ensure authenticity and compliance with military standards.',
  },
  {
    question: 'How do you ensure parts are counterfeit-free?',
    answer:
      'We maintain a strict Zero Counterfeit Policy. Our quality assurance process includes supplier qualification audits, incoming inspection, dimensional verification, and chain-of-custody documentation. We also use advanced testing methods when required to verify material composition and authenticity.',
  },
  {
    question: 'Can you source hard-to-find or obsolete parts?',
    answer:
      'Absolutely. We specialize in sourcing hard-to-find, obsolete, and legacy components for both commercial and military aircraft. Our extensive global supplier network and deep industry relationships allow us to locate parts that other distributors cannot find.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-[#F8F9FF]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#4F46E5] text-sm font-semibold uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-[#4F46E5]" /> FAQ
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-[#4A4A6A]/80">
              Quick answers to common questions about sourcing aerospace parts.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[#E8EDF2] overflow-hidden transition-shadow hover:shadow-sm"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-[#0A1628] text-sm sm:text-base pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#4F46E5] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <p className="px-6 pb-5 text-sm text-[#4A4A6A]/80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
