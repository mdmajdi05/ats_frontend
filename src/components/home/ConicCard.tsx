import React, { type ReactNode } from 'react';

type ConicCardProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  badge?: string;
  cta?: ReactNode;
  className?: string;
};

function ConicCardComponent({ title, description, children, badge, cta, className = '' }: ConicCardProps) {
  return (
    <div className={`conic-card bg-[#0A1628] p-8 sm:p-10 text-white ${className}`}>
      {badge && (
        <span className="inline-block bg-[#4F46E5] text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-4 uppercase tracking-wider">
          {badge}
        </span>
      )}
      <h3 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">{title}</h3>
      {description && <p className="text-[#C0C9D5] text-sm leading-relaxed mb-6">{description}</p>}
      {children}
      {cta && <div className="mt-6">{cta}</div>}
    </div>
  );
}

export default React.memo(ConicCardComponent);
