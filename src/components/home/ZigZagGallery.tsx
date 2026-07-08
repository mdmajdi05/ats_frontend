type GalleryImage = {
  src: string;
  alt: string;
};

type ZigZagGalleryProps = {
  images: [GalleryImage, GalleryImage];
};

export default function ZigZagGallery({ images }: ZigZagGalleryProps) {
  return (
    <div className="zigzag-gallery">
      <img src={images[0].src} alt={images[0].alt} loading="lazy" />
      <img src={images[1].src} alt={images[1].alt} loading="lazy" />
    </div>
  );
}
