'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Settings, Circle, Wrench, Cpu, Activity, ArrowRight, Layers } from 'lucide-react';
import type { Category } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {
  zap: Zap, 
  settings: Settings, 
  circle: Circle,
  tool: Wrench, 
  cpu: Cpu, 
  activity: Activity,
  wrench: Wrench,
};

const CAT_IMAGES = [
  '/images/part-engine-1.jpg',
  '/images/part-landing-gear.jpg',
  '/images/part-controls.jpg',
  '/images/part-exhaust.jpg',
  '/images/part-fuselage.jpg',
  '/images/part-turbofan.jpg',
];

export default function FeaturedCategories({ categories }: { categories: Category[] }) {
  const featured = categories.slice(0, 6);
  
  // Total inventory parts count dynamically compute karne ke liye
  const totalParts = featured.reduce((acc, curr) => acc + (curr.partCount || 0), 0);

  return (
    <section className="relative py-20 lg:py-28 bg-[#fafcff] overflow-hidden isolate">
      {/* Absolute High-End Fluid Visuals */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-sky-200/30 via-indigo-100/20 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Futuristic Isometric Dot Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_at_top_left,black_60%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 z-10 text-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* LEFT SIDE PANEL: Dynamic Header & Sticky Control Vibe */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-indigo-600 text-[10px] font-extrabold uppercase tracking-widest mb-4 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" /> Precision Navigation
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.05] mb-4">
                Engineered <br />
                <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-slate-900 bg-clip-text text-transparent">Categories</span>
              </h2>
              <p className="text-slate-500 text-sm font-normal leading-relaxed max-w-sm">
                Structured specifically around turbine operator frameworks: search components via advanced systems, exact platforms, or discrete part groups instantly.
              </p>
            </div>

            {/* Unique Real-time Inventory Counter Widget */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-[0_10px_30px_rgba(148,163,184,0.08)] backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full transition-all duration-500 group-hover:scale-110 pointer-events-none" />
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Repository</span>
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {totalParts.toLocaleString()}+
              </div>
              <p className="text-xs text-slate-500 mt-1">Verified components active across core sets</p>
              
              <Link 
                href="/catalog" 
                className="mt-5 w-full inline-flex items-center justify-between text-xs font-bold text-white bg-slate-950 hover:bg-indigo-600 px-4 py-3 rounded-xl transition-all duration-300 group/btn shadow-md shadow-slate-950/10"
              >
                <span>View Full Grid System</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE PANEL: The Unique Stacked Slide Layout */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featured.map((cat, idx) => {
              const Icon = ICON_MAP[cat.icon] || Settings;
              return (
                <Link
                  key={cat.id}
                  href={`/catalog?fsg=${cat.fsg}`}
                  className="group relative flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(148,163,184,0.03)] hover:border-indigo-200 hover:shadow-[0_20px_35px_rgba(99,102,241,0.08)] transition-all duration-400 overflow-hidden min-h-[110px]"
                >
                  {/* Geometric Micro Graphic Accent */}
                  <div className="absolute right-[-20px] bottom-[-20px] w-28 h-28 bg-gradient-to-tr from-sky-500/[0.02] to-indigo-500/[0.04] rounded-full group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
                  
                  {/* Subtle Image Hint Strip on left border hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-slate-200 group-hover:bg-gradient-to-b group-hover:from-sky-500 group-hover:to-indigo-500 transition-all duration-300" />

                  {/* Micro Tech Blueprint Pattern inside hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-300">
                    <Image 
                      src={cat.imageUrl || CAT_IMAGES[idx % CAT_IMAGES.length]} 
                      alt={`${cat.name || 'Category'} - gas turbine parts`} 
                      fill
                      className="object-cover scale-110"
                      unoptimized
                    />
                  </div>

                  {/* Left Content Cluster */}
                  <div className="flex items-center gap-4 relative z-10 pl-2">
                    {/* Compact Structured Icon */}
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all duration-300 shrink-0">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-[14px] font-black text-slate-800 tracking-tight group-hover:text-slate-950 transition-colors duration-200 group-hover:translate-x-0.5 transition-transform">
                        {cat.name}
                      </h3>
                      {/* Technical Detail Label */}
                      <span className="inline-block text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                        FSG Group: {cat.fsg || '000'}
                      </span>
                    </div>
                  </div>

                  {/* Right Data Badge Component */}
                  <div className="flex flex-col items-end gap-1.5 relative z-10 shrink-0 text-right">
                    <span className="text-[13px] font-black text-slate-900 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl group-hover:bg-slate-950 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                      {cat.partCount.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Parts</span>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
