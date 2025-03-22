import Image from 'next/image';
import React from 'react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
    return (
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main image */}
          <div className="relative w-full h-64 md:h-auto aspect-video">
            <Image
              src={images[0]}
              alt={title}
              fill
              className="object-cover rounded-md"
            />
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-2 gap-2">
            {images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative w-full h-32 md:h-auto aspect-video">
                <Image
                  src={img}
                  alt={`Image ${idx + 2}`}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}
