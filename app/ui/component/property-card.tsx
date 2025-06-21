"use client";
import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
  image: string;
  title: string;
  price: string;
  beds: number;
  baths: number;
  size: number;
  id?: number;
  propertyId?: number;
  propertyType?: string;
  location?: string | number;
  locationString?: string;
  locationDetail?: any;
}

export default function PropertyCard({
  image,
  title,
  price,
  beds,
  baths,
  size,
  id = 123,
  propertyId,
  propertyType,
  location,
  locationString,
  locationDetail,
}: PropertyCardProps) {
  const propertyUrl = `/listing/${propertyId || id}`;
  const isRental = price?.includes('per month') || price?.includes('p/m') || propertyType?.includes('Rental') || propertyType?.includes('To Let');
  const hasValidImage = image && image.trim() !== "" && !image.includes('/house1.jpeg');

  if (!hasValidImage) {
    return null;
  }

  return (
    <Link href={propertyUrl} className="block h-full">
      <div className="bg-white flex flex-col h-full">
        <div className="relative w-full h-56">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover rounded-2xl shadow-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const cardElement = e.currentTarget.closest('a');
              if (cardElement) {
                cardElement.style.display = 'none';
              }
            }}
          />
        </div>

        <div className="pt-3 pb-1 flex justify-between items-center">
          <div className="text-left">
            <span className="text-[#1e1e1e] font-black text-2xl">
              {price}
              {isRental && <span className="text-base font-normal text-gray-500"> p/m</span>}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-700 text-sm">
            <div className="flex items-center gap-1">
              <Image
                src="/icons/bed.png"
                alt="Bedrooms"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span>{beds}</span>
            </div>

            <div className="flex items-center gap-1">
              <Image
                src="/icons/bath.png"
                alt="Bathrooms"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span>{baths}</span>
            </div>

            <div className="flex items-center gap-1">
              <Image
                src="/icons/size.png"
                alt="Size"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span>{size}m²</span>
            </div>
          </div>
        </div>

        <div className="pt-0 pb-4 flex-grow flex flex-col">
          <div className="mb-2 text-left -mt-1">
            <span className="text-[#1e1e1e] text-sm">
              {locationString || (locationDetail?.area ? (locationDetail.suburb ? `${locationDetail.suburb}, ${locationDetail.area}` : locationDetail.area) : (typeof location === 'number' || (typeof location === 'string' && !isNaN(Number(location))) ? "Unknown Location" : location))}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}