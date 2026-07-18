'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  unoptimized?: boolean;
  width?: number;
  height?: number;
}

export default function SafeImage({ src, alt, fill, className, unoptimized = true, width, height }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        unoptimized={unoptimized}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      unoptimized={unoptimized}
      onError={() => setHasError(true)}
    />
  );
}
