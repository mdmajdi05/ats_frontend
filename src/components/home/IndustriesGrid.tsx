'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Flame, Ship, Factory, Shield, Package, ArrowUpRight, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Industry } from '@/types';
import { request } from '@/lib/api-client';
import fallbackIndustries from '@/data/industries-fallback.json';
import type { ElementType } from 'react';

const INDUSTRY_ICONS: Record<string, ElementType> = {
  zap: Zap,
  flame: Flame,
  ship: Ship,
  factory: Factory,
  shield: Shield,
};

const INDUSTRY_IMAGES = [
  '/images/part-engine-1.jpg',
  '/images/part-landing-gear.jpg',
  '/images/part-controls.jpg',
  '/images/part-exhaust.jpg',
  '/images/part-fuselage.jpg',
  '/images/part-turbofan.jpg',
  '/images/part-propeller.jpg',
  '/images/part-cockpit.jpg',
];

export default function IndustriesGrid() {
  const [industries, setIndustries] = useState<Industry[]>(fallbackIndustries as unknown as Industry[]);

  useEffect(() => {
    (async () => {
      try {
        const res = await request<{ success: boolean; data: Industry[] }>('/industries');
        if (res?.data?.length) setIndustries(res.data);
      } catch { /* keep fallback */ }
    })();
  }, []);

  return (
    <section className="relative py-20 sm:py-28 bg-[#f4f8fc] overflow-hidden text-slate-800 antialiased">
      
      {/* Dynamic Cyber Ambient Glow Effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.15)_0%,_transparent_65%)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.1)_0%,_transparent_65%)] blur-[100px] pointer-events-none" />
      
      {/* High-Tech Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2ecf5_1px,transparent_1px),linear-gradient(to_bottom,#e2ecf5_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_80%,transparent_100%)]" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="max-w-3xl mb-14 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-600 text-[11px] font-black uppercase tracking-wider mb-4 shadow-xs">
            <Target className="w-3.5 h-3.5" /> Sectors & Global Scope
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] text-slate-900">
            Industries <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">We Power Ahead</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 font-normal leading-relaxed max-w-xl">
            Wherever a critical turbine spins, we deliver. From baseline heavy stations to high-stress offshore setups, we provide precision components.
          </p>
        </div>

        {/* ================= ASYMMETRIC BENTO GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-[240px]">
          {industries.slice(0, 7).map((ind, idx) => {
            const Icon = (ind.icon && INDUSTRY_ICONS[ind.icon]) || Package;
            const bgImage = INDUSTRY_IMAGES[idx % INDUSTRY_IMAGES.length];
            
            // Premium layout row/column span system
            const gridSpans = [
              'lg:col-span-5 lg:row-span-2 h-full', 
              'lg:col-span-4 h-full',               
              'lg:col-span-3 h-full',               
              'lg:col-span-3 h-full',               
              'lg:col-span-4 h-full',               
              'lg:col-span-3 h-full',               
              'lg:col-span-4 h-full',               
            ];

            const currentSpan = gridSpans[idx % gridSpans.length];

            return (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className={cn(
                  "group relative flex flex-col justify-between p-6 rounded-3xl overflow-hidden border border-slate-200 bg-white transition-all duration-500 ease-out shadow-[0_4px_20px_rgba(163,191,222,0.2)] hover:border-blue-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(37,99,235,0.18)]",
                  currentSpan
                )}
              >
                {/* 100% CLEAR IMAGE LAYER (No Grayscale, Strong Contrast Gradient) */}
                <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-105">
                  <img
                    src={bgImage}
                    alt={ind.name}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    loading="lazy"
                  />
                  {/* High contrast mask: Bottom text area remains sharp, top stays bright */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-black/10 transition-opacity duration-500 group-hover:opacity-95" />
                </div>

                {/* TOP ACTIONS LAYER */}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  {/* Glowing Icon Container */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/95 border border-slate-200 shadow-sm group-hover:bg-blue-600 group-hover:border-transparent group-hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-300">
                    <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-200" />
                  </div>

                  {/* High-Visibility Parts Badge */}
                  {ind.partCount != null && (
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-400 text-slate-950 font-mono text-xs font-black tracking-wide shadow-sm group-hover:bg-white group-hover:text-blue-600 transition-all duration-300">
                      {ind.partCount.toLocaleString()} Pts
                    </span>
                  )}
                </div>

                {/* BOTTOM BLOCK: Super Vibrant Text visibility over Dark Mask */}
                <div className="relative z-10 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={cn(
                      "font-black tracking-wide text-white group-hover:text-cyan-300 transition-colors duration-200",
                      idx % 7 === 0 ? "text-xl sm:text-2xl" : "text-base"
                    )}>
                      {ind.name}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-cyan-400 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                  <p className="text-[12px] text-slate-300 font-medium leading-relaxed line-clamp-1 group-hover:text-white transition-colors duration-300">
                    Precision infrastructure & system modules.
                  </p>
                </div>

                {/* Cyber Bottom Glowing Edge Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}