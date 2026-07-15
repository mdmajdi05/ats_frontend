import {
  ShieldCheck, Clock, Award, Truck, FileCheck,
  HeadphonesIcon, Search, Globe,
} from 'lucide-react';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'ISO 9001 & AS9120 Certified',
    desc: 'Independently audited quality management systems. Every part fully traceable with complete documentation.',
  },
  {
    icon: Clock,
    title: '24-Hour Quote Guarantee',
    desc: 'Every RFQ receives a competitive quote within 24 business hours. AOG requests prioritized for 4-hour response.',
  },
  {
    icon: Award,
    title: 'Zero Counterfeit Policy',
    desc: 'AS5553 and AS6174 compliant anti-counterfeit program. 100% incoming inspection on all parts.',
  },
  {
    icon: Truck,
    title: 'Global Shipping Network',
    desc: 'Ships to 150+ countries with full export compliance. ITAR documentation handled in-house.',
  },
  {
    icon: Search,
    title: 'Hard-to-Find Parts Specialists',
    desc: 'We source legacy military, obsolete commercial, and hard-to-find components that other distributors cannot locate.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Account Manager',
    desc: 'Every client gets a dedicated procurement professional who knows your requirements and fleet profile.',
  },
  {
    icon: Globe,
    title: '1,200+ OEM Partners',
    desc: 'Global network of certified manufacturers and authorized distributors providing competitive pricing.',
  },
  {
    icon: FileCheck,
    title: 'Full Traceability',
    desc: '8130-3 tags, COCs, material certifications, and chain-of-custody documentation with every shipment.',
  },
];

export default function WhyUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-brand text-sm font-semibold uppercase tracking-wider mb-3">
            <span className="w-6 h-px bg-brand" /> Why AeroTurbineSpare <span className="w-6 h-px bg-brand" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-text">
            Built for Aerospace Procurement Professionals
          </h2>
          <p className="text-text-muted mt-3 max-w-2xl mx-auto">
            We combine deep industry expertise with rigorous quality processes to deliver parts you can trust — every time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group bg-bg border border-silver rounded-2xl p-6 hover:bg-white hover:border-orange/20 hover:shadow-xl card-lift transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-orange/10 flex items-center justify-center mb-4 group-hover:bg-orange group-hover:text-white transition-all duration-300 icon-glow-hover">
                  <Icon className="w-5.5 h-5.5 text-orange group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-text mb-2">{f.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
