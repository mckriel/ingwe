import Image from 'next/image';
import React from 'react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
    // Make sure we have valid images
    const validImages = images.filter(img => img && img.trim() !== "");
    
    // Use a fallback if no valid images are available
    const mainImage = validImages.length > 0 ? validImages[0] : "/house1.jpeg";
    
    return (
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main image */}
          <div className="relative w-full h-64 md:h-auto aspect-video">
            <Image
              src={mainImage}
              alt={title}
              fill
              className="object-cover rounded-md"
              onError={(e) => {
                // Replace with fallback image on error
                const imgElement = e.target as HTMLImageElement;
                imgElement.src = "/house1.jpeg";
                // Using fallback image
              }}
            />
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-2 gap-2">
            {validImages.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative w-full h-32 md:h-auto aspect-video">
                <Image
                  src={img}
                  alt={`Image ${idx + 2}`}
                  fill
                  className="object-cover rounded-md"
                  onError={(e) => {
                    // Replace with fallback image on error
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.src = "/house1.jpeg";
                    // Using fallback image
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}
