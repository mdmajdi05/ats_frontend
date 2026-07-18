'use client';

import Image from 'next/image';
import { useState } from 'react';

type GalleryImage = {
  src: string;
  alt: string;
};

type ZigZagGalleryProps = {
  images: [GalleryImage, GalleryImage];
};

export default function ZigZagGallery({ images }: ZigZagGalleryProps) {
  const [errors, setErrors] = useState([false, false]);

  return (
    <div className="zigzag-gallery">
      {!errors[0] && (
        <Image
          src={images[0].src}
          alt={images[0].alt}
          width={800}
          height={600}
          className="w-full h-auto"
          loading="lazy"
          unoptimized
          onError={() => setErrors((prev) => [true, prev[1]])}
        />
      )}
      {!errors[1] && (
        <Image
          src={images[1].src}
          alt={images[1].alt}
          width={800}
          height={600}
          className="w-full h-auto"
          loading="lazy"
          unoptimized
          onError={() => setErrors((prev) => [prev[0], true])}
        />
      )}
    </div>
  );
}
