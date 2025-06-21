'use client';

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";

interface Property {
  id: string;
  image: string;
  title: string;
  price: string;
  beds: number;
  baths: number;
  size: number;
  locationString: string;
}

interface OtherListingsProps {
  current_property_id?: string;
  location?: string;
}

export default function OtherListings({ current_property_id, location }: OtherListingsProps) {
  const [properties, set_properties] = useState<Property[]>([]);
  const [loading, set_loading] = useState(true);
  const [swiper_instance, set_swiper_instance] = useState<SwiperClass | null>(null);
  const [active_slide_index, set_active_slide_index] = useState(1);

  useEffect(() => {
    const fetch_other_listings = async () => {
      try {
        set_loading(true);
        
        // Import the action here to avoid potential SSR issues
        const { get_formatted_properties } = await import("@/app/actions/property-actions");
        
        const data = await get_formatted_properties({
          limit: 12, // Fetch more properties to ensure we have enough after filtering
          site: 217, // Filter for Ingwe properties
        });

        // Filter out the current property and limit to 6-8 properties
        const filtered_properties = data
          .filter((prop: any) => prop.id?.toString() !== current_property_id)
          .slice(0, 8)
          .map((prop: any) => ({
            id: prop.id?.toString() || '',
            image: prop.image || '',
            title: prop.title || 'Property',
            price: prop.price || 'Price on application',
            beds: prop.beds || 0,
            baths: prop.baths || 0,
            size: prop.size || 0,
            locationString: prop.locationString || 'Unknown Location',
          }));

        set_properties(filtered_properties);
      } catch (error) {
        console.error('Failed to fetch other listings:', error);
      } finally {
        set_loading(false);
      }
    };

    fetch_other_listings();
  }, [current_property_id, location]);

  if (loading) {
    return (
      <section className="mt-32">
        <h2 className="text-5xl font-bold text-[#4B4B4B] mb-12">Featured Listings</h2>
        <div className="animate-pulse">
          <div className="bg-white">
            <div className="h-[500px] p-4">
              <div className="w-full h-full bg-gray-200 rounded-lg"></div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="bg-gray-200 h-6 rounded flex-1"></div>
                <div className="bg-gray-200 h-8 rounded w-32 ml-4"></div>
              </div>
              <div className="flex gap-6">
                <div className="bg-gray-200 h-4 rounded w-16"></div>
                <div className="bg-gray-200 h-4 rounded w-16"></div>
                <div className="bg-gray-200 h-4 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="mt-32">
      <h2 className="text-5xl font-bold text-[#4B4B4B] mb-12">Featured Listings</h2>
      
      <div className="relative">
        <style jsx global>{`
          .other-listings-swiper .swiper-slide {
            opacity: 0.4;
            transition: opacity 0.3s ease;
          }
          .other-listings-swiper .swiper-slide-active {
            opacity: 1;
          }
        `}</style>
        <Swiper
          modules={[]}
          onSwiper={set_swiper_instance}
          onSlideChange={(swiper) => set_active_slide_index(swiper.activeIndex)}
          slidesPerView={1}
          spaceBetween={0}
          loop={false}
          initialSlide={1}
          className="other-listings-swiper"
        >
          {properties.map((property, index) => {
            const is_active = index === active_slide_index;
            return (
            <SwiperSlide key={property.id}>
              <div className="bg-white">
                {/* Property Image - Top */}
                {is_active ? (
                  <Link href={`/listing/${property.id}`}>
                    <div className="relative h-[500px] p-4 cursor-pointer">
                      {property.image && property.image.trim() !== "" && !property.image.includes('/house1.jpeg') ? (
                        <Image
                          src={property.image}
                          alt={property.title}
                          fill
                          className="object-cover rounded-3xl"
                          onError={(e) => {
                            const imgElement = e.target as HTMLImageElement;
                            const parent = imgElement.closest('.relative');
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full bg-gray-200 rounded-3xl flex items-center justify-center"><span class="text-gray-500">No Image</span></div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-3xl flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ) : (
                  <div className="relative h-[500px] p-4">
                    {property.image && property.image.trim() !== "" && !property.image.includes('/house1.jpeg') ? (
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className="object-cover rounded-lg"
                        onError={(e) => {
                          const imgElement = e.target as HTMLImageElement;
                          const parent = imgElement.closest('.relative');
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center"><span class="text-gray-500">No Image</span></div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Property Details - Bottom */}
                <div className="p-6">
                  {/* Title and Price on same line */}
                  <div className="flex justify-between items-center mb-4">
                    {is_active ? (
                      <Link href={`/listing/${property.id}`}>
                        <h3 className="text-2xl font-semibold text-gray-900 hover:text-[#D1DA68] transition-colors cursor-pointer">
                          {property.title}
                        </h3>
                      </Link>
                    ) : (
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {property.title}
                      </h3>
                    )}
                    <p className="text-3xl font-bold text-gray-900 ml-4">
                      {property.price}
                      {(property.price.toLowerCase().includes('rental') || 
                        property.price.toLowerCase().includes('rent') ||
                        property.price.toLowerCase().includes('p/m') ||
                        property.price.toLowerCase().includes('per month')) && 
                        !property.price.toLowerCase().includes('per month') && (
                        <span className="text-sm font-normal text-gray-600 ml-1">per month</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Property Stats */}
                  <div className="flex items-center gap-6 text-lg text-gray-600">
                    {property.beds > 0 && (
                      <div className="flex items-center gap-2">
                        <Image
                          src="/icons/bed.png"
                          alt="Bed icon"
                          width={24}
                          height={24}
                        />
                        <span>{property.beds} bed{property.beds !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {property.baths > 0 && (
                      <div className="flex items-center gap-2">
                        <Image
                          src="/icons/bath.png"
                          alt="Bath icon"
                          width={24}
                          height={24}
                        />
                        <span>{property.baths} bath{property.baths !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {property.size > 0 && (
                      <div className="flex items-center gap-2">
                        <Image
                          src="/icons/size.png"
                          alt="Size icon"
                          width={24}
                          height={24}
                        />
                        <span>{property.size} m²</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation Buttons */}
        <button
          className="other-listings-prev absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 bg-[#D1DA68] rounded-full flex items-center justify-center hover:bg-[#C5CE5F] transition-colors shadow-lg"
          onClick={() => {
            const new_index = Math.max(0, active_slide_index - 1);
            swiper_instance?.slideTo(new_index);
          }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          className="other-listings-next absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-10 w-12 h-12 bg-[#D1DA68] rounded-full flex items-center justify-center hover:bg-[#C5CE5F] transition-colors shadow-lg"
          onClick={() => {
            const new_index = Math.min(properties.length - 1, active_slide_index + 1);
            swiper_instance?.slideTo(new_index);
          }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}