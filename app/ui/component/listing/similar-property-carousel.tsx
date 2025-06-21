'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

interface SimilarProperty {
    id: string;
    title: string;
    image: string;
    price: string;
    beds: number;
    baths: number;
    size: number;
}

interface SimilarPropertyCarouselProps {
    properties: SimilarProperty[];
}

export default function SimilarPropertyCarousel({
    properties,
  }: SimilarPropertyCarouselProps) {
    const validProperties = properties?.filter(prop => 
      prop.image && prop.image.trim() !== "" && !prop.image.includes('/house1.jpeg')
    ) || [];
    
    if (validProperties.length === 0) return null;
  
    return (
      <section className="max-w-screen-xl mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-6">Similar Listings</h2>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1.2 },  // e.g., 1.2 slides at >=640px
            768: { slidesPerView: 2 },    // 2 slides at >=768px
            1024: { slidesPerView: 3 },   // 3 slides at >=1024px
          }}
        >
          {validProperties.map((prop) => (
            <SwiperSlide key={prop.id}>
              <div className="bg-white rounded-lg shadow overflow-hidden p-4">
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={prop.image}
                    alt={prop.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const slideElement = e.currentTarget.closest('.swiper-slide') as HTMLElement;
                      if (slideElement) {
                        slideElement.style.display = 'none';
                      }
                    }}
                  />
                  {/* Optional Contact Agent Badge */}
                  <div className="absolute top-2 left-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    Contact Agent
                  </div>
                </div>
  
                {/* Info */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{prop.title}</h3>
                  <span className="text-gray-700 font-medium">{prop.price}</span>
                </div>
  
                {/* Features: bed, bath, sqft */}
                <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                  {/* Beds */}
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 9.75h19.5m-19.5 0v9a1.5 1.5 0 001.5 1.5h1.5m16.5-10.5v9a1.5 1.5 0 01-1.5 1.5h-1.5m-9-3h6"
                      />
                    </svg>
                    <span>{prop.beds} bed</span>
                  </div>
                  {/* Baths */}
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10.5h18m-9 0V5.25m0 0h1.125a2.25 2.25 0 110 4.5H12m0-4.5H10.875a2.25 2.25 0 100 4.5H12m0 0v3"
                      />
                    </svg>
                    <span>{prop.baths} bath</span>
                  </div>
                  {/* Sqft */}
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 4.5l16.5 16.5m0-16.5L3.75 21"
                      />
                    </svg>
                    <span>{prop.size} sqft</span>
                  </div>
                </div>
  
                {/* Contact Agent Button (optional) */}
                <button className="bg-[#A3D92D] hover:bg-[#92c12a] text-white px-4 py-2 rounded-full">
                  Contact Agent
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  }