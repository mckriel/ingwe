'use client';

import { useState } from "react";
import Image from "next/image";
import { Swiper as SwiperClass } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface PropertyImageGalleryProps {
    images: string[];
}


export default function PropertyImageGallery({ images }: PropertyImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  // Filter out any empty or invalid image URLs
  const validImages = images?.filter(img => img && img.trim() !== "") || [];
  
  if (validImages.length === 0) {
    return null;
  }

  return (
    <div className="max-w-screen-lg mx-auto my-8">
      {/* Main carousel */}
      <Swiper
        modules={[Navigation, Thumbs]}
        navigation
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        className="mb-4"
      >
        {validImages.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full aspect-video">
              <Image
                src={src}
                alt={`Property image ${idx + 1}`}
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
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail carousel */}
      <Swiper
        modules={[Navigation, Thumbs]}
        onSwiper={setThumbsSwiper}
        slidesPerView={Math.min(validImages.length, 5)}
        spaceBetween={10}
        watchSlidesProgress
      >
        {validImages.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full aspect-video cursor-pointer">
              <Image
                src={src}
                alt={`Thumbnail ${idx + 1}`}
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
