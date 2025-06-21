'use client';

import { useState } from "react";
import Image from "next/image";
import { Swiper as SwiperClass } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import PropertyImageModal from "./property-image-modal";

interface PropertyImageGalleryProps {
    images: string[];
}

export default function PropertyImageGallery({ images }: PropertyImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [modal_image_index, set_modal_image_index] = useState(0);

  // Pre-filter valid images - only do static filtering, no dynamic removal
  const valid_images = images?.filter(img => 
    img && 
    img.trim() !== "" && 
    !img.includes('/house1.jpeg') && 
    !img.includes('house1.jpeg')
  ) || [];
  
  const open_modal = (imageIndex: number) => {
    set_modal_image_index(imageIndex);
    set_is_modal_open(true);
  };

  const close_modal = () => {
    set_is_modal_open(false);
  };

  if (valid_images.length === 0) {
    return null;
  }

  return (
    <div className="my-8 relative">
      <style jsx global>{`
        .property-gallery .swiper-button-next,
        .property-gallery .swiper-button-prev {
          display: none;
        }
      `}</style>
      <Swiper
        modules={[Thumbs]}
        onSwiper={setMainSwiper}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        slidesPerView={1}
        spaceBetween={0}
        allowTouchMove={true}
        loop={false}
        className="mb-4 property-gallery relative"
      >
        {valid_images.map((src, idx) => (
          <SwiperSlide key={`main-${src}-${idx}`}>
            <div 
              className="relative w-full aspect-video cursor-pointer"
              onClick={() => open_modal(idx)}
            >
              <Image
                src={src}
                alt={`Property image ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                className="object-cover rounded-3xl hover:opacity-90 transition-opacity"
                onError={(e) => {
                  // Instead of hiding, just show a placeholder or do nothing
                  console.warn('Failed to load image:', src);
                }}
              />
            </div>
          </SwiperSlide>
        ))}
        
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div 
        className="swiper-button-prev-custom absolute -left-8 top-1/2 transform -translate-y-1/2 z-50 w-16 h-16 bg-[#D1DA68] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#C5CE5F] transition-colors"
        onClick={() => mainSwiper?.slidePrev()}
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <div 
        className="swiper-button-next-custom absolute -right-8 top-1/2 transform -translate-y-1/2 z-50 w-16 h-16 bg-[#D1DA68] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#C5CE5F] transition-colors"
        onClick={() => mainSwiper?.slideNext()}
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        slidesPerView={Math.min(valid_images.length, 5)}
        spaceBetween={10}
        watchSlidesProgress
      >
        {valid_images.map((src, idx) => (
          <SwiperSlide key={`thumb-${src}-${idx}`}>
            <div 
              className="relative w-full aspect-video cursor-pointer"
              onClick={() => open_modal(idx)}
            >
              <Image
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="20vw"
                className="object-cover rounded-3xl hover:opacity-90 transition-opacity"
                onError={(e) => {
                  // Instead of hiding, just show a placeholder or do nothing
                  console.warn('Failed to load thumbnail:', src);
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Image Modal */}
      <PropertyImageModal
        images={valid_images}
        isOpen={is_modal_open}
        onClose={close_modal}
        initialImageIndex={modal_image_index}
      />
    </div>
  );
}